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

    public TimelineController(
        PerplexityClient perplexityClient, 
        ProgressiveTimelineService progressiveTimelineService,
        ILogger<TimelineController> logger)
    {
        _perplexityClient = perplexityClient;
        _progressiveTimelineService = progressiveTimelineService;
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
        // Set response headers
        Response.Headers.Add("Content-Type", "text/event-stream");
        Response.Headers.Add("Cache-Control", "no-cache");
        Response.Headers.Add("Connection", "keep-alive");
        
        // Add a timeout to the operation
        using var timeoutCts = new CancellationTokenSource(TimeSpan.FromMinutes(5));
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(
            timeoutCts.Token, 
            HttpContext.RequestAborted);
        var cancellationToken = linkedCts.Token;
        
        try
        {
            _logger.LogInformation("Starting SSE stream for topic: {Topic}", topic);
            
            // First, get the base timeline
            var baseTimeline = await _perplexityClient.GetBaseTimelineAsync(topic);
            
            if (baseTimeline.Timeline == null || !baseTimeline.Timeline.Any())
            {
                await WriteEventAsync("error", "Failed to generate timeline data", cancellationToken);
                return;
            }
            
            // Send the initial timeline data
            await WriteEventAsync("baseData", JsonSerializer.Serialize(baseTimeline), cancellationToken);
            
            // Then enrich each item one by one with methodology data
            foreach (var item in baseTimeline.Timeline)
            {
                // Check if client disconnected
                if (cancellationToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Client disconnected during methodology processing");
                    return;
                }
                
                await _perplexityClient.EnrichEntryWithMethodologyData(item, topic, cancellationToken);
                await WriteEventAsync("methodologyUpdate", JsonSerializer.Serialize(item), cancellationToken);
            }
            
            // Signal methodology enrichment is complete
            if (!cancellationToken.IsCancellationRequested)
            {
                await WriteEventAsync("methodologyComplete", "Methodology enrichment complete", cancellationToken);
            }
            
            // Finally enrich with sources
            foreach (var item in baseTimeline.Timeline)
            {
                // Check if client disconnected
                if (cancellationToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Client disconnected during source processing");
                    return;
                }
                
                await _perplexityClient.EnrichEntryWithSourceData(item, topic, cancellationToken);
                await WriteEventAsync("sourceUpdate", JsonSerializer.Serialize(item), cancellationToken);
            }
            
            // Signal completion
            if (!cancellationToken.IsCancellationRequested)
            {
                await WriteEventAsync("complete", "Timeline generation complete", cancellationToken);
            }
        }
        catch (OperationCanceledException)
        {
            if (timeoutCts.IsCancellationRequested)
            {
                _logger.LogInformation("Timeline stream timed out for topic: {Topic}", topic);
            }
            else
            {
                _logger.LogInformation("Client disconnected from SSE stream for topic: {Topic}", topic);
            }
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
}