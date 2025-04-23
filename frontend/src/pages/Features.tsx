import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

// Helper function to generate color placeholder
const generateColorPlaceholder = (width: number, height: number, text: string) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%231d9bf0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' fill='white' dominant-baseline='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
};

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Powerful Features</h1>
        <p className="text-gray-400 text-center max-w-3xl mx-auto mb-16">
          Explore how Timeonar's unique capabilities powered by Perplexity's Sonar API help you understand the evolution of knowledge over time.
        </p>
        
        {/* Main Feature */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-24">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center bg-blue-500/20 text-blue-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
                Core Feature
              </div>
              <h2 className="text-3xl font-bold mb-6">Smart Literature Timeline</h2>
              <p className="text-gray-300 mb-6">
                Track how any topic evolves over time with our Smart Literature Timeline. 
                Timeonar uses Perplexity's Sonar API to analyze thousands of academic papers, articles, 
                and publications, creating a chronological timeline that visualizes the progression of ideas 
                and knowledge.
              </p>
              <ul className="space-y-3 mb-8">
                {['Chronologically organized research', 'Key insights highlighted', 'Citation metrics included', 'Source links for deeper exploration'].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/timeonar" 
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                Try It Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-gray-800 flex items-center justify-center p-6">
              <img 
                src={generateColorPlaceholder(500, 400, "Timeline View")}
                alt="Smart Literature Timeline" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <FeatureCard
            icon="🕰️"
            title="Time Travel"
            description="Jump to specific years to see prevailing opinions and knowledge from a certain time period only. Compare how understanding has changed across decades."
            image={generateColorPlaceholder(300, 200, "Time Travel")}
          />
          
          <FeatureCard
            icon="🔍"
            title="Topic Discovery"
            description="Search any topic of interest and watch as Sonar API pulls comprehensive data from thousands of articles and research papers across multiple disciplines."
            image={generateColorPlaceholder(300, 200, "Search Topics")}
          />
          
          <FeatureCard
            icon="📊"
            title="Citation Impact Analysis"
            description="See which papers and ideas have had the most influence over time with built-in citation metrics and impact visualization."
            image={generateColorPlaceholder(300, 200, "Citation Metrics")}
          />
          
          <FeatureCard
            icon="🧩"
            title="Key Insight Extraction"
            description="Our AI automatically identifies and highlights key insights from each paper, saving you hours of reading and helping you focus on what matters."
            image={generateColorPlaceholder(300, 200, "Key Insights")}
          />
        </div>
        
        {/* Secondary Features */}
        <h2 className="text-3xl font-bold text-center mb-12">Additional Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <SecondaryFeatureCard
            icon="💾"
            title="Export and Share"
            description="Save your timelines as PDFs or CSVs, or share them directly with colleagues via link (Pro plan and above)."
          />
          
          <SecondaryFeatureCard
            icon="🔗"
            title="Source Integration"
            description="Direct links to original papers and articles so you can seamlessly access primary sources."
          />
          
          <SecondaryFeatureCard
            icon="🔔"
            title="Topic Alerts"
            description="Set up alerts to be notified when significant new research is published on your topics of interest."
          />
          
          <SecondaryFeatureCard
            icon="📱"
            title="Cross-Platform Access"
            description="Access your timelines from any device with our responsive web application."
          />
          
          <SecondaryFeatureCard
            icon="🔒"
            title="Research History"
            description="Your search history is saved so you can quickly return to previous research sessions."
          />
          
          <SecondaryFeatureCard
            icon="🌐"
            title="API Access"
            description="Integrate Timeonar data into your own applications with our developer API (Enterprise plan)."
          />
        </div>
        
        {/* Use Cases */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Use Cases</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <UseCase
              icon="🎓"
              title="Academic Research"
              description="Track the evolution of research in your field and identify gaps for new studies."
            />
            
            <UseCase
              icon="📚"
              title="Literature Reviews"
              description="Create comprehensive literature reviews in a fraction of the time normally required."
            />
            
            <UseCase
              icon="🏢"
              title="Corporate R&D"
              description="Stay on top of industry trends and technological developments relevant to your business."
            />
            
            <UseCase
              icon="🧠"
              title="Personal Learning"
              description="Explore topics of personal interest and develop deeper understanding through chronological context."
            />
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore the Evolution of Knowledge?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of researchers, students, and curious minds who use Timeonar 
            to discover how ideas and knowledge evolve over time.
          </p>
          <Link 
            to="/timeonar" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition duration-300 mr-4"
          >
            Get Started for Free
          </Link>
          <Link 
            to="/pricing" 
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition duration-300"
          >
            View Pricing
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  image: string;
}> = ({ icon, title, description, image }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300">
      <div className="p-6">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
      </div>
      <div className="bg-gray-800 p-4 flex justify-center">
        <img src={image} alt={title} className="rounded-md" />
      </div>
    </div>
  );
};

const SecondaryFeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500 transition-all duration-300">
      <div className="flex items-start">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

const UseCase: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-5 text-center hover:bg-gray-700 transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default Features;