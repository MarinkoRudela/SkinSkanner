import React from "react";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export const FeatureComparison = () => {
  const features = [
    {
      name: "AI Skin Analysis",
      demo: true,
      full: true,
      description: "Advanced facial analysis with personalized recommendations and detailed skin concerns detection"
    },
    {
      name: "Custom Branding",
      demo: false,
      full: true,
      description: "Add your business logo, name, and create a professional branded experience"
    },
    {
      name: "Booking Integration",
      demo: false,
      full: true,
      description: "Direct consultation bookings with custom URLs and tracking capabilities"
    },
    {
      name: "Multiple Scans",
      demo: false,
      full: true,
      description: "Unlimited skin analysis scans for all your clients with history tracking"
    },
    {
      name: "Treatment Recommendations",
      demo: true,
      full: true,
      description: "AI-powered personalized treatment suggestions based on skin analysis"
    }
  ];

  return (
    <Card className="p-6 mt-8 shadow-lg">
      <h3 className="text-2xl font-semibold text-center mb-8 text-indigo-900">
        Compare Features
      </h3>
      <div className="grid grid-cols-3 gap-6 text-sm">
        <div className="font-medium text-indigo-900">Feature</div>
        <div className="text-center font-medium text-indigo-900">Demo</div>
        <div className="text-center font-medium text-indigo-900">Full Version</div>
        
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-indigo-900">{feature.name}</span>
              <span className="text-muted-foreground text-xs">
                {feature.description}
              </span>
            </div>
            <div className="flex justify-center items-center">
              {feature.demo ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex justify-center items-center">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};