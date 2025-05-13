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
        
        // Introduction and task definition with emphasis on key discoveries and relevant research
        promptBuilder.AppendLine($"Create a comprehensive timeline of key scientific discoveries, breakthroughs, and milestone research papers related to \"{topic}\". Focus on what was actually discovered or established during each time period, not just citation information.");
        
        // Instructions for quality and depth with improved specificity
        promptBuilder.AppendLine("\nInstructions for timeline generation:");
        promptBuilder.AppendLine("1. Include 8-15 significant time periods spanning the entire history of this topic");
        promptBuilder.AppendLine("2. For EACH time period, describe 1-3 SPECIFIC DISCOVERIES or breakthroughs that occurred");
        promptBuilder.AppendLine("3. For each discovery, provide the actual research papers that documented it");
        promptBuilder.AppendLine("4. Explain what was actually discovered/established and why it was important");
        promptBuilder.AppendLine("5. Include paradigm shifts that changed how the topic was understood");
        promptBuilder.AppendLine("6. Focus on tangible outcomes and findings, not just publication metadata");
        promptBuilder.AppendLine("7. For each discovery, name the specific researchers who made the breakthrough");
        promptBuilder.AppendLine("8. Different discoveries from the same year should be separate entries");
        promptBuilder.AppendLine("9. Identify major methodology shifts that changed how research was conducted");
        promptBuilder.AppendLine("10. Track the evolution of dominant theories or paradigms over time");
        
        // Requirements for output structure
        promptBuilder.AppendLine("\nStructural requirements:");
        promptBuilder.AppendLine("- Use precise years for the timeline entries");
        promptBuilder.AppendLine("- Create descriptive titles that focus on WHAT WAS DISCOVERED, not just who published what");
        promptBuilder.AppendLine("- Write detailed summaries that explain the actual scientific finding or breakthrough");
        promptBuilder.AppendLine("- Include publication details but focus on the CONTENT of the discovery");
        promptBuilder.AppendLine("- Provide DOI links or direct links to the original research papers");
        promptBuilder.AppendLine("- List all major researchers involved in the discovery");
        promptBuilder.AppendLine("- Include citation counts to indicate the discovery's impact");
        promptBuilder.AppendLine("- For each entry, the \"Key Insight\" should explain how the discovery changed understanding of the field");
        promptBuilder.AppendLine("- For each decade or major era, provide a 'field_evolution' insight that summarizes how the field changed");
        promptBuilder.AppendLine("- Highlight intellectual debates or competing theories when they significantly influenced the field");
        
        // Output format instructions
        promptBuilder.AppendLine("\nYou MUST format the response as valid JSON that strictly follows this structure:");
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
      ""fieldEvolution"": ""string"",
      ""methodology"": ""string"",
      ""theoreticalParadigm"": ""string""
    }
  ]
}");
        
        // Final instruction for formatting with emphasis on actual discoveries
        promptBuilder.AppendLine("\nDo not include any explanation, introduction, or additional text outside the JSON structure. The response must be valid JSON that can be directly parsed. Each entry MUST focus on an actual scientific discovery or breakthrough, not just a paper being published. If multiple major discoveries happened in one year, create separate entries for each one.");
        
        return promptBuilder.ToString();
    }
}