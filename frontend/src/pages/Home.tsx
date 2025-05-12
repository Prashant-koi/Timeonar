import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import mockMachineLearningData from '../data/machine-learning-timeline.json';

// Helper function to generate color placeholder
// const generateColorPlaceholder = (width: number, height: number, text: string) => {
//   return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%231d9bf0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' fill='white' dominant-baseline='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
// };

const Home: React.FC = () => {
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [demoData, setDemoData] = useState<any[]>([]);
  
  useEffect(() => {
    // loading 3 entires for preview
    const previewData = [...mockMachineLearningData.timeline]
      .sort((a, b) => b.year - a.year)
      .slice(0, 3);
    
    setDemoData(previewData);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Discover Knowledge Evolution Through Time
            </h1>
            <p className="text-xl text-gray-400">
              Timeonar uses Perplexity's Sonar API to create smart literature timelines 
              that track how topics evolve over time. Explore the progression of ideas, trends, and discoveries.
            </p>
            <div className="pt-4">
              <Link 
                to="/timeonar" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition duration-300"
              >
                Get Started
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            {/* Replace placeholder with mini timeline demo */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
              <div className="p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center">
                  <span className="mr-2">Machine Learning Timeline</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">DEMO</span>
                </h3>
              </div>
              
              <div className="p-4 max-h-[400px] overflow-y-auto">
                <div className="border-l-2 border-gray-800 ml-4 mt-2">
                  {demoData.slice(0, 3).map((item) => (
                    <div key={item.id} className="relative ml-6 mb-6">
                      <div className="absolute -left-8 mt-1">
                        <div className="bg-blue-500 border-4 border-gray-900 h-3 w-3 rounded-full"></div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-base font-bold">{item.title}</h4>
                          <div className="bg-blue-500 text-white text-sm px-2.5 rounded-full">
                            {item.year}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.summary}</p>
                        
                        {item.keyInsight && (
                          <div className="mb-3 bg-blue-500/10 p-2 rounded border-l-4 border-blue-500">
                            <div className="font-bold text-xs text-blue-400">KEY INSIGHT:</div>
                            <p className="text-gray-300 text-sm italic line-clamp-2">{item.keyInsight}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 border-t border-gray-800 bg-gray-900 text-center">
                <Link to="/timeonar" className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                  Explore Full Timeline →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">How Timeonar Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🔍"
              title="Search Any Topic" 
              description="Enter a topic of interest like 'AI alignment' or 'Climate change policies' and let Sonar pull data from articles and papers."
            />
            <FeatureCard 
              icon="⏳"
              title="Chronological Timeline" 
              description="AI builds an interactive timeline with headlines, event summaries, and citations that visualize the evolution of ideas."
            />
            <FeatureCard 
              icon="🕰️"
              title="Time Travel" 
              description="Jump to specific years to see prevailing opinions and knowledge from that time period only."
            />
          </div>
        </div>
        
        {/* Demo/Visualization Section */}
        <div className="py-12 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-center mb-4">See It In Action</h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-4">
            Our interactive timeline visualizes how knowledge and discourse on topics evolve over time, 
            helping researchers, students, and curious minds understand the progression of ideas.
          </p>
          
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-xl">⚠️</div>
              <div>
                <p className="font-medium text-orange-400">Demo Preview Only</p>
                <p className="text-gray-400 text-sm">
                  This is a simplified demonstration with pre-loaded mock data. The actual Timeonar application will provide more comprehensive 
                  and dynamically generated timelines from Perplexity's Sonar API with richer interactive features.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-8">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold flex items-center">
                <span className="mr-2">Machine Learning Timeline</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">DEMO</span>
              </h3>
              
              <button 
                onClick={() => setShowFullTimeline(!showFullTimeline)}
                className="text-sm bg-gray-800 hover:bg-gray-700 py-1 px-3 rounded-full"
              >
                {showFullTimeline ? "Show Less" : "Show More"}
              </button>
            </div>
            
            {/* Demo Timeline Display */}
            <div className="overflow-y-auto max-h-[600px]">
              <div className="border-l-2 border-gray-800 ml-6 mt-3">
                {(showFullTimeline ? mockMachineLearningData.timeline : demoData)
                  .sort((a, b) => b.year - a.year)
                  .map((item) => (
                    <div key={item.id} className="relative ml-6 mb-8">
                      <div className="absolute -left-8 mt-1">
                        <div className="bg-blue-500 border-4 border-gray-900 h-4 w-4 rounded-full"></div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold">{item.title}</h4>
                          <div className="bg-blue-500 text-white px-3 rounded-full text-sm">
                            {item.year}
                          </div>
                        </div>
                        
                        {/* Display discovery if available */}
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
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="text-gray-400">
                            Source: {item.source}
                          </div>
                          <div className="text-blue-400">
                            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">Read More</a>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="py-12 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard 
              name="Dr. Abcd Smith"
              role="Research Scientist"
              image="https://i.pravatar.cc/100?img=99"
              quote="Timeonar has completely changed how I conduct literature reviews. I can track how concepts evolved over decades in minutes."
            />
            <TestimonialCard 
              name="Efgh Jones"
              role="PhD Candidate"
              image="https://i.pravatar.cc/100?img=99"
              quote="The Time Travel feature is groundbreaking. Being able to isolate perspectives from specific years has been invaluable for my dissertation."
            />
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to explore knowledge evolution?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of researchers, students, and curious minds using Timeonar</p>
          <Link 
            to="/timeonar" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full inline-flex items-center transition duration-300"
          >
            Get Started for Free
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper Components
const FeatureCard: React.FC<{icon: string; title: string; description: string}> = ({icon, title, description}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 transition duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const TestimonialCard: React.FC<{name: string; role: string; image: string; quote: string}> = ({name, role, image, quote}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full mr-4"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%231d9bf0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' text-anchor='middle' fill='white' dominant-baseline='middle'%3E${name[0]}%3C/text%3E%3C/svg%3E`;
          }}
        />
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
      <p className="italic text-gray-300">"{quote}"</p>
    </div>
  );
};

export default Home;