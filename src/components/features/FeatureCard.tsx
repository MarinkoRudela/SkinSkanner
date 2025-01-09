import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  benefits: string[];
}

export const FeatureCard = ({ title, description, benefits }: FeatureCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-indigo-900 mb-3">
          {title}
        </h2>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};