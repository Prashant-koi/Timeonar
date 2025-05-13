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
        
        // Introduction and task definition
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
        promptBuilder.AppendLine("9. IMPORTANT: For EVERY entry, describe the methodology used to achieve the discovery");
        promptBuilder.AppendLine("10. IMPORTANT: For EVERY entry, identify the theoretical paradigm it operated within or challenged");
        
        // Requirements for output structure
        promptBuilder.AppendLine("\nStructural requirements:");
        promptBuilder.AppendLine("- Use precise years for the timeline entries");
        promptBuilder.AppendLine("- Create descriptive titles that focus on WHAT WAS DISCOVERED, not just who published what");
        promptBuilder.AppendLine("- Write detailed summaries that explain the actual scientific finding or breakthrough");
        promptBuilder.AppendLine("- Include publication details but focus on the CONTENT of the discovery");
        promptBuilder.AppendLine("- Provide DOI links or direct links to the original research papers");
        promptBuilder.AppendLine("- List all major researchers involved in the discovery");
        promptBuilder.AppendLine("- Include citation counts to indicate the discovery's impact");
        promptBuilder.AppendLine("- For each entry, the \"keyInsight\" field MUST explain how the discovery changed understanding of the field");
        promptBuilder.AppendLine("- For each entry, the \"methodology\" field MUST explain the research methods, tools, or approaches used");
        promptBuilder.AppendLine("- For each entry, the \"theoreticalParadigm\" field MUST describe the theoretical framework the research operated within");
        promptBuilder.AppendLine("- For each decade or significant era, at least one entry MUST include a 'fieldEvolution' insight that summarizes how the field changed during that period");
        
        // Output format instructions
        promptBuilder.AppendLine("\nYou MUST format the response as valid JSON that strictly follows this structure, with NO fields left empty:");
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
        
        // Final instruction with emphasis on completeness of all fields
        promptBuilder.AppendLine("\nCritical requirements:");
        promptBuilder.AppendLine("- Do not include any explanation, introduction, or additional text outside the JSON structure");
        promptBuilder.AppendLine("- The response must be valid JSON that can be directly parsed");
        promptBuilder.AppendLine("- Each entry MUST focus on an actual scientific discovery or breakthrough");
        promptBuilder.AppendLine("- EVERY entry MUST include values for methodology and theoreticalParadigm fields");
        promptBuilder.AppendLine("- At least one entry per decade MUST include a fieldEvolution value");
        promptBuilder.AppendLine("- If you don't have precise information for these fields, provide the best educated assessment based on the historical context");
        promptBuilder.AppendLine("- Do not leave any field as null, undefined, or empty string");
        promptBuilder.AppendLine("- CRITICAL: methodology and theoreticalParadigm fields must be included for EVERY entry, and fieldEvolution for key transition periods");
        
        return promptBuilder.ToString();
    }
}