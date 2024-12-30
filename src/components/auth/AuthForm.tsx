import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthFormProps {
  session?: Session | null;
}

export const AuthForm = ({ session }: AuthFormProps) => {
  return (
    <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Business Owner Login</h2>
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