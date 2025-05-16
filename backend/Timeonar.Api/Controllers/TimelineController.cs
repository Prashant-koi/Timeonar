using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Timeonar.Api.Models;
using Timeonar.Api.Services;
using System.Text;

namespace Timeonar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimelineController : ControllerBase
{
    private readonly PerplexityClient _perplexityClient;
    private readonly ProgressiveTimelineService _progressiveTimelineService;
    private readonly ILogger<TimelineController> _logger;
    private readonly IConfiguration _configuration;

    public TimelineController(
        PerplexityClient perplexityClient, 
        ProgressiveTimelineService progressiveTimelineService,
        IConfiguration configuration,
        ILogger<TimelineController> logger)
    {
        _perplexityClient = perplexityClient;
        _progressiveTimelineService = progressiveTimelineService;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("{topic}")]
    public async Task<ActionResult<TimelineData>> GetTimeline(string topic)
    {
        try
        {
            _logger.LogInformation("Fetching timeline for topic: {Topic}", topic);
            var result = await _perplexityClient.GetTimelineAsync(topic);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing timeline request for topic {Topic}", topic);
            return StatusCode(500, new { error = "An error occurred processing your request" });
        }
    }

    [HttpGet("progressive/{topic}")]
    public async Task<ActionResult<TimelineData>> GetProgressiveTimeline(string topic)
    {
        try
        {
            var timeline = await _progressiveTimelineService.GetCompleteTimelineAsync(topic);
            return Ok(timeline);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating progressive timeline for topic {Topic}", topic);
            return StatusCode(500, new { error = "Error generating timeline" });
        }
    }

    [HttpGet("stream/{topic}")]
    public async Task GetTimelineStream(string topic)
    {
        // IMPORTANT: First log the origin
        var origin = Request.Headers.Origin.ToString();
        _logger.LogInformation("Request from origin: {Origin}", origin);

        // Get allowed origins
        var originsConfig = _configuration["ALLOWED_ORIGINS"] ?? "https://timeonar.vercel.app,http://localhost:5173";
        var allowedOrigins = originsConfig.Split(',', StringSplitOptions.RemoveEmptyEntries);
        _logger.LogInformation("Configured allowed origins: {AllowedOrigins}", string.Join(", ", allowedOrigins));

        // Check if origin is valid
        bool isValidOrigin = string.IsNullOrEmpty(origin) || allowedOrigins.Contains(origin);
        _logger.LogInformation("Origin valid: {IsValid}", isValidOrigin);

        // For CORS preflight requests
        if (Request.Method == "OPTIONS")
        {
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            Response.Headers.Add("Access-Control-Max-Age", "86400");
            Response.StatusCode = 204; // No content
            return;
        }

        // Add CORS headers for valid origins
        if (!string.IsNullOrEmpty(origin) && allowedOrigins.Contains(origin))
        {
            Response.Headers["Access-Control-Allow-Origin"] = origin;
            Response.Headers["Access-Control-Allow-Credentials"] = "true";
        }

        // Set SSE response headers
        Response.Headers["Content-Type"] = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["Connection"] = "keep-alive";

        var cancellationToken = HttpContext.RequestAborted;

        try
        {
            _logger.LogInformation("Starting SSE stream for topic: {Topic}", topic);

            // First, see if we can generate a simple response to verify the API connection
            await WriteEventAsync("status", "Starting timeline generation...", cancellationToken);
            await Task.Delay(500, cancellationToken); // Small delay to ensure headers are sent

            // Send a heartbeat to keep the connection alive
            await WriteEventAsync("heartbeat", DateTime.UtcNow.ToString("o"), cancellationToken);
            
            try
            {
                // Then try to get the base timeline
                var baseTimeline = await _perplexityClient.GetBaseTimelineAsync(topic);

                if (baseTimeline.Timeline == null || !baseTimeline.Timeline.Any())
                {
                    await WriteEventAsync("error", "Failed to generate timeline data", cancellationToken);
                    return;
                }

                // Send the initial timeline data
                await WriteEventAsync("baseData", JsonSerializer.Serialize(baseTimeline), cancellationToken);
                await WriteEventAsync("status", "Base timeline generated successfully", cancellationToken);

                try {
                    // Now enrich with methodology information
                    await WriteEventAsync("status", "Adding methodology and theoretical paradigm information...", cancellationToken);
                    
                    // Process each item to add methodology data
                    foreach (var item in baseTimeline.Timeline) 
                    {
                        // Call the PerplexityClient to get methodology info
                        await _perplexityClient.EnrichEntryWithMethodologyData(item, topic, cancellationToken);
                        
                        // Send the updated item to the client
                        await WriteEventAsync("methodologyUpdate", JsonSerializer.Serialize(item), cancellationToken);
                        
                        // Add a small delay to prevent overwhelming the client and API
                        await Task.Delay(200, cancellationToken);
                    }
                    
                    // Signal that methodology enrichment is complete
                    await WriteEventAsync("methodologyComplete", "Methodology enrichment complete", cancellationToken);
                    
                    // Now process source information
                    await WriteEventAsync("status", "Adding source information and citations...", cancellationToken);
                    
                    // Process each item to add source data
                    foreach (var item in baseTimeline.Timeline) 
                    {
                        // Call the PerplexityClient to get source info
                        await _perplexityClient.EnrichEntryWithSourceData(item, topic, cancellationToken);
                        
                        // Send the updated item to the client
                        await WriteEventAsync("sourceUpdate", JsonSerializer.Serialize(item), cancellationToken);
                        
                        // Add a small delay to prevent overwhelming the client and API
                        await Task.Delay(200, cancellationToken);
                    }
                }
                catch (Exception enrichException) {
                    _logger.LogError(enrichException, "Error during timeline enrichment for {Topic}", topic);
                    // Don't throw here, as we want to still signal completion with the base data
                }

                // Signal completion
                await WriteEventAsync("complete", "Timeline generation complete", cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while generating timeline for {Topic}", topic);
                await WriteEventAsync("error", $"Error generating timeline: {ex.Message}", cancellationToken);
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Client disconnected from SSE stream for topic: {Topic}", topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing timeline stream for topic: {Topic}", topic);

            // Only try to send an error if the connection is still active
            if (!cancellationToken.IsCancellationRequested && !Response.HasStarted)
            {
                try
                {
                    await WriteEventAsync("error", ex.Message, cancellationToken);
                }
                catch
                {
                    // Ignore errors in error reporting
                }
            }
        }
    }

    private async Task WriteEventAsync(string eventType, string data, CancellationToken cancellationToken)
    {
        try
        {
            await Response.WriteAsync($"event: {eventType}\n", cancellationToken);
            await Response.WriteAsync($"data: {data}\n\n", cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);
        }
        catch (OperationCanceledException)
        {
            // This is expected when the client disconnects
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error writing event to stream");
            throw;
        }
    }

    private bool IsValidOrigin(HttpRequest request)
    {
        var origin = request.Headers.Origin.ToString();
        _logger.LogInformation("Checking origin: {Origin}", origin);
        
        var originsConfig = _configuration["ALLOWED_ORIGINS"] ?? "https://timeonar.vercel.app,http://localhost:5173";
        var allowedOrigins = originsConfig.Split(',', StringSplitOptions.RemoveEmptyEntries);
        _logger.LogInformation("Allowed origins: {AllowedOrigins}", string.Join(", ", allowedOrigins));
        
        bool isValid = !string.IsNullOrEmpty(origin) && allowedOrigins.Contains(origin);
        _logger.LogInformation("Origin valid: {IsValid}", isValid);
        return isValid;
    }
}