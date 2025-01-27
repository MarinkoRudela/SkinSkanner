import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BusinessNameFormProps {
  userId: string;
  onComplete: () => void;
}

export const BusinessNameForm = ({ userId, onComplete }: BusinessNameFormProps) => {
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First store the business name
      const { error: nameError } = await supabase
        .from('pending_business_names')
        .insert([
          { user_id: userId, business_name: businessName }
        ]);

      if (nameError) throw nameError;

      // Create checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          userId,
          planType: 'monthly'
        }
      });

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        // Store email in localStorage to verify after payment
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          localStorage.setItem('pendingVerificationEmail', session.user.email);
        }
        
        // Redirect to Stripe checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // On error, redirect to signup page
      navigate("/signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 md:mt-8 bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">
        One Last Step
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Please enter your business name to complete the signup process
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <Input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter your business name"
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue to Payment"}
        </Button>
      </form>
    </div>
  );
};