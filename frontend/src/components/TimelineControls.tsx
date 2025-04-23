import React, { useState, useEffect } from 'react';

interface TimelineControlsProps {
  onSearch: (topic: string) => void;
  onYearFilter: (year: number | null) => void;
  isLoading: boolean;
  selectedYear: number | null;
  defaultTopic?: string;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({ 
  onSearch, 
  onYearFilter, 
  isLoading,
  selectedYear,
  defaultTopic = ''
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  
  // Set default topic if provided
  useEffect(() => {
    if (defaultTopic && !searchInput) {
      setSearchInput(defaultTopic);
    }
  }, [defaultTopic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleYearSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow">
          <label htmlFor="topic-search" className="block text-sm font-medium text-gray-400 mb-1">
            Search Topic
          </label>
          <form onSubmit={handleSubmit} className="flex">
            <div className="relative flex-grow">
              <input
                id="topic-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g., AI and its effects, Climate change policies"
                className="bg-black border border-gray-800 rounded-l-lg py-2 px-4 block w-full focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                placeholder="Year"
                min="1800"
                max={new Date().getFullYear()}
                className="bg-black border border-gray-800 rounded-l-lg py-2 px-4 block w-full focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !yearInput}
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 disabled:opacity-50"
            >
              Go
            </button>
            {selectedYear && (
              <button
                type="button"
                onClick={clearYearFilter}
                className="bg-gray-700 text-white px-2 py-2 rounded-r-lg hover:bg-gray-600"
              >
                ×
              </button>
            )}
          </form>
        </div>
      </div>
      
      {selectedYear && (
        <div className="mt-3 inline-flex items-center bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-sm">
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
      
      {/* Quick topic suggestions */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Popular topics:</p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              setSearchInput("AI and its effects");
              onSearch("AI and its effects");
            }}
            className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300"
            disabled={isLoading}
          >
            AI and its effects
          </button>
          <button 
            onClick={() => {
              setSearchInput("Climate change policies");
              onSearch("Climate change policies");
            }}
            className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300"
            disabled={isLoading}
          >
            Climate change policies
          </button>
          <button 
            onClick={() => {
              setSearchInput("Quantum computing");
              onSearch("Quantum computing");
            }}
            className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300"
            disabled={isLoading}
          >
            Quantum computing
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineControls;