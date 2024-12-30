import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession);
      if (event === 'SIGNED_IN' && currentSession) {
        setSession(currentSession);
        navigate("/dashboard");
      }
    });

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        if (currentSession) {
          console.log('Existing session found');
          setSession(currentSession);
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error('Session check failed:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={session} />
      <div className="container max-w-md mx-auto px-4 py-8">
        <Header />
        <AuthForm session={session} />
      </div>
    </div>
  );
};

export default Login;