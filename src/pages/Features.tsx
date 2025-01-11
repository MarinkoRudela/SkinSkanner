import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { features } from '@/data/features';
import { FeatureCard } from '@/components/features/FeatureCard';

export const Features = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={null} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Transform Your Med Spa with AI-Powered Innovation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join leading med spas using Skin Skanner AI to revolutionize their consultation process and dramatically increase bookings
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
              isNew={feature.isNew}
            />
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg"
          >
            Sign Up Now
          </Button>
          <p className="mt-4 text-gray-600">
            Join the leading med spas revolutionizing their business with AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;