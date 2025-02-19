
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
      // Check for existing business name entry
      const { data: existingEntry } = await supabase
        .from('pending_business_names')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingEntry?.stripe_checkout_url) {
        // If we have an existing checkout URL, redirect to it
        window.location.href = existingEntry.stripe_checkout_url;
        return;
      }

      // Create or update the business name entry
      const { error: nameError } = await supabase
        .from('pending_business_names')
        .upsert([
          { 
            user_id: userId, 
            business_name: businessName,
            last_checkout_attempt: new Date().toISOString()
          }
        ], {
          onConflict: 'user_id'
        });

      if (nameError) throw nameError;

      // Create checkout session
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          userId,
          businessName,
          planType: 'monthly'
        }
      });

      if (response.error) throw response.error;
      const checkoutData = response.data;

      if (checkoutData?.url) {
        // Store email in localStorage to verify after payment
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          localStorage.setItem('pendingVerificationEmail', session.user.email);
        }

        // Store the checkout URL
        const { error: updateError } = await supabase
          .from('pending_business_names')
          .update({ 
            stripe_checkout_url: checkoutData.url,
            last_checkout_attempt: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
        
        // Redirect to Stripe checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process signup. Please try again.",
        variant: "destructive",
      });
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
