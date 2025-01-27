import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";

interface DashboardContainerProps {
  session: any;
  brandName: string | null;
  children: React.ReactNode;
}

export const DashboardContainer = ({ session, brandName, children }: DashboardContainerProps) => {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  // Redirect to signup if payment is pending
  if (profile?.payment_status === 'pending') {
    navigate('/signup');
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto p-4 md:p-6 pt-16">
        <Navigation session={session} />
        
        {!brandName && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please set up your brand name in the Branding tab to activate your scanner.
            </AlertDescription>
          </Alert>
        )}

        {children}
      </div>
    </div>
  );
};