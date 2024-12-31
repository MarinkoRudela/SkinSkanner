import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  isReady: boolean;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isReady: false,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setAuthState(prev => ({
          ...prev,
          session,
          isReady: true,
          loading: false,
        }));
      } catch (error: any) {
        setAuthState(prev => ({
          ...prev,
          error,
          isReady: true,
          loading: false,
        }));
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setAuthState(prev => ({
          ...prev,
          session,
          isReady: true,
          loading: false,
        }));
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}