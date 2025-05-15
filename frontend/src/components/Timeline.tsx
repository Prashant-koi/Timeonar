import React, { useRef, useEffect } from 'react';
import { TimelineItem } from '../types/timeline';

interface TimelineProps {
  data: TimelineItem[];
  topic: string;
}

const Timeline: React.FC<TimelineProps> = ({ data, topic }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevTopicRef = useRef<string>(topic);
  const prevDataLengthRef = useRef<number>(0);

  useEffect(() => {
    // Only scroll to top when the topic changes or when going from no data to having data
    // Don't scroll when data is just being updated with new details
    if (containerRef.current && (prevTopicRef.current !== topic || prevDataLengthRef.current === 0)) {
      containerRef.current.scrollTop = 0;
      prevTopicRef.current = topic;
    }
    
    // Store current data length for comparison
    prevDataLengthRef.current = data.length;
  }, [data, topic]);

  // Group timeline items by year
  const itemsByYear = data.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = [];
    }
    acc[item.year].push(item);
    return acc;
  }, {} as Record<number, TimelineItem[]>);

  // Sort years in descending order (newest first)
  const years = Object.keys(itemsByYear).map(Number).sort((a, b) => b - a);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No timeline data available for this topic or year.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">
          Timeline: <span className="text-blue-500">{topic}</span>
        </h2>
        <div className="text-gray-400 text-sm">
          {data.length} {data.length === 1 ? 'entry' : 'entries'} • 
          <span className="ml-1">Years: {Math.min(...years)} - {Math.max(...years)}</span>
        </div>
      </div>
      
      <div className="mb-6 bg-blue-500/5 p-4 rounded-lg border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-500 mb-2">About this timeline</h3>
        <p className="text-gray-300">
          This timeline shows key developments and milestones related to "{topic}" 
          across {years.length} different years, spanning from {Math.min(...years)} to {Math.max(...years)}.
          Each entry includes research details, citation counts, and key insights.
        </p>
      </div>
      
      <div ref={containerRef} className="overflow-y-auto max-h-[80vh] pr-2">
        {years.map((year) => (
          <div key={year} className="mb-12">
            <div className="sticky top-0 bg-black z-10 py-2">
              <h3 className="text-xl font-bold text-blue-500 flex items-center">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full mr-3">{year}</span>
                <span className="text-sm text-gray-400">
                  {itemsByYear[year].length} {itemsByYear[year].length === 1 ? 'entry' : 'entries'}
                </span>
              </h3>
            </div>
            
            <div className="border-l-2 border-gray-800 ml-6 mt-3">
              {itemsByYear[year].map((item) => (
                <div key={item.id} className="relative ml-6 mb-8">
                  <div className="absolute -left-8 mt-1">
                    <div className="bg-blue-500 border-4 border-black h-4 w-4 rounded-full"></div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 transition-all">
                    
                    {/* Title row with more space */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm shrink-0">
                        {item.year}
                      </div>
                    </div>
                    
                    {/* Display the discovery information if available */}
                    {item.discovery && (
                      <div className="mb-4 bg-green-500/10 p-3 rounded border-l-4 border-green-500">
                        <div className="font-bold text-sm text-green-400 mb-1">DISCOVERY:</div>
                        <p className="text-gray-300">{item.discovery}</p>
                      </div>
                    )}
                    
                    <p className="text-gray-300 mb-4">{item.summary}</p>
                    
                    {item.keyInsight && (
                      <div className="mb-4 bg-blue-500/10 p-3 rounded border-l-4 border-blue-500">
                        <div className="font-bold text-sm text-blue-400 mb-1">KEY INSIGHT:</div>
                        <p className="text-gray-300 italic">{item.keyInsight}</p>
                      </div>
                    )}

                    {item.fieldEvolution && item.fieldEvolution.trim() !== "" && (
                      <div className="mb-5 bg-purple-500/10 p-4 rounded border-l-4 border-purple-500">
                        <div className="font-bold text-sm text-purple-400 mb-2">FIELD EVOLUTION:</div>
                        <p className="text-gray-300 italic leading-relaxed">{item.fieldEvolution}</p>
                      </div>
                    )}

                    {item.methodology && item.methodology.trim() !== "" && (
                      <div className="mb-5 bg-green-500/10 p-4 rounded border-l-4 border-green-500">
                        <div className="font-bold text-sm text-green-400 mb-2">METHODOLOGY:</div>
                        <p className="text-gray-300 leading-relaxed">{item.methodology}</p>
                      </div>
                    )}

                    {item.theoreticalParadigm && item.theoreticalParadigm.trim() !== "" && (
                      <div className="mb-5 bg-amber-500/10 p-4 rounded border-l-4 border-amber-500">
                        <div className="font-bold text-sm text-amber-400 mb-2">THEORETICAL PARADIGM:</div>
                        <p className="text-gray-300 leading-relaxed">{item.theoreticalParadigm}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-400 mb-3 gap-3">
                      <span className="flex items-center bg-gray-800/50 px-2 py-1 rounded">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                        </svg>
                        {item.source || "Unknown source"}
                      </span>
                      
                      <span className="flex items-center bg-gray-800/50 px-2 py-1 rounded">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {(item.citationCount || 0).toLocaleString()} citations
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="text-sm">
                        <span className="text-gray-400">By: </span>
                        <span className="text-gray-300">
                          {item.authors && item.authors.length > 0 ? item.authors.join(', ') : 'Unknown'}
                        </span>
                      </div>
                      
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:text-blue-400 text-sm flex items-center bg-blue-500/10 px-3 py-1 rounded-full"
                      >
                        View Source
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <div className="bg-gray-900 rounded-full py-2 px-4 text-sm text-gray-400">
          Data powered by Perplexity Sonar API
        </div>
      </div>
    </div>
  );
};

export default React.memo(Timeline, (prevProps, nextProps) => {
  // Return false to re-render, true to skip rendering
  
  // Check for topic change
  if (prevProps.topic !== nextProps.topic) return false;
  
  // Check if arrays have different lengths
  if (prevProps.data.length !== nextProps.data.length) return false;
  
  // Deep comparison of item properties that might change
  for (let i = 0; i < prevProps.data.length; i++) {
    const prevItem = prevProps.data[i];
    const nextItem = nextProps.data[i];
    
    // If any of these properties changed, we need to re-render
    if (
      prevItem.methodology !== nextItem.methodology ||
      prevItem.theoreticalParadigm !== nextItem.theoreticalParadigm ||
      prevItem.source !== nextItem.source ||
      prevItem.url !== nextItem.url ||
      prevItem.citationCount !== nextItem.citationCount ||
      JSON.stringify(prevItem.authors) !== JSON.stringify(nextItem.authors)
    ) {
      return false; // Re-render
    }
  }
  
  return true; // Skip re-render if nothing changed
});