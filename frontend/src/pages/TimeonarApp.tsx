import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Timeline from '../components/Timeline';
import TimelineControls from '../components/TimelineControls';

const TimeonarApp: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleSearch = async (searchTopic: string) => {
    if (!searchTopic.trim()) return;
    
    setIsLoading(true);
    setTopic(searchTopic);
    
    try {
      // This would be replaced with actual API call to Sonar
      // Simulating API call with timeout
      setTimeout(() => {
        // Mock data
        const mockData = generateMockTimelineData(searchTopic);
        setTimelineData(mockData);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      setIsLoading(false);
    }
  };

  const handleYearFilter = (year: number | null) => {
    setSelectedYear(year);
  };

  // Helper function to generate mock timeline data
  const generateMockTimelineData = (topic: string) => {
    const currentYear = new Date().getFullYear();
    const yearsBack = 30;
    const result = [];
    
    for (let i = 0; i < 20; i++) {
      const year = currentYear - Math.floor(Math.random() * yearsBack);
      result.push({
        id: `entry-${i}`,
        year: year,
        title: `${topic} development in ${year}`,
        summary: `This significant research on ${topic} showed promising results that changed how we view the field.`,
        source: `Journal of ${topic.replace(/\s+/g, '')} Studies`,
        url: 'https://example.com/paper',
        authors: ['Dr. First Author', 'Dr. Second Author'],
        citationCount: Math.floor(Math.random() * 1000)
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
                Try searching for topics like "AI alignment", "Climate change policies", 
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