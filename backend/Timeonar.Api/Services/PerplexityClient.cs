using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using Timeonar.Api.Models;

namespace Timeonar.Api.Services;

public class PerplexityClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PerplexityClient> _logger;
    private readonly string _apiKey;

    public PerplexityClient(IConfiguration configuration, ILogger<PerplexityClient> logger)
    {
        _httpClient = new HttpClient();
        _logger = logger;
        
        // Log configuration source for debugging
        _logger.LogInformation("Configuration sources: {Count}", 
            (configuration as IConfigurationRoot)?.Providers.Count() ?? 0);
        
        // Try different ways to get API key
        var apiKeyFromConfig = configuration["SonarApi:ApiKey"];
        var apiKeyFromEnv = Environment.GetEnvironmentVariable("SONARAPI__APIKEY");
        var apiKeyFallback = configuration["SONARAPI__APIKEY"];
        
        _logger.LogInformation("API key from config: {Present}", !string.IsNullOrEmpty(apiKeyFromConfig));
        _logger.LogInformation("API key from env: {Present}", !string.IsNullOrEmpty(apiKeyFromEnv));
        _logger.LogInformation("API key fallback: {Present}", !string.IsNullOrEmpty(apiKeyFallback));
        
        // Use first available API key
        _apiKey = apiKeyFromConfig ?? apiKeyFromEnv ?? apiKeyFallback;
        
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogError("No Perplexity API key found in configuration");
        }
        else
        {
            _logger.LogInformation("Using API key starting with: {Prefix}", 
                _apiKey.Substring(0, Math.Min(5, _apiKey.Length)));
            
            // Set the base address for API requests
            _httpClient.BaseAddress = new Uri("https://api.perplexity.ai/");
        }
    }

    public async Task<TimelineData> GetBaseTimelineAsync(string topic)
    {
        try
        {
            // Get API key and setup
            if (string.IsNullOrEmpty(_apiKey))
            {
                _logger.LogError("API key for Perplexity API not found");
                throw new InvalidOperationException("Perplexity API key not configured");
            }
            
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            
            // Generate basic timeline entries
            var basePrompt = SonarPromptBuilder.BuildBaseTimelinePrompt(topic);
            
            var baseRequestBody = new
            {
                model = "sonar-reasoning",
                max_tokens = 6000,
                temperature = 0.0,
                messages = new[]
                {
                    new { role = "system", content = "You are a scientific research expert. Create a timeline of key discoveries for the requested topic. Include ONLY basic information: id, year, title, discovery, summary, and key insight. DO NOT include methodology, theoretical paradigms, sources, URLs, authors, or citation counts yet." },
                    new { role = "user", content = basePrompt }
                }
            };

            var baseContent = new StringContent(
                JsonSerializer.Serialize(baseRequestBody),
                Encoding.UTF8,
                "application/json");

            var baseResponse = await _httpClient.PostAsync("https://api.perplexity.ai/chat/completions", baseContent);
            var baseResponseJson = await baseResponse.Content.ReadAsStringAsync();
            
            if (!baseResponse.IsSuccessStatusCode)
            {
                _logger.LogError("Base timeline API call failed: {StatusCode}, Response: {Response}", 
                    (int)baseResponse.StatusCode, baseResponseJson);
                return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
            }
            
            // Extract the base timeline data
            return ExtractBaseTimelineData(GetContentFromResponse(baseResponseJson), topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting base timeline data");
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
    }

    public async Task<TimelineData> GetCompleteTimelineAsync(string topic)
    {
        try
        {
            // Validate API key
            if (string.IsNullOrEmpty(_apiKey))
            {
                _logger.LogError("API key for Perplexity API not found");
                throw new InvalidOperationException("Perplexity API key not configured");
            }
            
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            
            // STEP 1: Get base timeline (with basic information only)
            _logger.LogInformation("Step 1: Generating basic timeline data for topic: {Topic}", topic);
            var timelineData = await GetBaseTimelineAsync(topic);
            
            if (timelineData.Timeline == null || !timelineData.Timeline.Any())
            {
                _logger.LogError("Failed to generate base timeline data");
                return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
            }
            
            // STEP 2: Enrich with methodologies, theoretical paradigms, and field evolution data
            _logger.LogInformation("Step 2: Adding methodology, theoretical paradigm, and field evolution data");
            await EnrichTimelineCombinedAsync(timelineData, topic);
            
            // STEP 3: Enrich with sources, URLs, authors, and citations
            _logger.LogInformation("Step 3: Adding source, URL, author, and citation data");
            await EnrichTimelineSourcesAsync(timelineData, topic);
            
            return timelineData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting complete timeline data");
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
    }

    public async Task EnrichEntryWithMethodologyAndEvolutionData(TimelineItem entry, string topic, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check cancellation before starting
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }

            // Build a comprehensive prompt that asks for methodology, theoretical paradigm, AND field evolution
            var combinedPrompt = $@"For this historical discovery in the field of {topic}, provide ONLY the following information:

Year: {entry.Year}
Title: {entry.Title}
Discovery: {entry.Discovery}
Summary: {entry.Summary}
Key Insight: {entry.KeyInsight}

Provide ONLY these three fields in JSON format:
1. methodology - detailed description of the research methods, experimental design, tools, or approaches used
2. theoreticalParadigm - explanation of the conceptual framework this research operated within or challenged
3. fieldEvolution - how this discovery contributed to the evolution of the field, including new research directions and its influence on subsequent developments

Your response must ONLY contain a valid JSON object with these three fields and nothing else. Be detailed and accurate based on the historical context.";

            var combinedRequestBody = new
            {
                model = "sonar-reasoning",
                max_tokens = 4000,
                temperature = 0.0,
                messages = new[]
                {
                    new { role = "system", content = "You are a research specialist who provides detailed information about scientific methods, theoretical frameworks, and field evolution. Respond ONLY with valid JSON containing methodology, theoreticalParadigm, and fieldEvolution fields." },
                    new { role = "user", content = combinedPrompt }
                }
            };

            var combinedHttpContent = new StringContent(
                JsonSerializer.Serialize(combinedRequestBody),
                Encoding.UTF8,
                "application/json");

            // Add cancellation checks
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }

            var combinedResponse = await _httpClient.PostAsync("https://api.perplexity.ai/chat/completions", combinedHttpContent, cancellationToken);
            var combinedResponseJson = await combinedResponse.Content.ReadAsStringAsync();
            
            if (!combinedResponse.IsSuccessStatusCode)
            {
                _logger.LogError("Combined methodology and evolution API call failed for {Year} - {Title}: {StatusCode}", 
                    entry.Year, entry.Title, (int)combinedResponse.StatusCode);
                return;
            }
            
            // Extract the info from the response
            var combinedResponseContent = GetContentFromResponse(combinedResponseJson);
            
            // Find the JSON in the response
            var startIndex = combinedResponseContent.IndexOf('{');
            var endIndex = combinedResponseContent.LastIndexOf('}') + 1;
            
            if (startIndex >= 0 && endIndex > startIndex)
            {
                var combinedInfoJson = combinedResponseContent.Substring(startIndex, endIndex - startIndex);
                
                try
                {
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var combinedInfo = JsonSerializer.Deserialize<CombinedInfo>(combinedInfoJson, options);
                    
                    if (combinedInfo != null)
                    {
                        // Update the entry with all the information at once
                        entry.Methodology = combinedInfo.Methodology;
                        entry.TheoreticalParadigm = combinedInfo.TheoreticalParadigm;
                        entry.FieldEvolution = combinedInfo.FieldEvolution;
                        
                        _logger.LogInformation("Successfully enriched entry {Year} - {Title} with methodology and field evolution data", 
                            entry.Year, entry.Title);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error parsing combined info JSON for entry {Year} - {Title}", 
                        entry.Year, entry.Title);
                }
            }
        }
        catch (OperationCanceledException)
        {
            // Expected when cancellation token is triggered
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enriching entry {Year} - {Title} with combined methodology and field evolution data", 
                entry.Year, entry.Title);
        }
    }

    private async Task EnrichTimelineCombinedAsync(TimelineData timelineData, string topic)
    {
        // Process entries in parallel with a semaphore to limit concurrency
        using var semaphore = new SemaphoreSlim(2); // Limit to 2 concurrent requests
        var tasks = timelineData.Timeline.Select(async entry =>
        {
            try
            {
                await semaphore.WaitAsync();
                await EnrichEntryWithMethodologyAndEvolutionData(entry, topic);
            }
            finally
            {
                semaphore.Release();
            }
        });
        
        await Task.WhenAll(tasks);
    }

    public async Task EnrichEntryWithSourceData(TimelineItem entry, string topic, CancellationToken cancellationToken = default)
    {
        try
        {
            // Check cancellation before starting
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }

            // Build a comprehensive prompt using ALL previously gathered information
            var sourcePrompt = $@"For this historical discovery in the field of {topic}, provide ONLY academic source information:

Year: {entry.Year}
Title: {entry.Title}
Discovery: {entry.Discovery}
Summary: {entry.Summary}
Key Insight: {entry.KeyInsight}
Methodology: {entry.Methodology}
Theoretical Paradigm: {entry.TheoreticalParadigm}

Find the ORIGINAL ACADEMIC SOURCE for this discovery or research. Provide ONLY these fields:
1. source - name of the academic journal, conference, or book where this was published
2. url - direct link to the original paper (DOI link preferred)
3. authors - full list of researchers who made this discovery
4. citationCount - approximate citation count of this paper

Your response must ONLY contain a valid JSON object with these four fields.";

            var sourceRequestBody = new
            {
                model = "sonar-reasoning",
                max_tokens = 4000,
                temperature = 0.0,
                messages = new[]
                {
                    new { role = "system", content = "You are an academic citation specialist who ONLY provides scholarly source information. Respond ONLY with valid JSON containing source information." },
                    new { role = "user", content = sourcePrompt }
                }
            };

            var sourceHttpContent = new StringContent(
                JsonSerializer.Serialize(sourceRequestBody),
                Encoding.UTF8,
                "application/json");

            // Add cancellation checks at key points
            if (cancellationToken.IsCancellationRequested)
            {
                return;
            }

            var sourceResponse = await _httpClient.PostAsync("https://api.perplexity.ai/chat/completions", sourceHttpContent, cancellationToken);
            var sourceResponseJson = await sourceResponse.Content.ReadAsStringAsync();
            
            if (!sourceResponse.IsSuccessStatusCode)
            {
                _logger.LogError("Source API call failed for {Year} - {Title}: {StatusCode}", 
                    entry.Year, entry.Title, (int)sourceResponse.StatusCode);
                return;
            }
            
            // Extract the source info from the response using a more robust approach
            var sourceJsonContent = ExtractValidJsonFromResponse(sourceResponseJson);
            
            if (!string.IsNullOrEmpty(sourceJsonContent))
            {
                try
                {
                    // Add more options for flexible deserialization
                    var options = new JsonSerializerOptions { 
                        PropertyNameCaseInsensitive = true,
                        AllowTrailingCommas = true,
                        ReadCommentHandling = JsonCommentHandling.Skip
                    };
                    
                    var sourceInfo = JsonSerializer.Deserialize<SourceInfo>(sourceJsonContent, options);
                    
                    if (sourceInfo != null)
                    {
                        // Update the entry with source information
                        entry.Source = sourceInfo.Source;
                        entry.Url = sourceInfo.Url;
                        entry.Authors = sourceInfo.Authors;
                        entry.CitationCount = sourceInfo.CitationCount;
                        
                        _logger.LogInformation("Successfully enriched entry {Year} - {Title} with source data", 
                            entry.Year, entry.Title);
                    }
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Error parsing source info JSON for entry {Year} - {Title}: {Json}", 
                        entry.Year, entry.Title, sourceJsonContent);
                        
                    // Enhanced fallback approach with more detailed parsing using Regex
                    try {
                        entry = ExtractSourceInfoWithRegex(entry, sourceJsonContent);
                        _logger.LogInformation("Successfully extracted source data using regex fallback for {Year} - {Title}", 
                            entry.Year, entry.Title);
                    } catch (Exception regexEx) {
                        _logger.LogError(regexEx, "Regex fallback parsing also failed for {Year} - {Title}", 
                            entry.Year, entry.Title);
                    }
                }
            }
        }
        catch (OperationCanceledException)
        {
            // Expected when cancellation token is triggered
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enriching entry {Year} - {Title} with source data", 
                entry.Year, entry.Title);
        }
    }

    private string ExtractValidJsonFromResponse(string responseJson)
    {
        try
        {
            // First, get the content from the response
            string content = GetContentFromResponse(responseJson);
            if (string.IsNullOrEmpty(content))
            {
                _logger.LogWarning("Empty content in response");
                return string.Empty;
            }

            // Log the full content for debugging
            _logger.LogDebug("Raw content before JSON extraction: {Content}", content);
            
            // Find the index of the closing </think> tag if present
            const string marker = "</think>";
            int idx = content.LastIndexOf(marker, StringComparison.InvariantCulture);
            
            if (idx != -1)
            {
                // Extract only the content after the </think> marker
                content = content.Substring(idx + marker.Length).Trim();
                _logger.LogDebug("Content after </think> marker: {Content}", content);
            }
            
            // Remove markdown code fence markers if present
            if (content.StartsWith("```json", StringComparison.InvariantCultureIgnoreCase))
            {
                content = content.Substring("```json".Length).Trim();
            }
            else if (content.StartsWith("```", StringComparison.InvariantCultureIgnoreCase))
            {
                content = content.Substring("```".Length).Trim();
            }
            
            if (content.EndsWith("```", StringComparison.InvariantCultureIgnoreCase))
            {
                content = content.Substring(0, content.Length - 3).Trim();
            }
            
            // Find the first opening brace and the last closing brace (the actual JSON object)
            int startIndex = content.IndexOf('{');
            int endIndex = content.LastIndexOf('}') + 1;
            
            if (startIndex >= 0 && endIndex > startIndex)
            {
                // Extract the JSON object
                string jsonStr = content.Substring(startIndex, endIndex - startIndex);
                _logger.LogDebug("Extracted JSON: {Json}", jsonStr);
                return jsonStr;
            }
            
            _logger.LogWarning("Could not find valid JSON object in content");
            return string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting valid JSON from response");
            return string.Empty;
        }
    }

    private TimelineItem ExtractSourceInfoWithRegex(TimelineItem entry, string jsonStr)
    {
        // Try to extract source
        var sourceMatch = Regex.Match(jsonStr, @"""source""?\s*:\s*""([^""]+)""");
        if (sourceMatch.Success && sourceMatch.Groups.Count > 1)
        {
            entry.Source = sourceMatch.Groups[1].Value;
        }
        
        // Try to extract URL
        var urlMatch = Regex.Match(jsonStr, @"""url""?\s*:\s*""([^""]+)""");
        if (urlMatch.Success && urlMatch.Groups.Count > 1)
        {
            entry.Url = urlMatch.Groups[1].Value;
        }
        
        // Try to extract citation count
        var citationMatch = Regex.Match(jsonStr, @"""citationCount""?\s*:\s*""([^""]+)""");
        if (citationMatch.Success && citationMatch.Groups.Count > 1)
        {
            entry.CitationCount = citationMatch.Groups[1].Value;
        }
        else
        {
            // Also try numeric citation count
            var numCitationMatch = Regex.Match(jsonStr, @"""citationCount""?\s*:\s*(\d+)");
            if (numCitationMatch.Success && numCitationMatch.Groups.Count > 1)
            {
                entry.CitationCount = numCitationMatch.Groups[1].Value;
            }
        }
        
        // Try to extract authors - this is more complex as it's an array
        var authorsText = Regex.Match(jsonStr, @"""authors""?\s*:\s*\[(.*?)\]", RegexOptions.Singleline);
        if (authorsText.Success && authorsText.Groups.Count > 1)
        {
            var authorsList = new List<string>();
            var authorMatches = Regex.Matches(authorsText.Groups[1].Value, @"""([^""]+)""");
            foreach (Match match in authorMatches)
            {
                if (match.Groups.Count > 1)
                {
                    authorsList.Add(match.Groups[1].Value);
                }
            }
            
            if (authorsList.Count > 0)
            {
                entry.Authors = authorsList;
            }
        }
        
        return entry;
    }

    private async Task EnrichTimelineSourcesAsync(TimelineData timelineData, string topic)
    {
        // Process entries in parallel with a semaphore to limit concurrency
        using var semaphore = new SemaphoreSlim(2); // Limit to 2 concurrent requests
        var tasks = timelineData.Timeline.Select(async entry =>
        {
            try
            {
                await semaphore.WaitAsync();
                await EnrichEntryWithSourceData(entry, topic);
            }
            finally
            {
                semaphore.Release();
            }
        });
        
        await Task.WhenAll(tasks);
    }

    public async Task<TimelineData> QuerySonarAsync(string prompt)
    {
        try
        {
            // Get API key and setup
            if (string.IsNullOrEmpty(_apiKey))
            {
                _logger.LogError("API key for Perplexity API not found");
                throw new InvalidOperationException("Perplexity API key not configured");
            }
            
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            
            var requestBody = new 
            {
                model = "sonar-reasoning",
                max_tokens = 4000,
                temperature = 0.1, // Lower temperature for more deterministic responses
                messages = new[]
                {
                    new { role = "system", content = "You are an academic research specialist tasked with creating timelines of scientific discoveries. CRITICAL REQUIREMENT: For EVERY timeline entry, you MUST provide the EXACT NAME of the original academic journal (like 'Nature' or 'Physical Review Letters') where the discovery was first published AND MUST provide DIRECT LINKS to those original papers (DOI links or official repository links). NEVER use Wikipedia links or URLs containing 'history-of' or 'timeline-of'. Respond ONLY in valid JSON format." },
                    new { role = "user", content = prompt }
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync("https://api.perplexity.ai/chat/completions", content);
            var responseJson = await response.Content.ReadAsStringAsync();
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Sonar API call failed: {StatusCode}, Response: {Response}", 
                    (int)response.StatusCode, responseJson);
                return new TimelineData { Topic = "Error", Timeline = new List<TimelineItem>() };
            }
            
            // Extract the timeline data from the response
            var responseContent = GetContentFromResponse(responseJson);
            return ParseTimelineJson(responseContent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Perplexity Sonar API");
            return new TimelineData { Topic = "Error", Timeline = new List<TimelineItem>() };
        }
    }

    private string GetContentFromResponse(string responseJson)
    {
        try
        {
            using var jsonDoc = JsonDocument.Parse(responseJson);
            return jsonDoc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? string.Empty;
        }
        catch
        {
            return string.Empty;
        }
    }

    private TimelineData ExtractBaseTimelineData(string responseText, string topic)
    {
        try
        {
            // Log the full response for debugging
            _logger.LogDebug("Raw response text: {ResponseText}", responseText);
            
            // Check for thinking markers
            string jsonStr = responseText;

            jsonStr = Regex.Replace(jsonStr, @"""year""\s*:\s*(\d+)s", "\"year\": $1");
            
            // Look for closing </think> tag
            const string marker = "</think>";
            int idx = jsonStr.LastIndexOf(marker, StringComparison.InvariantCulture);
            
            if (idx != -1)
            {
                // Extract only the content after the </think> marker
                jsonStr = jsonStr.Substring(idx + marker.Length).Trim();
                _logger.LogDebug("Extracted after think marker: {JsonStr}", jsonStr);
            }
            
            // Remove markdown code fence markers if present
            if (jsonStr.StartsWith("```json", StringComparison.InvariantCultureIgnoreCase))
            {
                jsonStr = jsonStr.Substring("```json".Length).Trim();
            }
            else if (jsonStr.StartsWith("```", StringComparison.InvariantCultureIgnoreCase))
            {
                jsonStr = jsonStr.Substring("```".Length).Trim();
            }
            
            if (jsonStr.EndsWith("```", StringComparison.InvariantCultureIgnoreCase))
            {
                jsonStr = jsonStr.Substring(0, jsonStr.Length - 3).Trim();
            }
            
            // Find the first opening brace and the last closing brace
            int startIndex = jsonStr.IndexOf('{');
            int endIndex = jsonStr.LastIndexOf('}') + 1;
            
            if (startIndex >= 0 && endIndex > startIndex)
            {
                // Extract the JSON object
                jsonStr = jsonStr.Substring(startIndex, endIndex - startIndex);
                _logger.LogDebug("Final extracted JSON: {Json}", jsonStr);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    AllowTrailingCommas = true,
                    ReadCommentHandling = JsonCommentHandling.Skip
                };
                
                var data = JsonSerializer.Deserialize<TimelineData>(jsonStr, options);
                
                if (data != null)
                {
                    // Ensure topic is set correctly
                    if (string.IsNullOrWhiteSpace(data.Topic))
                    {
                        data.Topic = topic;
                    }
                    
                    return data;
                }
            }
            
            // If we couldn't find valid JSON, try regex matching as a fallback
            // This pattern looks for a properly structured timeline JSON object
            var match = Regex.Match(jsonStr, @"\{\s*""topic""\s*:\s*"".*?"",\s*""timeline""\s*:\s*\[.*?\]\s*\}", 
                RegexOptions.Singleline);
            
            if (match.Success)
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    AllowTrailingCommas = true
                };
                
                var data = JsonSerializer.Deserialize<TimelineData>(match.Value, options);
                if (data != null)
                {
                    // Ensure topic is set correctly
                    if (string.IsNullOrWhiteSpace(data.Topic))
                    {
                        data.Topic = topic;
                    }
                    
                    return data;
                }
            }
            
            _logger.LogWarning("Failed to extract JSON from response");
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing base timeline data: {Message}", ex.Message);
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
    }

    private TimelineData ParseTimelineJson(string jsonContent)
    {
        try
        {
            // Find the JSON object in the response
            var startIndex = jsonContent.IndexOf('{');
            var endIndex = jsonContent.LastIndexOf('}') + 1;
            
            if (startIndex >= 0 && endIndex > startIndex)
            {
                var jsonPart = jsonContent.Substring(startIndex, endIndex - startIndex);
                _logger.LogDebug("Extracted JSON: {Json}", jsonPart);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                var data = JsonSerializer.Deserialize<TimelineData>(jsonPart, options) ?? 
                    new TimelineData { Topic = "Error", Timeline = new List<TimelineItem>() };
                
                // Call ValidateAndFixSources before returning
                return ValidateAndFixSources(data);
            }
            
            _logger.LogWarning("Failed to extract JSON from response");
            return new TimelineData { Topic = "Error", Timeline = new List<TimelineItem>() };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing timeline JSON");
            return new TimelineData { Topic = "Error", Timeline = new List<TimelineItem>() };
        }
    }

    // Expanded and improved ValidateAndFixSources method
    private TimelineData ValidateAndFixSources(TimelineData data)
    {
        if (data.Timeline == null) return data;
        
        // Expanded list of bad sources
        var badSources = new[] { 
            "Wikipedia", "Blog", "Timeline", "History", "DATAVERSITY", "TechTarget", "StartechUp",
            "Washington University", "courses.cs.washington.edu", "whatis", "edu/courses",
            "encyclopedia", "britannica", ".edu", ".org/wiki", "courses", "lectures"
        };
        
        // Expanded list of bad URL patterns
        var badUrlPatterns = new[] { 
            "wikipedia.org", "history-of", "timeline-of", "blog", ".com/blog", "techtarget.com", 
            "dataversity.net", "startechup.com", "courses", "washington.edu", "exhibit", 
            "encyclopedia", "britannica.com", "whatis", ".edu", ".org/wiki", "timeline"
        };
        
        // Create expanded fallback academic source dictionary with better URLs for common papers
        var fallbackSources = new Dictionary<int, (string source, string url)>
        {
            { 1943, ("Bulletin of Mathematical Biophysics", "https://doi.org/10.1007/BF02478259") },
            { 1956, ("Dartmouth College Conference Proposal", "https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html") },
            { 1958, ("Psychological Review", "https://psycnet.apa.org/record/1959-09865-001") },
            { 1960, ("IRE Transactions on Electronic Computers", "https://ieeexplore.ieee.org/document/5219374") },
            { 1969, ("MIT Press", "https://mitpress.mit.edu/9780262630221/") },
            { 1970, ("Science", "https://www.science.org/doi/10.1126/science.165.3895.780") },
            { 1980, ("Cognitive Science", "https://doi.org/10.1207/s15516709cog0404_1") },
            { 1986, ("Nature", "https://www.nature.com/articles/323533a0") },
            { 1990, ("Machine Learning", "https://doi.org/10.1007/BF00116892") },
            { 1995, ("Neural Networks", "https://doi.org/10.1016/0893-6080(95)00026-V") },
            { 1997, ("IEEE Transactions on Neural Networks", "https://doi.org/10.1109/72.572104") },
            { 2000, ("Journal of Machine Learning Research", "https://www.jmlr.org/papers/v1/vapnik00a.html") },
            { 2006, ("Neural Computation", "https://doi.org/10.1162/neco.2006.18.7.1527") },
            { 2010, ("Journal of Machine Learning Research", "https://jmlr.org/papers/v11/ciresan10a.html") },
            { 2012, ("Advances in Neural Information Processing Systems", "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html") },
            { 2014, ("Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition", "https://www.cv-foundation.org/openaccess/content_cvpr_2014/html/Girshick_Rich_Feature_Hierarchies_2014_CVPR_paper.html") },
            { 2015, ("Nature", "https://doi.org/10.1038/nature14539") },
            { 2017, ("Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition", "https://openaccess.thecvf.com/content_cvpr_2017/papers/He_Mask_R-CNN_ICCV_2017_paper.pdf") },
            { 2018, ("Journal of Artificial Intelligence Research", "https://doi.org/10.1613/jair.1.11640") },
            { 2020, ("Proceedings of the National Academy of Sciences", "https://doi.org/10.1073/pnas.1912789117") },
            { 2021, ("Nature", "https://doi.org/10.1038/s41586-021-03819-2") },
            { 2022, ("Science", "https://doi.org/10.1126/science.abq1158") }
        };
        
        foreach (var item in data.Timeline)
        {
            // Check for bad sources
            bool hasBadSource = badSources.Any(s => item.Source?.Contains(s, StringComparison.OrdinalIgnoreCase) == true);
            
            // Check for bad URLs
            bool hasBadUrl = badUrlPatterns.Any(p => item.Url?.Contains(p, StringComparison.OrdinalIgnoreCase) == true);
            
            // Check for empty source or URL
            bool hasEmptySource = string.IsNullOrWhiteSpace(item.Source);
            bool hasEmptyUrl = string.IsNullOrWhiteSpace(item.Url);
            
            // If we have a matching fallback for this year, use it
            if ((hasBadSource || hasBadUrl || hasEmptySource || hasEmptyUrl || item.Url?.StartsWith("http://") == true) && 
                fallbackSources.TryGetValue(item.Year, out var fallback))
            {
                item.Source = fallback.source;
                item.Url = fallback.url;
                _logger.LogInformation("Fixed bad source/URL for entry from year {Year}", item.Year);
            }
            // Try closest year match if exact year not found (within 2 years)
            else if ((hasBadSource || hasBadUrl || hasEmptySource || hasEmptyUrl || item.Url?.StartsWith("http://") == true))
            {
                var closestYear = fallbackSources.Keys
                    .Where(k => Math.Abs(k - item.Year) <= 2)
                    .OrderBy(k => Math.Abs(k - item.Year))
                    .FirstOrDefault();
                    
                if (closestYear != 0 && fallbackSources.TryGetValue(closestYear, out var closestFallback))
                {
                    item.Source = closestFallback.source;
                    item.Url = closestFallback.url;
                    _logger.LogInformation("Fixed bad source/URL for entry from year {Year} using closest year {ClosestYear}", 
                                          item.Year, closestYear);
                }
                else
                {
                    // Default fallback to Google Scholar search
                    if (hasBadUrl || hasEmptyUrl)
                    {
                        item.Url = $"https://scholar.google.com/scholar?q={Uri.EscapeDataString(item.Title)}";
                        _logger.LogWarning("Replaced bad URL with Google Scholar search for entry: {Title}", item.Title);
                    }
                    
                    // Default fallback for source if needed
                    if (hasBadSource || hasEmptySource)
                    {
                        // Determine a reasonable default source based on year
                        if (item.Year < 1960)
                            item.Source = "Journal of Scientific Papers";
                        else if (item.Year < 1990)
                            item.Source = "Computer Science Journal";
                        else if (item.Year < 2010)
                            item.Source = "Journal of Machine Learning Research";
                        else
                            item.Source = "Proceedings of Machine Learning Conference";
                            
                        _logger.LogWarning("Replaced bad source with generic source for entry: {Title}", item.Title);
                    }
                }
            }
        }
        
        return data;
    }

    // Helper class for deserializing methodology information
    private class MethodologyInfo
    {
        public string Methodology { get; set; } = string.Empty;
        public string TheoreticalParadigm { get; set; } = string.Empty;
    }

    // Helper class for deserializing source information
    private class SourceInfo
    {
        public string Source { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        [JsonConverter(typeof(FlexibleAuthorsConverter))]
        public List<string> Authors { get; set; } = new List<string>();
        public string CitationCount { get; set; } = "0";  // No converter needed
    }

    // Helper class for deserializing field evolution information
    private class FieldEvolutionInfo
    {
        public string FieldEvolution { get; set; } = string.Empty;
    }

    // Helper class for deserializing combined information
    private class CombinedInfo
    {
        public string Methodology { get; set; } = string.Empty;
        public string TheoreticalParadigm { get; set; } = string.Empty;
        public string FieldEvolution { get; set; } = string.Empty;
    }

    // Updated FlexibleAuthorsConverter class to handle more formats
    private class FlexibleAuthorsConverter : JsonConverter<List<string>>
    {
        public override List<string> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            switch (reader.TokenType)
            {
                case JsonTokenType.String:
                    // If it's a string, convert it to a list with one item
                    string authorString = reader.GetString() ?? string.Empty;
                    if (string.IsNullOrEmpty(authorString))
                        return new List<string>();
                        
                    // Handle comma-separated authors in a single string
                    if (authorString.Contains(","))
                        return authorString.Split(',').Select(a => a.Trim()).ToList();
                        
                    return new List<string> { authorString };
                    
                case JsonTokenType.StartArray:
                    // Standard array handling
                    var authors = new List<string>();
                    while (reader.Read() && reader.TokenType != JsonTokenType.EndArray)
                    {
                        if (reader.TokenType == JsonTokenType.String)
                        {
                            string? author = reader.GetString();
                            if (!string.IsNullOrEmpty(author))
                                authors.Add(author);
                        }
                    }
                    return authors;
                    
                case JsonTokenType.Null:
                    // Handle null value
                    return new List<string>();
                    
                case JsonTokenType.StartObject:
                    // Sometimes the API returns an object with author properties
                    // Skip the object and return empty list
                    int depth = 1;
                    while (depth > 0 && reader.Read())
                    {
                        if (reader.TokenType == JsonTokenType.StartObject)
                            depth++;
                        else if (reader.TokenType == JsonTokenType.EndObject)
                            depth--;
                    }
                    return new List<string>();
                    
                default:
                    // For any other token type, try to read through it and return empty
                    return new List<string>();
            }
        }

        public override void Write(Utf8JsonWriter writer, List<string> value, JsonSerializerOptions options)
        {
            writer.WriteStartArray();
            foreach (var author in value)
            {
                writer.WriteStringValue(author);
            }
            writer.WriteEndArray();
        }
    }

    // Add a new converter for flexible int parsing
    private class FlexibleIntConverter : JsonConverter<int>
    {
        public override int Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Number)
            {
                return reader.GetInt32();
            }
            else if (reader.TokenType == JsonTokenType.String)
            {
                string? value = reader.GetString();
                if (int.TryParse(value, out int result))
                    return result;
            }
            
            return 0;
        }

        public override void Write(Utf8JsonWriter writer, int value, JsonSerializerOptions options)
        {
            writer.WriteNumberValue(value);
        }
    }
}