import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper function to generate color placeholder
const generateColorPlaceholder = (width: number, height: number, text: string) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%231d9bf0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' fill='white' dominant-baseline='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
};

const Home: React.FC = () => {
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
            <img 
              src={generateColorPlaceholder(600, 400, "Literature Timeline")}
              alt="Timeonar Literature Timeline" 
              className="rounded-lg shadow-2xl"
            />
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
          <h2 className="text-3xl font-bold text-center mb-8">See It In Action</h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-10">
            Our interactive timeline visualizes how knowledge and discourse on topics evolve over time, 
            helping researchers, students, and curious minds understand the progression of ideas.
          </p>
          
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-8">
            <div className="aspect-w-16 aspect-h-9">
              <div className="flex items-center justify-center">
                <img 
                  src={generateColorPlaceholder(1200, 675, "Interactive Timeline Demo")}
                  alt="Timeline Demo" 
                  className="max-w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="py-12 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard 
              name="Dr. Alex Johnson"
              role="Research Scientist"
              image="https://i.pravatar.cc/100?img=1"
              quote="Timeonar has completely changed how I conduct literature reviews. I can track how concepts evolved over decades in minutes."
            />
            <TestimonialCard 
              name="Sarah Chen"
              role="PhD Candidate"
              image="https://i.pravatar.cc/100?img=5"
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