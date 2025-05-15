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
        // Validate the request origin
        if (!IsValidOrigin(Request))
        {
            _logger.LogWarning("Unauthorized access attempt from origin: {Origin}", 
                Request.Headers.Origin.ToString());
            Response.StatusCode = 403; // Forbidden
            await Response.WriteAsync("Access denied: Invalid origin");
            return;
        }

        // Set response headers
        Response.Headers["Content-Type"] = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["Connection"] = "keep-alive";
        
        // Add a timeout to the operation
        using var timeoutCts = new CancellationTokenSource(TimeSpan.FromMinutes(5));
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(
            timeoutCts.Token, 
            HttpContext.RequestAborted);
        var cancellationToken = linkedCts.Token;
        
        try
        {
            _logger.LogInformation("Starting SSE stream for topic: {Topic}", topic);
            
            // First, get the base timeline with timeout
            var baseTimelineTask = _perplexityClient.GetBaseTimelineAsync(topic);
            if (await Task.WhenAny(baseTimelineTask, Task.Delay(60000, cancellationToken)) != baseTimelineTask)
            {
                // Timeout occurred
                await WriteEventAsync("error", "Timeout while generating timeline data", cancellationToken);
                return;
            }
            
            var baseTimeline = await baseTimelineTask;
            
            if (baseTimeline.Timeline == null || !baseTimeline.Timeline.Any())
            {
                await WriteEventAsync("error", "Failed to generate timeline data", cancellationToken);
                return;
            }
            
            // Rest of your code...
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing timeline stream for topic: {Topic}", topic);
            
            // Only try to send an error if the connection is still active
            if (!cancellationToken.IsCancellationRequested && !Response.HasStarted)
            {
                try
                {
                    await WriteEventAsync("error", $"Error: {ex.Message}", cancellationToken);
                }
                catch
                {
                    // If we can't even send the error, just log it
                    _logger.LogError("Failed to send error message to client");
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
        var allowedOrigins = new[] 
        { 
            "https://timeonar.vercel.app",
            "http://localhost:5173" // For local development
        };
        
        // Check if the origin header exists and is in our allowed list
        return !string.IsNullOrEmpty(origin) && allowedOrigins.Contains(origin);
    }
}