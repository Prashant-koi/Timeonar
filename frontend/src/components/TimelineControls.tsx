import React, { useState, useEffect, FormEvent } from 'react';
import { exportTimelineToPDF } from '../utils/pdfExport';
import { TimelineItem } from '../types/timeline';

interface TimelineControlsProps {
  onSearch: (topic: string) => void;
  onYearFilter: (year: number | null) => void;
  isLoading: boolean;
  selectedYear: number | null;
  timelineData?: TimelineItem[];
  topic?: string;
  defaultTopic?: string;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({ 
  onSearch, 
  onYearFilter, 
  isLoading,
  selectedYear,
  timelineData = [],
  topic = '',
  defaultTopic = ''
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [exporting, setExporting] = useState(false);
  
  useEffect(() => {
    if (defaultTopic && !searchInput) {
      setSearchInput(defaultTopic);
    }
  }, [defaultTopic]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const handleYearSubmit = (e: FormEvent) => {
    e.preventDefault();
    const year = yearInput ? parseInt(yearInput, 10) : null;
    if (year && (year < 1800 || year > new Date().getFullYear())) {
      alert('Please enter a valid year between 1800 and the current year');
      return;
    }
    onYearFilter(year);
  };

  const clearYearFilter = () => {
    setYearInput('');
    onYearFilter(null);
  };

  const handleExportPDF = async () => {
    if (!timelineData.length || !topic) return;
    
    setExporting(true);
    try {
      // const jsPDFModule = await import('jspdf');
      await import('jspdf-autotable');
      
      exportTimelineToPDF(topic, timelineData);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <label htmlFor="search-topic" className="block text-sm font-medium text-gray-400 mb-1">
            Research Topic
          </label>
          <form onSubmit={handleSubmit} className="flex">
            <input
              id="search-topic"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-gray-800 text-white w-full rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Machine Learning, Climate Science..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-4 py-2 rounded-r-md transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading
                </div>
              ) : (
                <span>Search</span>
              )}
            </button>
          </form>
        </div>

        <div className="md:w-48">
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-400 mb-1">
            Time Travel
          </label>
          <form onSubmit={handleYearSubmit} className="flex">
            <div className="relative flex-grow">
              <input
                id="year-filter"
                type="number"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                className="bg-gray-800 text-white w-full rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Year..."
                min="1800"
                max={new Date().getFullYear()}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-r-md transition-colors"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center">
          {selectedYear !== null && (
            <div className="flex items-center bg-blue-900/30 text-blue-300 py-1 px-3 rounded-full text-sm inline-flex">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              Viewing {selectedYear} only
              <button 
                onClick={clearYearFilter}
                className="ml-2 focus:outline-none"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <p className="text-sm text-gray-400 mb-2 sm:mb-0 sm:mr-2 sm:inline-block">Popular topics:</p>
          <div className="flex flex-wrap gap-2 inline-flex">
            <button 
              onClick={() => {
                setSearchInput("AI and its effects");
                onSearch("AI and its effects");
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1 px-3 rounded-full transition-colors"
            >
              AI and its effects
            </button>
            <button 
              onClick={() => {
                setSearchInput("Climate change policies");
                onSearch("Climate change policies");
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1 px-3 rounded-full transition-colors"
            >
              Climate change policies
            </button>
            <button 
              onClick={() => {
                setSearchInput("Quantum computing");
                onSearch("Quantum computing");
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1 px-3 rounded-full transition-colors"
            >
              Quantum computing
            </button>
          </div>
        </div>
        
        <button
          onClick={handleExportPDF}
          disabled={exporting || !timelineData.length}
          className="mt-3 sm:mt-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:opacity-50 
                   text-white px-3 py-1 rounded-full text-sm transition-colors flex items-center shrink-0"
        >
          {exporting ? (
            <>
              <svg className="animate-spin w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TimelineControls;