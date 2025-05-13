import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Timeline from '../components/Timeline';
import TimelineControls from '../components/TimelineControls';
import mockMachineLearningData from '../data/machine-learning-timeline.json';

interface TimelineItem {
  id: string;
  year: number;
  title: string;
  discovery?: string;
  summary: string;
  source: string;
  url: string;
  authors: string[];
  citationCount: number;
  keyInsight?: string;
  fieldEvolution?: string;
  methodology?: string;
  theoreticalParadigm?: string;
}

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'https://timeonar-api.azurewebsites.net';

const TimeonarApp: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isMockDataLoaded, setIsMockDataLoaded] = useState<boolean>(false);

  // Load mock data on initial load
  useEffect(() => {
    if (!isMockDataLoaded) {
      // Type cast to ensure TypeScript understands the structure
      const typedData = mockMachineLearningData.timeline as TimelineItem[];
      setTimelineData(typedData);
      setTopic(mockMachineLearningData.topic);
      setIsMockDataLoaded(true);
    }
  }, [isMockDataLoaded]);

  const handleSearch = async (searchTopic: string) => {
    if (!searchTopic.trim()) return;
    
    setIsLoading(true);
    setTopic(searchTopic);
    
    try {
      // Log the API URL for debugging
      console.log(`Fetching from: ${API_URL}/api/Timeline/${encodeURIComponent(searchTopic)}`);
      
      const response = await fetch(`${API_URL}/api/Timeline/${encodeURIComponent(searchTopic)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      // Check if the data has the expected structure
      if (data.timeline) {
        // Type cast to ensure TypeScript understands the structure
        setTimelineData(data.timeline as TimelineItem[]);
      } else {
        console.warn("Unexpected API response format:", data);
        setTimelineData([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      setIsLoading(false);
      
      // Fallback to mock data - now use Machine Learning data as default
      if (searchTopic.toLowerCase() === 'machine learning') {
        const typedData = mockMachineLearningData.timeline as TimelineItem[];
        setTimelineData(typedData);
      } else {
        const mockData = generateMockTimelineData(searchTopic);
        setTimelineData(mockData);
      }
    }
  };

  const handleYearFilter = (year: number | null) => {
    setSelectedYear(year);
  };

  // Helper function to generate mock timeline data for other topics
  const generateMockTimelineData = (topic: string): TimelineItem[] => {
    const currentYear = new Date().getFullYear();
    const yearsBack = 30;
    const result: TimelineItem[] = [];
    
    for (let i = 0; i < 12; i++) {
      const year = currentYear - Math.floor(Math.random() * yearsBack);
      result.push({
        id: `entry-${i}`,
        year: year,
        title: `${topic} development in ${year}`,
        discovery: `Key finding related to ${topic}`,
        summary: `This significant research on ${topic} showed promising results that changed how we view the field.`,
        source: `Journal of ${topic.replace(/\s+/g, '')} Studies`,
        url: 'https://example.com/paper',
        authors: ['Dr. First Author', 'Dr. Second Author'],
        citationCount: Math.floor(Math.random() * 1000),
        keyInsight: `Changed our understanding of ${topic} by revealing new patterns and relationships.`,
        fieldEvolution: `This discovery represented a shift in how ${topic} was approached.`,
        methodology: `Novel experimental design that combined multiple research methods.`
      });
    }
    
    // Sort by year (newest first)
    return result.sort((a, b) => b.year - a.year);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Literature Timeline Explorer</h1>
          
          <TimelineControls 
            onSearch={handleSearch} 
            onYearFilter={handleYearFilter}
            isLoading={isLoading}
            selectedYear={selectedYear}
            defaultTopic={isMockDataLoaded ? topic : ''}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : timelineData.length > 0 ? (
            <Timeline 
              data={timelineData.filter(item => selectedYear ? item.year === selectedYear : true)} 
              topic={topic}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">Search for a topic to begin</h2>
              <p className="text-gray-400">
                Try searching for topics like "Machine Learning", "Climate change", 
                or "Quantum computing" to see how they've evolved over time.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TimeonarApp;