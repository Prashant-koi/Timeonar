import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Timeline from '../components/Timeline';
import TimelineControls from '../components/TimelineControls';
import { mockMachineLearningData } from '../data/mockData';
import { TimelineItem } from '../types/timeline';
import ErrorAlert from '../components/ErrorAlert';

const TimeonarApp = () => {
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState<string>('');
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockDataLoaded, setIsMockDataLoaded] = useState(false);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  // API URL - adjust based on your backend setup
  const API_URL = 'http://localhost:5256';
  
  // Get initial topic from URL if present
  useEffect(() => {
    const urlTopic = searchParams.get('topic');
    if (urlTopic) {
      handleSearch(urlTopic);
    } else if (!isMockDataLoaded) {
      // Load mock data for machine learning as default
      setTimelineData(mockMachineLearningData.timeline);
      setTopic(mockMachineLearningData.topic);
      setIsMockDataLoaded(true);
    }
  }, [isMockDataLoaded, searchParams]);

  const handleSearch = async (searchTopic: string) => {
    if (!searchTopic.trim()) return;
    
    setIsLoading(true);
    setTopic(searchTopic);
    setTimelineData([]);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/Timeline/${encodeURIComponent(searchTopic)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.timeline && Array.isArray(data.timeline)) {
        setTimelineData(data.timeline);
      } else {
        setError('The API returned an invalid response format.');
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setError('An error occurred while fetching the timeline data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleYearFilter = (year: number | null) => {
    setFilterYear(year);
  };
  
  // Filter the timeline data if a year filter is applied
  const filteredTimelineData = filterYear 
    ? timelineData.filter(item => item.year === filterYear)
    : timelineData;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Literature Timeline Explorer</h1>
          
          <TimelineControls 
            onSearch={handleSearch} 
            onYearFilter={handleYearFilter}
            isLoading={isLoading}
            selectedYear={filterYear}
          />
          
          {error && (
            <ErrorAlert message={error} />
          )}
          
          <div className="mt-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16">
                  {/* First segment - horizontal */}
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent border-b-transparent animate-spin"></div>
                  {/* Second segment - vertical */}
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-r-transparent border-l-transparent animate-spin" style={{ animationDelay: "0.2s" }}></div>
                </div>
                <p className="mt-4 text-gray-400">Generating timeline data...</p>
              </div>
            ) : timelineData.length > 0 ? (
              <Timeline 
                data={filteredTimelineData} 
                topic={topic} 
              />
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
                <h3 className="text-xl font-bold text-gray-300 mb-2">No Timeline Generated Yet</h3>
                <p className="text-gray-500">
                  Enter a topic like "Machine Learning", "Climate Change", 
                  or "Quantum computing" to see how they've evolved over time.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeonarApp;