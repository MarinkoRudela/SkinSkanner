import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { PlanSelection } from "@/components/signup/PlanSelection";
import { SignUpForm } from "@/components/signup/SignUpForm";
import { BusinessNameForm } from "@/components/signup/BusinessNameForm";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [planType, setPlanType] = useState("monthly");
  const [showBusinessNameForm, setShowBusinessNameForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // If user is authenticated via Google but hasn't entered business name
      if (session?.user?.app_metadata?.provider === 'google') {
        setShowBusinessNameForm(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.app_metadata?.provider === 'google') {
        setShowBusinessNameForm(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the user with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            business_name: formData.businessName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (authError) throw authError;

      // After successful signup, create a checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          email: formData.email,
          planType: planType
        }
      });

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        // Store the user's email in localStorage to verify after payment
        localStorage.setItem('pendingVerificationEmail', formData.email);
        
        // Open Stripe checkout in the top-level window
        window.top.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={session} />
      <div className="container max-w-md mx-auto px-4 py-8">
        <Header />
        <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
          {showBusinessNameForm ? (
            <BusinessNameForm 
              userId={session?.user?.id} 
              onComplete={() => setShowBusinessNameForm(false)} 
            />
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">Business Owner Sign Up</h2>
              <PlanSelection planType={planType} setPlanType={setPlanType} />
              <SignUpForm
                loading={loading}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSignUp}
                onLoginClick={() => navigate("/login")}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;