import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 bg-muted">
      <div className="max-w-4xl mx-auto text-center px-4 space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-indigo-700">
          Join leading med spas using Skin Skanner AI to enhance their consultations and boost bookings.
        </p>
        <Button
          onClick={() => navigate("/signup")}
          size="lg"
          className="text-lg px-8 py-6"
        >
          Start Your Free Trial <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};