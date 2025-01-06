import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1A1F2C] leading-tight">
          Transform Your Med Spa with
          <span className="block purple-gradient bg-clip-text text-transparent font-extrabold">
            AI-Powered Skin Analysis
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-[#403E43] max-w-2xl mx-auto">
          Enhance your consultations, boost bookings, and provide personalized treatment recommendations with our cutting-edge AI technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate("/signup")}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Sign Up <ArrowRight className="ml-2" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/demo")}
            className="text-lg px-8 py-6"
          >
            Try Demo
          </Button>
        </div>
      </div>
    </div>
  );
};