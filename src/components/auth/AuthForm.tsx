import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

interface AuthFormProps {
  session?: Session | null;
}

export const AuthForm = ({ session }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Attempting to login via Edge Function');
      const { data, error } = await supabase.functions.invoke('login', {
        body: { email, password }
      });

      if (error) throw error;

      if (data) {
        console.log('Login successful:', data);
      }
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
    <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Business Owner Login</h2>
      {isLoading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
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
        }}
        theme="light"
        providers={[]}
        redirectTo={window.location.origin}
        onlyThirdPartyProviders={false}
      />
    </div>
  );
};