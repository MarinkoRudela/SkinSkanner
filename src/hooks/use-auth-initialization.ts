import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuthResponse } from '@/hooks/use-auth-response';
import { toast } from '@/hooks/use-toast';

export const useAuthInitialization = () => {
  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { handleResponse } = useAuthResponse();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session: authSession } } = await supabase.auth.getSession();
        console.log('Auth session retrieved:', authSession?.user?.email);
        
        const processedSession = await handleResponse(
          new Response(JSON.stringify({ session: authSession })),
          'auth-session'
        );
        
        setSession(processedSession.session);
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast({
          title: "Error",
          description: "Failed to initialize authentication",
          variant: "destructive"
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log('Auth state changed:', _event, newSession?.user?.email);
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [handleResponse]);

  return { session, isInitializing };
};