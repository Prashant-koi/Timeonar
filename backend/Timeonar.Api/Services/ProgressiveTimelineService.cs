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
        _logger.LogInformation("Starting progressive timeline generation for topic: {Topic}", topic);

        // Step 1: Get basic timeline with core facts
        var basicTimeline = await GetBasicTimelineAsync(topic);
        
        if (basicTimeline.Timeline == null || !basicTimeline.Timeline.Any())
        {
            _logger.LogWarning("Failed to get basic timeline for {Topic}", topic);
            return new TimelineData { Topic = topic, Timeline = new List<TimelineItem>() };
        }
        
        _logger.LogInformation("Retrieved basic timeline with {Count} items", basicTimeline.Timeline.Count);

        // Step 2: Enrich with methodologies and theoretical paradigms
        await EnrichTimelineMethodologiesAsync(basicTimeline);
        
        // Step 3: Add field evolution insights for each decade
        await EnrichTimelineEvolutionAsync(basicTimeline);

        return basicTimeline;
    }

    private async Task<TimelineData> GetBasicTimelineAsync(string topic)
    {
        var prompt = BuildBasicTimelinePrompt(topic);
        return await _perplexityClient.QuerySonarAsync(prompt);
    }

    private async Task EnrichTimelineMethodologiesAsync(TimelineData timeline)
    {
        if (timeline.Timeline == null || !timeline.Timeline.Any())
            return;

        // Group items by decades to process them in smaller batches
        var decades = timeline.Timeline
            .GroupBy(item => (item.Year / 10) * 10)
            .ToDictionary(g => g.Key, g => g.ToList());

        foreach (var decade in decades.Keys)
        {
            var itemsInDecade = decades[decade];
            _logger.LogInformation("Enriching methodologies for {Count} items in {Decade}s", itemsInDecade.Count, decade);

            var prompt = BuildMethodologyEnrichmentPrompt(timeline.Topic, itemsInDecade);
            var enrichmentData = await _perplexityClient.QuerySonarAsync(prompt);

            if (enrichmentData.Timeline != null && enrichmentData.Timeline.Any())
            {
                // Update the original items with methodology and paradigm data
                foreach (var enrichedItem in enrichmentData.Timeline)
                {
                    var originalItem = timeline.Timeline.FirstOrDefault(i => 
                        i.Year == enrichedItem.Year && i.Title == enrichedItem.Title);
                        
                    if (originalItem != null)
                    {
                        // Use null-conditional operator to avoid null reference exceptions
                        originalItem.Methodology = enrichedItem.Methodology ?? originalItem.Methodology;
                        originalItem.TheoreticalParadigm = enrichedItem.TheoreticalParadigm ?? originalItem.TheoreticalParadigm;
                    }
                }
            }
        }
    }

    private async Task EnrichTimelineEvolutionAsync(TimelineData timeline)
    {
        if (timeline.Timeline == null || !timeline.Timeline.Any())
            return;

        // Group items by decades
        var decades = timeline.Timeline
            .GroupBy(item => (item.Year / 10) * 10)
            .ToDictionary(g => g.Key, g => g.ToList());

        foreach (var decade in decades.Keys)
        {
            _logger.LogInformation("Adding field evolution for {Decade}s", decade);

            var prompt = BuildFieldEvolutionPrompt(timeline.Topic, decade, decades[decade]);
            var evolutionData = await _perplexityClient.QuerySonarAsync(prompt);

            if (evolutionData.Timeline != null && evolutionData.Timeline.Any())
            {
                // Find one representative item from this decade and add field evolution
                var representativeItem = decades[decade].OrderBy(i => i.Year).FirstOrDefault();
                if (representativeItem != null && evolutionData.Timeline.Any())
                {
                    representativeItem.FieldEvolution = evolutionData.Timeline[0].FieldEvolution ?? 
                        $"During the {decade}s, the field of {timeline.Topic} experienced significant developments.";
                }
            }
        }
    }

    private string BuildBasicTimelinePrompt(string topic)
    {
        var promptBuilder = new StringBuilder();
        
        // Simple introduction
        promptBuilder.AppendLine($"Create a timeline of key scientific discoveries related to \"{topic}\".");
        
        // Core instructions
        promptBuilder.AppendLine("\nRules for timeline entries:");
        promptBuilder.AppendLine("1. Include 8-10 major discoveries spanning the history of this field");
        promptBuilder.AppendLine("2. For each discovery, provide the EXACT ACADEMIC JOURNAL where it was published");
        promptBuilder.AppendLine("3. For each discovery, provide a DIRECT LINK to the original paper (DOI link preferred)");
        promptBuilder.AppendLine("4. NEVER use Wikipedia, blogs, or 'History of [topic]' websites as sources");
        
        // Examples - concrete and specific
        promptBuilder.AppendLine("\nThe 'source' field must be an academic journal name. Examples:");
        promptBuilder.AppendLine("CORRECT: 'Nature', 'Science', 'Physical Review Letters'");
        promptBuilder.AppendLine("INCORRECT: 'Wikipedia', 'StartechUp Blog', 'Timeline of Machine Learning'");
        
        promptBuilder.AppendLine("\nThe 'url' field must link directly to the paper. Examples:");
        promptBuilder.AppendLine("CORRECT: 'https://doi.org/10.1038/nature14539', 'https://www.science.org/doi/10.1126/science.1127647'");
        promptBuilder.AppendLine("INCORRECT: 'https://en.wikipedia.org/wiki/Machine_learning', 'https://www.example.com/history-of-topic'");
        
        // Example entry to demonstrate proper formatting
        promptBuilder.AppendLine("\nHere is a correctly formatted entry example:");
        promptBuilder.AppendLine(@"{
  ""year"": 1986,
  ""title"": ""Learning representations by back-propagating errors"",
  ""discovery"": ""Backpropagation algorithm for neural networks"",
  ""summary"": ""Rumelhart, Hinton, and Williams formalized the backpropagation algorithm for training multi-layer neural networks."",
  ""source"": ""Nature"",
  ""url"": ""https://www.nature.com/articles/323533a0"",
  ""authors"": [""David Rumelhart"", ""Geoffrey Hinton"", ""Ronald Williams""],
  ""citationCount"": 12500,
  ""keyInsight"": ""This algorithm enabled effective training of deep neural networks, overcoming previous limitations.""
}");
        
        // Output format
        promptBuilder.AppendLine("\nProvide the complete timeline as valid JSON in this structure:");
        promptBuilder.AppendLine(@"{
  ""topic"": ""string"",
  ""timeline"": [
    {
      ""id"": ""string"",
      ""year"": number,
      ""title"": ""string"",
      ""discovery"": ""string"", 
      ""summary"": ""string"",
      ""source"": ""string"",
      ""url"": ""string"",
      ""authors"": [""string""],
      ""citationCount"": number,
      ""keyInsight"": ""string""
    }
  ]
}");
        
        return promptBuilder.ToString();
    }

    private string BuildMethodologyEnrichmentPrompt(string topic, List<TimelineItem> itemsToEnrich)
    {
        var promptBuilder = new StringBuilder();
        
        // Introduction
        promptBuilder.AppendLine($"For the following discoveries related to \"{topic}\", provide detailed information about the research methodologies and theoretical paradigms used:");
        
        // List the discoveries to be enriched
        foreach (var item in itemsToEnrich)
        {
            promptBuilder.AppendLine($"\n- Year: {item.Year}, Title: \"{item.Title}\"");
            promptBuilder.AppendLine($"  Summary: {item.Summary}");
            promptBuilder.AppendLine($"  Source: {item.Source}");
            promptBuilder.AppendLine($"  Authors: {string.Join(", ", item.Authors)}");
        }
        
        // Instructions
        promptBuilder.AppendLine("\nFor EACH discovery listed above, provide:");
        promptBuilder.AppendLine("1. A detailed description of the methodology used (research methods, tools, approaches)");
        promptBuilder.AppendLine("2. An explanation of the theoretical paradigm it operated within or challenged");
        
        // Critical requirements - Matched to SonarPromptBuilder
        promptBuilder.AppendLine("\nCRITICAL REQUIREMENTS:");
        promptBuilder.AppendLine("- For the 'methodology' field, describe IN DETAIL the research methods, experimental designs, tools, or approaches used");
        promptBuilder.AppendLine("- For the 'theoreticalParadigm' field, thoroughly explain the conceptual framework the research operated within or challenged");
        promptBuilder.AppendLine("- Base your response on the ACTUAL historical papers and research practices of their time period");
        promptBuilder.AppendLine("- Be specific about techniques and theoretical frameworks used at the time of the discovery");
        promptBuilder.AppendLine("- Do not modernize historical methods - describe what was actually used when the discovery was made");
        promptBuilder.AppendLine("- BOTH fields must be thoroughly completed for EACH discovery");
        
        // Output format
        promptBuilder.AppendLine("\nProvide your response as valid JSON with this structure:");
        promptBuilder.AppendLine(@"{
  ""topic"": ""string"",
  ""timeline"": [
    {
      ""year"": number,
      ""title"": ""string"",
      ""methodology"": ""string"",
      ""theoreticalParadigm"": ""string""
    }
  ]
}");
        
        // Final instructions
        promptBuilder.AppendLine("\nCritical requirements:");
        promptBuilder.AppendLine("- Do not include any explanation, introduction, or additional text outside the JSON structure");
        promptBuilder.AppendLine("- The response must be valid JSON that can be directly parsed");
        promptBuilder.AppendLine("- Do not leave any field as null, undefined, or empty string");
        
        return promptBuilder.ToString();
    }

    private string BuildFieldEvolutionPrompt(string topic, int decade, List<TimelineItem> itemsInDecade)
    {
        var promptBuilder = new StringBuilder();
        
        // Introduction
        promptBuilder.AppendLine($"Based on the following discoveries from the {decade}s related to \"{topic}\", provide a comprehensive analysis of how the field evolved during this decade:");
        
        // List the discoveries from the decade
        foreach (var item in itemsInDecade)
        {
            promptBuilder.AppendLine($"\n- Year: {item.Year}, Title: \"{item.Title}\"");
            promptBuilder.AppendLine($"  Discovery: {item.Discovery}");
            promptBuilder.AppendLine($"  Key Insight: {item.KeyInsight}");
            promptBuilder.AppendLine($"  Source: {item.Source}");
            promptBuilder.AppendLine($"  Authors: {string.Join(", ", item.Authors)}");
            
            // Include methodology and theoretical paradigm if available
            if (!string.IsNullOrEmpty(item.Methodology))
            {
                promptBuilder.AppendLine($"  Methodology: {item.Methodology.Substring(0, Math.Min(item.Methodology.Length, 150))}...");
            }
            
            if (!string.IsNullOrEmpty(item.TheoreticalParadigm))
            {
                promptBuilder.AppendLine($"  Theoretical Paradigm: {item.TheoreticalParadigm.Substring(0, Math.Min(item.TheoreticalParadigm.Length, 150))}...");
            }
        }
        
        // Instructions
        promptBuilder.AppendLine($"\nExplain in detail how the field of \"{topic}\" evolved during the {decade}s decade, including:");
        promptBuilder.AppendLine("1. Major shifts in understanding, methodology, or theoretical approaches");
        promptBuilder.AppendLine("2. How the collective discoveries changed the field");
        promptBuilder.AppendLine("3. New research directions that emerged during this period");
        promptBuilder.AppendLine("4. How this decade compared to previous periods in terms of approach or understanding");
        
        // Critical requirements - Matched to SonarPromptBuilder
        promptBuilder.AppendLine("\nCRITICAL REQUIREMENTS:");
        promptBuilder.AppendLine("- The 'fieldEvolution' must summarize how the ENTIRE FIELD changed during this decade");
        promptBuilder.AppendLine("- Base your analysis on the specific discoveries listed above, not general knowledge");
        promptBuilder.AppendLine("- Reference specific researchers and their contributions from this decade");
        promptBuilder.AppendLine("- Explain specifically how the field was different at the end of the decade compared to the beginning");
        promptBuilder.AppendLine("- Describe how these discoveries built upon or challenged previous work");
        promptBuilder.AppendLine("- Identify any paradigm shifts or methodological innovations that occurred");
        promptBuilder.AppendLine("- Provide a thorough assessment of the decade's impact on the broader scientific understanding");
        
        // Output format
        promptBuilder.AppendLine("\nProvide your response as valid JSON with this structure:");
        promptBuilder.AppendLine(@"{
  ""topic"": ""string"",
  ""timeline"": [
    {
      ""decade"": number,
      ""fieldEvolution"": ""string""
    }
  ]
}");
        
        // Final instructions
        promptBuilder.AppendLine("\nCritical requirements:");
        promptBuilder.AppendLine("- Do not include any explanation, introduction, or additional text outside the JSON structure");
        promptBuilder.AppendLine("- The response must be valid JSON that can be directly parsed");
        promptBuilder.AppendLine("- The fieldEvolution must be thorough and comprehensive");
        promptBuilder.AppendLine("- Do not leave any field as null, undefined, or empty string");
        
        return promptBuilder.ToString();
    }
}