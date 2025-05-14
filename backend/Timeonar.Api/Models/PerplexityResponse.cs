using System.Text.Json.Serialization;

namespace Timeonar.Api.Models;

public class PerplexityResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("choices")]
    public List<PerplexityChoice>? Choices { get; set; }
}

public class PerplexityChoice
{
    [JsonPropertyName("message")]
    public PerplexityMessage? Message { get; set; }
}

public class PerplexityMessage
{
    [JsonPropertyName("content")]
    public string? Content { get; set; }
}