export interface TimelineItem {
  id: string;
  year: number;
  title: string;
  discovery?: string;
  summary: string;
  source?: string;
  url?: string;
  authors?: string[];
  citationCount?: number;
  keyInsight?: string;
  methodology?: string;
  theoreticalParadigm?: string;
  fieldEvolution?: string;
}

export interface TimelineData {
  topic: string;
  timeline: TimelineItem[];
}