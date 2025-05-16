import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Timeline from '../components/Timeline';
import TimelineControls from '../components/TimelineControls';
import { mockMachineLearningData } from '../data/mockData';
import { TimelineItem } from '../types/timeline';
import ErrorAlert from '../components/ErrorAlert';

// Move the interface outside the function to improve reusability
interface BackendTimelineItem {
  Id?: string;
  Year?: number;
  Title?: string;
  Discovery?: string;
  Summary?: string;
  Source?: string;
  Url?: string | null;
  Authors?: string[];
  CitationCount?: string | number;
  KeyInsight?: string;
  Methodology?: string;
  TheoreticalParadigm?: string;
  FieldEvolution?: string;
}

const TimeonarApp = () => {
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState<string>('');
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockDataLoaded, setIsMockDataLoaded] = useState(false);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [debugMode, setDebugMode] = useState(false);
  
  // Keep track of partially loaded data
  const isPartiallyLoaded = useRef(false);

  // API URL - adjust based on your backend setup
  // const API_URL = 'https://timeonar-api.azurewebsites.net';

  // locally
  const API_URL = "http://localhost:5256"
  
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
    setTimelineData([]);  // Clear existing data
    setError(null);
    setLoadingMessage('Starting timeline generation...');
    isPartiallyLoaded.current = false;
    
    try {
      // Create an EventSource connection
      console.log("🔄 Establishing SSE connection to backend...");
      const eventSource = new EventSource(`${API_URL}/api/Timeline/stream/${encodeURIComponent(searchTopic)}`);
      
      // Connection opened successfully
      eventSource.onopen = () => {
        console.log("✅ SSE connection established successfully");
      };
      
      // Basic timeline data
      eventSource.addEventListener('baseData', (event) => {
        console.log("📥 Received baseData from backend:", event.data);
        try {
          const baseData = JSON.parse(event.data);
          console.log("📊 Parsed baseData, timeline entries:", baseData.Timeline?.length || 0);
          
          if (baseData.Timeline && Array.isArray(baseData.Timeline)) {
            // Now use the interface for type safety
            const normalizedData = baseData.Timeline.map((item: BackendTimelineItem) => ({
              id: item.Id || "",
              year: item.Year || 0,
              title: item.Title || "",
              discovery: item.Discovery || "",
              summary: item.Summary || "",
              source: item.Source || "",
              url: item.Url || "",
              authors: item.Authors || [],
              citationCount: item.CitationCount?.toString() || "0",
              keyInsight: item.KeyInsight || "",
              methodology: item.Methodology || "",
              theoreticalParadigm: item.TheoreticalParadigm || "",
              fieldEvolution: item.FieldEvolution || ""
            }));
            
            console.log("🔄 Normalized data for frontend:", normalizedData.length);
            
            // Force immediate update with the normalized data
            isPartiallyLoaded.current = true;
            setTopic(baseData.Topic || "");
            setTimelineData(normalizedData);
            setLoadingMessage('Enhancing with methodology information...');
            
            // Force additional update to ensure React renders
            setTimeout(() => {
              // This will trigger another render cycle
              setTimelineData(current => [...current]);
            }, 10);
          } else {
            console.error("❌ Invalid timeline data format:", baseData);
          }
        } catch (error) {
          console.error('Error parsing baseData:', error);
        }
      });
      
      // Individual methodology updates
      eventSource.addEventListener('methodologyUpdate', (event) => {
        console.log("📥 Received methodologyUpdate from backend:", event.data);
        try {
          const updatedItem = JSON.parse(event.data);
          
          // Check if we have a valid item with an ID
          if (!updatedItem) {
            console.error("❌ Invalid methodology update data", updatedItem);
            return;
          }
          
          // Normalize data - convert uppercase keys to lowercase
          const normalizedUpdate = {
            id: updatedItem.Id || "",
            year: updatedItem.Year || 0,
            title: updatedItem.Title || "",
            discovery: updatedItem.Discovery || "",
            summary: updatedItem.Summary || "",
            source: updatedItem.Source || "",
            url: updatedItem.Url || "",
            authors: updatedItem.Authors || [],
            citationCount: updatedItem.CitationCount || "0",
            keyInsight: updatedItem.KeyInsight || "",
            methodology: updatedItem.Methodology || "",
            theoreticalParadigm: updatedItem.TheoreticalParadigm || "",
            fieldEvolution: updatedItem.FieldEvolution || ""
          };
          
          console.log(`📝 Updating item: ${normalizedUpdate.id} - ${normalizedUpdate.title} with methodology data`);
          
          // Update the timeline data by finding the item with matching year and title
          setTimelineData(currentData => {
            const index = currentData.findIndex(item => 
              (item.id === normalizedUpdate.id) || 
              (item.year === normalizedUpdate.year && item.title.toLowerCase() === normalizedUpdate.title.toLowerCase())
            );
            
            if (index === -1) {
              console.warn(`⚠️ Could not find matching item for year ${normalizedUpdate.year} - ${normalizedUpdate.title}`);
              return currentData; // No change if item not found
            }
            
            // Always create a new array with a new item object to ensure React detects the change
            const newData = [...currentData];
            newData[index] = {
              ...newData[index],
              methodology: normalizedUpdate.methodology,
              theoreticalParadigm: normalizedUpdate.theoreticalParadigm,
              fieldEvolution: normalizedUpdate.fieldEvolution
            };
            
            console.log(`✅ Updated methodology for "${newData[index].title}" (${newData[index].year})`);
            return newData;
          });
          
          // Force a re-render by updating another state
          requestAnimationFrame(() => {
            setLoadingMessage(current => current + " 🔄");
            setTimeout(() => {
              setLoadingMessage(current => current.replace(" 🔄", ""));
            }, 10);
          });
        } catch (error) {
          console.error('Error parsing methodologyUpdate:', error);
        }
      });
      
      // Individual source updates
      eventSource.addEventListener('sourceUpdate', (event) => {
        console.log("📥 Received sourceUpdate from backend:", event.data);
        try {
          const updatedItem = JSON.parse(event.data);
          
          // Normalize data - convert uppercase keys to lowercase
          const normalizedUpdate = {
            id: updatedItem.Id || "",
            year: updatedItem.Year || 0,
            title: updatedItem.Title || "",
            discovery: updatedItem.Discovery || "",
            summary: updatedItem.Summary || "",
            source: updatedItem.Source || "",
            url: updatedItem.Url || "",
            authors: updatedItem.Authors || [],
            citationCount: updatedItem.CitationCount || "0",
            keyInsight: updatedItem.KeyInsight || "",
            methodology: updatedItem.Methodology || "",
            theoreticalParadigm: updatedItem.TheoreticalParadigm || "",
            fieldEvolution: updatedItem.FieldEvolution || ""
          };
          
          console.log(`📚 Updating item: ${normalizedUpdate.id} - ${normalizedUpdate.title} with source data`);
          
          // Update the timeline data with the source information
          setTimelineData(currentData => {
            const index = currentData.findIndex(item => 
              (item.id === normalizedUpdate.id) || 
              (item.year === normalizedUpdate.year && item.title.toLowerCase() === normalizedUpdate.title.toLowerCase())
            );
            
            if (index === -1) {
              console.warn(`⚠️ Could not find matching item for year ${normalizedUpdate.year} - ${normalizedUpdate.title}`);
              return currentData;
            }
            
            // Create a completely new array with the updated item
            const newData = [...currentData];
            newData[index] = {
              ...newData[index],
              source: normalizedUpdate.source,
              url: normalizedUpdate.url,
              authors: normalizedUpdate.authors,
              citationCount: normalizedUpdate.citationCount
            };
            
            console.log(`✅ Updated source info for "${newData[index].title}" (${newData[index].year})`);
            
            return newData;
          });
          
          // Use requestAnimationFrame to ensure UI updates
          requestAnimationFrame(() => {
            setLoadingMessage(current => current.startsWith("Adding") ? 
              "Adding source information and citations... 📚" : current);
          });
        } catch (error) {
          console.error('Error parsing sourceUpdate:', error);
        }
      });

      // Methodology completion
      eventSource.addEventListener('methodologyComplete', (event) => {
        console.log("✅ Methodology enrichment complete:", event.data);
        setLoadingMessage('Adding source information and citations...');
      });
      
      // Status updates
      eventSource.addEventListener('status', (event) => {
        console.log("ℹ️ Status update:", event.data);
        setLoadingMessage(event.data);
      });
      
      // Complete event
      eventSource.addEventListener('complete', (event) => {
        console.log("✅ Timeline generation complete:", event.data);
        setLoadingMessage('');
        setIsLoading(false);
        eventSource.close();
        console.log("🔒 SSE connection closed");
      });
      
      // Error handling
      eventSource.addEventListener('error', (event) => {
        console.error("❌ SSE Error:", event);
        
        // Access the error data if available
        const errorMessage = event instanceof MessageEvent && event.data 
          ? event.data 
          : 'An error occurred while generating the timeline.';
          
        setError(`Error: ${errorMessage}`);
        setIsLoading(false);
        eventSource.close();
        console.log("🔒 SSE connection closed due to error");
        
        // Fallback to mock data for better user experience
        if (!isPartiallyLoaded.current) {
          setTimeout(() => {
            setTimelineData(mockMachineLearningData.timeline);
            setTopic(`${searchTopic} (Sample Data)`);
            setError(`Could not generate timeline for "${searchTopic}". Showing sample data instead.`);
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error initiating timeline stream:', error);
      setError('An error occurred while connecting to the timeline service.');
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
            {(() => {
              // Log the state to verify what's happening
              console.log("Render state:", { 
                isLoading, 
                isPartiallyLoaded: isPartiallyLoaded.current,
                dataLength: timelineData.length
              });
              
              if (isLoading && !isPartiallyLoaded.current) {
                // Show initial loading spinner when no data yet
                return (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative w-16 h-16">
                      {/* First segment - horizontal */}
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent border-b-transparent animate-spin"></div>
                      {/* Second segment - vertical */}
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-r-transparent border-l-transparent animate-spin" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <p className="mt-4 text-gray-400">{loadingMessage || 'Generating timeline data...'}</p>
                  </div>
                );
              } else if (timelineData.length > 0) {
                // Show timeline when we have data (even if still loading more)
                return (
                  <>
                    {isLoading && (
                      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 flex items-center">
                        <div className="w-5 h-5 mr-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-300">{loadingMessage || 'Still loading more data...'}</p>
                      </div>
                    )}
                    <Timeline 
                      data={filteredTimelineData} 
                      topic={topic} 
                    />
                  </>
                );
              } else {
                // Show empty state
                return (
                  <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Timeline Generated Yet</h3>
                    <p className="text-gray-500">
                      Enter a topic like "Machine Learning", "Climate Change", 
                      or "Quantum computing" to see how they've evolved over time.
                    </p>
                  </div>
                );
              }
            })()}
          </div>

          {debugMode && timelineData.length > 0 && (
            <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-mono">Debug: Timeline Data</h3>
                <button 
                  onClick={() => setDebugMode(false)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
                >
                  Hide
                </button>
              </div>
              <pre className="text-xs text-gray-400 overflow-auto max-h-96">
                {JSON.stringify(timelineData, null, 2)}
              </pre>
            </div>
          )}

          {!debugMode && (
            <button 
              onClick={() => setDebugMode(true)}
              className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-500"
            >
              Debug Mode
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default TimeonarApp;