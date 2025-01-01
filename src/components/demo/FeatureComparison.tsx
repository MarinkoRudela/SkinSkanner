import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export const FeatureComparison = () => {
  const features = [
    {
      name: "AI Skin Analysis",
      demo: true,
      full: true,
      description: "Advanced facial analysis with personalized recommendations"
    },
    {
      name: "Custom Branding",
      demo: false,
      full: true,
      description: "Add your business logo, name, and tagline"
    },
    {
      name: "Booking Integration",
      demo: false,
      full: true,
      description: "Direct consultation bookings from analysis results"
    },
    {
      name: "Multiple Scans",
      demo: false,
      full: true,
      description: "Unlimited skin analysis for your clients"
    }
  ];

  return (
    <Card className="p-6 mt-8">
      <h3 className="text-xl font-semibold text-center mb-6">
        Compare Features
      </h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="font-medium">Feature</div>
        <div className="text-center font-medium">Demo</div>
        <div className="text-center font-medium">Full Version</div>
        
        {features.map((feature, index) => (
          <>
            <div key={`name-${index}`} className="flex items-center">
              <span className="font-medium">{feature.name}</span>
              <span className="text-muted-foreground text-xs ml-2">
                {feature.description}
              </span>
            </div>
            <div key={`demo-${index}`} className="flex justify-center items-center">
              {feature.demo ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div key={`full-${index}`} className="flex justify-center items-center">
              <Check className="h-4 w-4 text-green-500" />
            </div>
          </>
        ))}
      </div>
    </Card>
  );
};