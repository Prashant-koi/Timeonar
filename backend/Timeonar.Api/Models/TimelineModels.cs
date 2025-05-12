namespace Timeonar.Api.Models;

public class TimelineData
{
    public string Topic { get; set; } = "";
    public List<TimelineItem> Timeline { get; set; } = new List<TimelineItem>();
    public int TotalEntries => Timeline.Count;
}

public class TimelineItem
{
    public string Id { get; set; } = "";
    public int Year { get; set; }
    public string Title { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Source { get; set; } = "";
    public string? Url { get; set; }
    public List<string> Authors { get; set; } = new List<string>();
    public int CitationCount { get; set; }
    public string? KeyInsight { get; set; }
}