using System.Text;

namespace Timeonar.Api.Services;

/// <summary>
/// Builds detailed prompts for the Perplexity Sonar API to generate timeline data.
/// </summary>
public static class SonarPromptBuilder
{
    /// <summary>
    /// Builds a detailed prompt for generating a timeline about the given topic.
    /// </summary>
    /// <param name="topic">The topic to generate a timeline for</param>
    /// <returns>A structured prompt for the Perplexity Sonar API</returns>
    public static string BuildTimelinePrompt(string topic)
    {
        var promptBuilder = new StringBuilder();
        
        // Simple, direct introduction
        promptBuilder.AppendLine($"Create a comprehensive timeline of scientific discoveries related to \"{topic}\".");
        
        // Core requirements - more focused
        promptBuilder.AppendLine("\nCritical Requirements:");
        promptBuilder.AppendLine("1. Each timeline entry must represent an actual scientific discovery with original research");
        promptBuilder.AppendLine("2. The 'source' field MUST contain ONLY the exact name of the academic journal where published");
        promptBuilder.AppendLine("3. The 'url' field MUST link DIRECTLY to the original paper (DOI link preferred)");
        promptBuilder.AppendLine("4. NEVER use Wikipedia, blogs, or general history websites as sources");
        promptBuilder.AppendLine("5. Include methodology and theoretical paradigm for each discovery");
        
        // Examples - clear and specific
        promptBuilder.AppendLine("\nExamples of correct sources:");
        promptBuilder.AppendLine("CORRECT: 'Nature', 'Science', 'Physical Review Letters'");
        promptBuilder.AppendLine("INCORRECT: 'Wikipedia', 'StartechUp Blog', 'Timeline of Machine Learning'");
        
        promptBuilder.AppendLine("\nExamples of correct URLs:");
        promptBuilder.AppendLine("CORRECT: 'https://doi.org/10.1038/nature14539', 'https://www.science.org/doi/10.1126/science.1127647'");
        promptBuilder.AppendLine("INCORRECT: 'https://en.wikipedia.org/wiki/Machine_learning', 'https://www.example.com/history-of-topic'");
        
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
      ""keyInsight"": ""string"",
      ""methodology"": ""string"",
      ""theoreticalParadigm"": ""string"",
      ""fieldEvolution"": ""string""
    }
  ]
}");
        
        return promptBuilder.ToString();
    }

    /// <summary>
    /// Builds a base prompt for generating timeline entries without source information
    /// </summary>
    public static string BuildBaseTimelinePrompt(string topic)
    {
        var promptBuilder = new StringBuilder();
        
        // Introduction
        promptBuilder.AppendLine($"Create a timeline of key scientific discoveries related to \"{topic}\".");
        
        // Core instructions
        promptBuilder.AppendLine("\nRules for timeline entries:");
        promptBuilder.AppendLine("1. Include 8-15 significant discoveries spanning the entire history of this field");
        promptBuilder.AppendLine("2. For each entry, provide ONLY the id, year, title, discovery description, summary, and key insight");
        promptBuilder.AppendLine("3. DO NOT include sources, URLs, authors, or citations - I will add those separately");
        promptBuilder.AppendLine("4. Focus on ACTUAL scientific discoveries, not general events or broad developments");
        promptBuilder.AppendLine("5. Make sure each entry represents a genuine scientific breakthrough or finding");
        
        // Output format
        promptBuilder.AppendLine("\nProvide your response as valid JSON with this structure:");
        promptBuilder.AppendLine(@"{
  ""topic"": ""string"",
  ""timeline"": [
    {
      ""id"": ""string"",
      ""year"": number,
      ""title"": ""string"",
      ""discovery"": ""string"", 
      ""summary"": ""string"",
      ""keyInsight"": ""string""
    }
  ]
}");
        
        return promptBuilder.ToString();
    }
}