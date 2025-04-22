import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-400 text-center max-w-3xl mx-auto mb-12">
          Choose the plan that fits your needs. All plans include access to our Smart Literature Timeline feature.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Basic"
            price="Free"
            description="Perfect for occasional research and exploration"
            features={[
              "5 timeline searches per day",
              "Basic timeline visualization",
              "7-day data history",
              "Access to public research papers"
            ]}
            buttonText="Get Started"
            buttonLink="/timeonar"
            highlighted={false}
          />
          
          <PricingCard
            name="Pro"
            price="$9.99"
            period="monthly"
            description="Ideal for students, educators, and researchers"
            features={[
              "Unlimited timeline searches",
              "Advanced timeline visualizations",
              "30-day data history",
              "Access to premium journals",
              "Export to PDF and CSV",
              "Email support"
            ]}
            buttonText="Subscribe Now"
            buttonLink="/pricing"
            highlighted={true}
          />
          
          <PricingCard
            name="Enterprise"
            price="$29.99"
            period="monthly"
            description="For teams and organizations"
            features={[
              "Everything in Pro",
              "Unlimited team members",
              "API access",
              "Custom data integrations",
              "Advanced analytics",
              "Priority support",
              "Dedicated account manager"
            ]}
            buttonText="Contact Sales"
            buttonLink="/contact"
            highlighted={false}
          />
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
          <p className="text-gray-400 mb-6">
            We offer tailored plans for academic institutions, research teams, and enterprises.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-blue-500 hover:text-blue-400"
          >
            Contact us to learn more
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted
}) => {
  return (
    <div className={`
      rounded-2xl p-6 
      ${highlighted ? 'border-2 border-blue-500 bg-gray-900 transform scale-105 shadow-xl' : 'border border-gray-800 bg-gray-900'}
    `}>
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold mb-1 ${highlighted ? 'text-blue-500' : 'text-white'}`}>{name}</h3>
        <div className="my-4">
          <span className="text-4xl font-bold">{price}</span>
          {period && <span className="text-gray-400">/{period}</span>}
        </div>
        <p className="text-gray-400">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="text-center">
        <a
          href={buttonLink}
          className={`
            inline-block w-full py-3 px-6 rounded-full font-bold transition-colors
            ${highlighted
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-white'}
          `}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default Pricing;