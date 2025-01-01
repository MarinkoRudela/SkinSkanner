import { Check } from "lucide-react";

const benefits = [
  {
    title: "Fully Customizable",
    description: "Brand the app with your logo, business name, and personalized tagline",
  },
  {
    title: "Instant Analysis",
    description: "AI-powered skin analysis provides immediate, professional recommendations",
  },
  {
    title: "Boost Bookings",
    description: "Direct clients to your booking system with personalized treatment plans",
  },
  {
    title: "Custom Links",
    description: "Share your branded scanner page anywhere with unique, short links",
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
              className="glass-card p-6 rounded-xl flex items-start gap-4"
            >
              <div className="rounded-full bg-primary/10 p-2 mt-1">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-indigo-700">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};