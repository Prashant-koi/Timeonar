using System.Text;
using System.Text.Json;
using Timeonar.Api.Models;

namespace Timeonar.Api.Services;

public class ProgressiveTimelineService
{
    private readonly PerplexityClient _perplexityClient;
    private readonly ILogger<ProgressiveTimelineService> _logger;

    public ProgressiveTimelineService(PerplexityClient perplexityClient, ILogger<ProgressiveTimelineService> logger)
    {
        _perplexityClient = perplexityClient;
        _logger = logger;
    }

    public async Task<TimelineData> GetCompleteTimelineAsync(string topic)
    {
        try
        {
            _logger.LogInformation("Getting complete timeline for {Topic} using PerplexityClient", topic);
            return await _perplexityClient.GetCompleteTimelineAsync(topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting complete timeline for {Topic}", topic);
            throw;
        }
    }

    // Keep this method for backwards compatibility with any code that calls it
    private async Task<TimelineData> GetBasicTimelineAsync(string topic)
    {
        return await _perplexityClient.GetBaseTimelineAsync(topic);
    }
}