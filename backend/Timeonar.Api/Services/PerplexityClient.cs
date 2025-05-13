using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Timeonar.Api.Models;

namespace Timeonar.Api.Services;

public class PerplexityClient
{
    private readonly HttpClient _httpClient = new HttpClient();
    private readonly IConfiguration _configuration;
    private readonly ILogger<PerplexityClient> _logger;

    public PerplexityClient(IConfiguration configuration, ILogger<PerplexityClient> logger)
    {
        _configuration = configuration;
        _logger = logger;
        _httpClient.BaseAddress = new Uri("https://api.perplexity.ai/");
    }

    public async Task<TimelineData> GetTimelineAsync(string topic)
    {
        try
        {
            // Get API key from configuration or environment variable
            var apiKey = _configuration["SonarApi:ApiKey"] ?? 
                         Environment.GetEnvironmentVariable("SONARAPI_APIKEY");
            
            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogError("API key for Perplexity API not found");
                throw new InvalidOperationException("Perplexity API key not configured");
            }
            
            // Set up authentication header
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            
            // Get a detailed prompt from the SonarPromptBuilder
            var prompt = SonarPromptBuilder.BuildTimelinePrompt(topic);

            // Prepare the request to Perplexity
            var requestBody = new
            {
                model = "sonar-pro",
                max_tokens = 8000, // new token limit
                temperature = 0.7,
                messages = new[]
                {
                    new { role = "system", content = "You are a specialized timeline generation assistant. Provide responses only in valid JSON format." },
                    new { role = "user", content = prompt }
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            _logger.LogInformation("Calling Perplexity API for topic: {Topic}", topic);
            
            // Make the API call
            var response = await _httpClient.PostAsync("chat/completions", content);
            var responseJson = await response.Content.ReadAsStringAsync();
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("API call failed: {StatusCode}, Response: {Response}", 
                    (int)response.StatusCode, responseJson);
                return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
            }
            
            _logger.LogInformation("Received response from Perplexity API");
            
            // Parse the response
            using var jsonDoc = JsonDocument.Parse(responseJson);
            var responseText = jsonDoc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? string.Empty;
            
            // Extract JSON from response text
            return ExtractTimelineData(responseText, topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Perplexity API");
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
    }
    
    private TimelineData ExtractTimelineData(string responseText, string topic)
    {
        try
        {
            // Find the JSON object in the response
            var startIndex = responseText.IndexOf('{');
            var endIndex = responseText.LastIndexOf('}') + 1;
            
            if (startIndex >= 0 && endIndex > startIndex)
            {
                var jsonPart = responseText.Substring(startIndex, endIndex - startIndex);
                _logger.LogDebug("Extracted JSON: {Json}", jsonPart);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                return JsonSerializer.Deserialize<TimelineData>(jsonPart, options) ?? 
                    new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
            }
            
            _logger.LogWarning("Failed to extract JSON from response");
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing timeline data");
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
    }
} 