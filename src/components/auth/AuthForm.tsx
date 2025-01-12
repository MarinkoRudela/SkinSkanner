import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Login successful",
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login Error",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 md:mt-8 bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">Business Owner Login</h2>
      {isLoading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      )}
      <Auth 
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#6366f1',
                brandAccent: '#4f46e5',
              },
            },
          },
          className: {
            container: 'w-full',
            button: 'w-full py-3 md:py-4 text-base md:text-lg rounded-lg',
            input: 'w-full px-3 py-2 md:py-3 text-base rounded-lg border focus:ring-2 focus:ring-indigo-500',
            label: 'block text-sm md:text-base font-medium mb-1 md:mb-2',
          },
        }}
        theme="light"
        providers={["google"]}
        redirectTo={window.location.origin}
        onlyThirdPartyProviders={false}
      />
    </div>
  );
};