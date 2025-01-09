import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Features = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Advanced AI Skin Analysis",
      description: "Our cutting-edge AI technology provides medical-grade skin analysis in seconds, detecting concerns that might be invisible to the naked eye. Transform your consultation process with precision diagnostics.",
      benefits: [
        "Instant detection of 20+ skin concerns",
        "Medical-grade accuracy rivaling expensive hardware",
        "Custom-tailored treatment recommendations",
        "Multi-angle facial analysis for comprehensive results"
      ]
    },
    {
      title: "Automated Client Acquisition",
      description: "Convert website and social media visitors into high-value clients automatically. Our smart booking system captures leads 24/7, filling your consultation calendar while you focus on treatments.",
      benefits: [
        "24/7 automated consultation booking",
        "Qualified leads with detailed skin analysis",
        "Higher conversion rates with personalized recommendations",
        "Seamless integration with your existing booking system"
      ]
    },
    {
      title: "Premium Brand Experience",
      description: "Elevate your med spa's digital presence with a luxury, branded experience that sets you apart from competitors and justifies premium pricing.",
      benefits: [
        "Custom-branded analysis portal",
        "Professional result presentations",
        "Shareable analysis links for social proof",
        "Mobile-optimized experience"
      ]
    },
    {
      title: "Business Intelligence Dashboard",
      description: "Gain unprecedented insights into your client acquisition funnel with our comprehensive analytics suite.",
      benefits: [
        "Real-time conversion tracking",
        "Detailed visitor analytics",
        "Treatment demand forecasting",
        "ROI performance metrics"
      ]
    },
    {
      title: "Client Engagement Tools",
      description: "Keep clients coming back with our suite of engagement features that drive repeat visits and referrals.",
      benefits: [
        "Progress tracking over time",
        "Automated follow-up recommendations",
        "Social sharing capabilities",
        "Treatment journey documentation"
      ]
    }
  ];

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
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-indigo-900 mb-3">
                  {feature.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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