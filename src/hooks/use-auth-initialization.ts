import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuthResponse } from '@/hooks/use-auth-response';
import { toast } from '@/hooks/use-toast';

export const useAuthInitialization = () => {
  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { handleResponse } = useAuthResponse();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (mounted) {
          console.log('Initial session retrieved:', initialSession?.user?.email);
          setSession(initialSession);
        }

      } catch (error: any) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to initialize authentication",
            variant: "destructive"
          });
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state changed:", _event, newSession?.user?.email);
      if (mounted) {
        setSession(newSession);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isInitializing };
};