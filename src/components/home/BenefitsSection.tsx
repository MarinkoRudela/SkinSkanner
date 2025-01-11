import { Check, Star } from "lucide-react";
import { NewFeatureBadge } from "@/components/ui/new-feature-badge";

const benefits = [
  {
    title: "Fully Customizable",
    description: "Brand the app with your logo, business name, and personalized tagline",
    isNew: false,
  },
  {
    title: "AI-Powered Analysis",
    description: "Advanced skin analysis with personalized treatment recommendations based on your service offerings",
    isNew: true,
  },
  {
    title: "Smart Booking Integration",
    description: "Direct clients to your booking system with personalized treatment plans",
    isNew: false,
  },
  {
    title: "Analytics Dashboard",
    description: "Track visitor engagement, conversion rates, and ROI in real-time",
    isNew: true,
  },
];

export const BenefitsSection = () => {
  return (
    <div className="py-16 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-12">
          Why Med Spas Love Skin Skanner AI
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl flex items-start gap-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="rounded-full bg-primary/10 p-2 mt-1">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-indigo-900">
                    {benefit.title}
                  </h3>
                  {benefit.isNew && <NewFeatureBadge />}
                </div>
                <p className="text-indigo-700">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};