using Microsoft.AspNetCore.Mvc;
using Timeonar.Api.Models;
using Timeonar.Api.Services;

namespace Timeonar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimelineController : ControllerBase
{
    private readonly PerplexityClient _perplexityClient;
    private readonly ILogger<TimelineController> _logger;

    public TimelineController(PerplexityClient perplexityClient, ILogger<TimelineController> logger)
    {
        _perplexityClient = perplexityClient;
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
}