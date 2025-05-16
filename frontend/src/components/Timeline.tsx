import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TimelineItem } from '../types/timeline';

interface TimelineProps {
  data: TimelineItem[];
  topic: string;
}

const Timeline: React.FC<TimelineProps> = ({ data, topic }) => {
  // Refs for interactive elements
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // States for UI interaction
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'methodology' | 'paradigm' | 'evolution'>('summary');
  const [zoomedOut, setZoomedOut] = useState(true);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  
  // Group timeline items by year
  const itemsByYear = useMemo(() => {
    return data.reduce((acc: Record<number, TimelineItem[]>, item) => {
      if (!acc[item.year]) {
        acc[item.year] = [];
      }
      acc[item.year].push(item);
      return acc;
    }, {});
  }, [data]);

  // Sort years in chronological order
  const years = useMemo(() => {
    return Object.keys(itemsByYear).map(Number).sort((a, b) => a - b);
  }, [itemsByYear]);
  
  // Find previous and next years for navigation
  const currentYearIndex = useMemo(() => {
    return selectedYear ? years.indexOf(selectedYear) : -1;
  }, [selectedYear, years]);
  
  const previousYear = useMemo(() => {
    return currentYearIndex > 0 ? years[currentYearIndex - 1] : null;
  }, [currentYearIndex, years]);
  
  const nextYear = useMemo(() => {
    return currentYearIndex >= 0 && currentYearIndex < years.length - 1 ? years[currentYearIndex + 1] : null;
  }, [currentYearIndex, years]);

  // Canvas background animation setup
  useEffect(() => {
    if (!canvasRef.current || canvasInitialized) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.floor(window.innerWidth / 10); // Adjust density
    
    // Particle properties
    type Particle = {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    // Draw function
    function drawCanvas() {

      if(!ctx) return;
    
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(p => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      
      });
      
      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 70) {
            if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 70)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            }
          }
        }
      }
      
      requestAnimationFrame(drawCanvas);
    }
    
    // Start animation
    drawCanvas();
    setCanvasInitialized(true);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasInitialized]);

  // Handle year selection
  const handleYearClick = (year: number) => {
    if (selectedYear === year) {
      // If clicking the already selected year, zoom out
      setSelectedYear(null);
      setZoomedOut(true);
    } else {
      // Select the year and zoom in
      setSelectedYear(year);
      setZoomedOut(false);
    }
  };
  
  // Navigate to previous year
  const handlePreviousYear = () => {
    if (previousYear !== null) {
      handleYearClick(previousYear);
    }
  };
  
  // Navigate to next year
  const handleNextYear = () => {
    if (nextYear !== null) {
      handleYearClick(nextYear);
    }
  };

  // Calculate year positions for the timeline
  // This function has been adjusted to create equal spacing
  const calculateYearPositions = () => {
    if (!years.length) return [];
    
    // Instead of calculating based on actual year values which can create uneven spacing,
    // we'll distribute them evenly across the timeline
    const yearCount = years.length;
    
    return years.map((year, index) => ({
      year,
      // Calculate position based on index (equal spacing)
      position: index * (100 / (yearCount - 1 || 1)),  
      entries: itemsByYear[year]
    }));
  };
  
  const yearPositions = calculateYearPositions();
  
  // Key navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedYear) return;
      
      if (e.key === 'ArrowLeft' && previousYear) {
        handlePreviousYear();
      } else if (e.key === 'ArrowRight' && nextYear) {
        handleNextYear();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previousYear, nextYear, selectedYear]);
  
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Tech canvas background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      
      {/* Header with topic */}
      <div className="relative z-10 py-4 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {topic} Timeline
        </h1>
      </div>
      
      {/* Horizontal timeline container with improved layout */}
      <div className="relative z-10 h-[calc(100vh-9rem)] flex flex-col">
        {/* Move zoom control inside the timeline area for better placement */}
        {/* Timeline header area with controls */}
        <div className="px-8 pt-5 pb-2 flex justify-between items-center">
          {/* Left side: Timeline label */}
          <h2 className="text-lg font-semibold text-gray-300">Timeline Events</h2>
          
          {/* Right side: Zoom control button */}
          <button
            onClick={() => {
              setSelectedYear(null);
              setZoomedOut(true);
            }}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
              zoomedOut ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {zoomedOut ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Overview</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Zoom Out</span>
              </>
            )}
          </button>
        </div>
        
        {/* Fixed-height horizontal timeline with improved layout */}
        <div className="px-8 pt-2 pb-4">
          <div ref={timelineRef} className="relative h-20 flex items-center">
            {/* Main timeline line */}
            <div className="h-0.5 bg-gray-800 absolute left-0 right-0">
              {/* Dotted overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              </div>
            </div>
            
            {/* Year nodes with improved placement */}
            <div className="relative w-full flex justify-between">
              {yearPositions.map(({ year, entries }) => (
                <div
                  key={year}
                  id={`year-node-${year}`}
                  className="relative"
                >
                  {/* Year node */}
                  <button
                    onClick={() => handleYearClick(year)}
                    className={`
                      group relative flex flex-col items-center transition-all duration-300
                      ${selectedYear === year ? 'scale-125' : 'hover:scale-110'}
                    `}
                    aria-pressed={selectedYear === year}
                    aria-label={`Year ${year} with ${entries.length} entries`}
                  >
                    {/* Year label above line */}
                    <div className={`
                      text-sm font-mono font-bold mb-2 py-1 px-2 rounded transition-all
                      ${selectedYear === year 
                        ? 'text-blue-300 bg-blue-500/20 border border-blue-500/40' 
                        : 'text-gray-400 group-hover:text-white'
                      }
                    `}>
                      {year}
                    </div>
                    
                    {/* Node point */}
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center relative z-10 transition-all
                      ${selectedYear === year 
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                        : 'bg-gray-700 group-hover:bg-blue-600'
                      }
                    `}>
                      <span className="text-xs font-bold">{entries.length}</span>
                      
                      {/* Pulse animation when selected */}
                      {selectedYear === year && (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-25"></span>
                          <span className="absolute -bottom-8 h-8 w-0.5 bg-blue-500/60"></span>
                        </>
                      )}
                    </div>
                    
                    {/* Mini tooltip with first entry title */}
                    {!selectedYear && entries.length > 0 && (
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                        <div className="bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 max-w-[150px] text-center">
                          {entries[0].title}
                          {entries.length > 1 && <span className="block text-gray-400 text-[10px]">+{entries.length - 1} more</span>}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content area with navigation buttons */}
        <div ref={containerRef} className="relative flex-1 overflow-hidden px-4">
          {/* Side navigation arrows that appear when a year is selected */}
          {!zoomedOut && selectedYear && (
            <>
              {/* Left (previous) arrow */}
              <button
                onClick={handlePreviousYear}
                disabled={!previousYear}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-gray-800/80 hover:bg-gray-700 disabled:opacity-30 p-3 rounded-full transition-colors"
                aria-label="Previous year"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Right (next) arrow */}
              <button
                onClick={handleNextYear}
                disabled={!nextYear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-gray-800/80 hover:bg-gray-700 disabled:opacity-30 p-3 rounded-full transition-colors"
                aria-label="Next year"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {zoomedOut ? (
            // Overview mode - show brief summary of all years
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto h-full p-4">
              {years.map(year => (
                <div
                  key={year}
                  className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 rounded-lg p-4 transition-all cursor-pointer"
                  onClick={() => handleYearClick(year)}
                >
                  <h3 className="font-mono text-lg font-bold text-blue-400 mb-2 flex items-center justify-between">
                    {year}
                    <span className="bg-blue-500/30 text-blue-200 text-xs px-2 py-1 rounded-full">
                      {itemsByYear[year].length} {itemsByYear[year].length === 1 ? 'entry' : 'entries'}
                    </span>
                  </h3>
                  
                  {itemsByYear[year].slice(0, 1).map(item => (
                    <div key={item.id}>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{item.summary}</p>
                      {itemsByYear[year].length > 1 && (
                        <div className="mt-2 text-xs text-gray-500">
                          + {itemsByYear[year].length - 1} more entries
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            // Detailed view of selected year
            <div className="h-full overflow-y-auto">
              {selectedYear && (
                <div className="bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800 p-6 mb-4 animate-fadeIn mx-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      <span className="text-blue-400 font-mono">{selectedYear}</span>
                      <span className="text-gray-400 ml-2 text-lg">
                        · {itemsByYear[selectedYear].length} {itemsByYear[selectedYear].length === 1 ? 'entry' : 'entries'}
                      </span>
                    </h2>
                    
                    {/* Navigation buttons inside the content area */}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePreviousYear}
                        disabled={!previousYear}
                        className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 p-2 rounded-full transition-colors"
                        aria-label="Previous year"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={handleNextYear}
                        disabled={!nextYear}
                        className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 p-2 rounded-full transition-colors"
                        aria-label="Next year"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* The rest of your existing content */}
                  <div className="space-y-8">
                    {itemsByYear[selectedYear].map((item, index) => (
                      <div key={item.id} className="border-t border-gray-800 pt-6 first:border-0 first:pt-0">
                        <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </h3>
                            
                            {item.discovery && (
                              <div className="text-green-400 text-sm mb-2">
                                {item.discovery}
                              </div>
                            )}
                          </div>
                          
                          <div className="shrink-0">
                            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg px-3 py-1 text-sm text-blue-300">
                              Entry #{index + 1}
                            </div>
                          </div>
                        </div>
                        
                        {/* Tab navigation for content types */}
                        <div className="border-b border-gray-800 mb-4">
                          <div className="flex flex-wrap -mb-px">
                            <button
                              className={`inline-flex items-center py-2 px-4 text-sm font-medium text-center border-b-2 ${
                                activeTab === 'summary'
                                  ? 'text-blue-400 border-blue-500'
                                  : 'border-transparent text-gray-500 hover:text-gray-300'
                              }`}
                              onClick={() => setActiveTab('summary')}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Summary
                            </button>
                            
                            {/* Methodology tab with indicator if data exists */}
                            <button
                              className={`inline-flex items-center py-2 px-4 text-sm font-medium text-center border-b-2 ${
                                !item.methodology
                                  ? 'opacity-50 cursor-not-allowed'
                                  : activeTab === 'methodology'
                                  ? 'text-green-400 border-green-500'
                                  : 'border-transparent text-gray-500 hover:text-gray-300'
                              }`}
                              onClick={() => item.methodology && setActiveTab('methodology')}
                              disabled={!item.methodology}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                              Methodology
                              {item.methodology && (
                                <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                              )}
                            </button>
                            
                            {/* Theoretical Paradigm tab */}
                            <button
                              className={`inline-flex items-center py-2 px-4 text-sm font-medium text-center border-b-2 ${
                                !item.theoreticalParadigm
                                  ? 'opacity-50 cursor-not-allowed'
                                  : activeTab === 'paradigm'
                                  ? 'text-amber-400 border-amber-500'
                                  : 'border-transparent text-gray-500 hover:text-gray-300'
                              }`}
                              onClick={() => item.theoreticalParadigm && setActiveTab('paradigm')}
                              disabled={!item.theoreticalParadigm}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Paradigm
                              {item.theoreticalParadigm && (
                                <span className="ml-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                              )}
                            </button>
                            
                            {/* Evolution tab */}
                            <button
                              className={`inline-flex items-center py-2 px-4 text-sm font-medium text-center border-b-2 ${
                                !item.fieldEvolution
                                  ? 'opacity-50 cursor-not-allowed'
                                  : activeTab === 'evolution'
                                  ? 'text-purple-400 border-purple-500'
                                  : 'border-transparent text-gray-500 hover:text-gray-300'
                              }`}
                              onClick={() => item.fieldEvolution && setActiveTab('evolution')}
                              disabled={!item.fieldEvolution}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              Evolution
                              {item.fieldEvolution && (
                                <span className="ml-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Tab content */}
                        <div className="p-2">
                          {activeTab === 'summary' && (
                            <div className="animate-fadeIn">
                              <div className="prose prose-sm prose-invert max-w-none">
                                <p className="text-gray-300 mb-4">{item.summary}</p>
                                {item.keyInsight && (
                                  <div className="mb-5 bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
                                    <div className="font-bold text-xs text-blue-400 mb-1 uppercase tracking-wider">Key Insight</div>
                                    <p className="text-gray-300 italic">{item.keyInsight}</p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Source information panel */}
                              <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-800 mt-4">
                                <div className="flex flex-wrap items-center text-sm text-gray-400 gap-4">
                                  {/* Source */}
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    {item.source || "Unknown source"}
                                  </span>
                                  
                                  {/* Citation count */}
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    {(item.citationCount || 0).toLocaleString()} citations
                                  </span>
                                </div>
                                
                                {/* Authors */}
                                {item.authors && item.authors.length > 0 && (
                                  <div className="mt-2 text-sm">
                                    <span className="text-gray-500 mr-1">By:</span>
                                    <span className="text-gray-300">
                                      {item.authors.join(', ')}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Source link */}
                                {item.url && (
                                  <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-3 text-blue-500 hover:text-blue-400 text-sm flex items-center bg-blue-900/30 px-3 py-2 rounded-lg w-full justify-center hover:bg-blue-900/40 transition-colors"
                                  >
                                    View Original Source
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {activeTab === 'methodology' && item.methodology && (
                            <div className="animate-fadeIn">
                              <div className="bg-green-900/10 border-l-4 border-green-500 rounded-r-lg p-4">
                                <h4 className="text-green-400 font-medium mb-2 uppercase text-xs tracking-wider">Research Methodology</h4>
                                <div className="prose prose-sm prose-invert max-w-none">
                                  <p className="text-gray-300">{item.methodology}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {activeTab === 'paradigm' && item.theoreticalParadigm && (
                            <div className="animate-fadeIn">
                              <div className="bg-amber-900/10 border-l-4 border-amber-500 rounded-r-lg p-4">
                                <h4 className="text-amber-400 font-medium mb-2 uppercase text-xs tracking-wider">Theoretical Paradigm</h4>
                                <div className="prose prose-sm prose-invert max-w-none">
                                  <p className="text-gray-300">{item.theoreticalParadigm}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {activeTab === 'evolution' && item.fieldEvolution && (
                            <div className="animate-fadeIn">
                              <div className="bg-purple-900/10 border-l-4 border-purple-500 rounded-r-lg p-4">
                                <h4 className="text-purple-400 font-medium mb-2 uppercase text-xs tracking-wider">Field Evolution</h4>
                                <div className="prose prose-sm prose-invert max-w-none">
                                  <p className="text-gray-300">{item.fieldEvolution}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!selectedYear && (
                <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                  Please select a year from the timeline
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Attribution footer */}
      <div className="relative z-10 py-3 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full text-sm text-blue-400">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.5 4c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 6c1.86.5 4 .83 6 1v12h2v-6h2v6h2V7c2-.17 4.14-.5 6-1l-.5-2z"></path>
            <path d="M12 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
          </svg>
          Data powered by Perplexity Sonar API
        </div>
      </div>
    </div>
  );
};

export default Timeline;