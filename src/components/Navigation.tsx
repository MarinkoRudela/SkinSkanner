import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NavigationDropdown } from "./navigation/NavigationDropdown";
import { useQuery } from "@tanstack/react-query";

export const Navigation = ({ session }: { session: any }) => {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
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

  const handleScanClick = () => {
    if (profile?.payment_status === 'pending') {
      navigate('/signup');
      return;
    }
    window.location.href = '/';
  };

  const handleConfigClick = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to access settings",
      });
      navigate("/login");
      return;
    }
    if (profile?.payment_status === 'pending') {
      navigate('/signup');
      return;
    }
    window.location.href = '/?config=true';
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50">
      <NavigationDropdown
        session={session}
        handleScanClick={handleScanClick}
        handleConfigClick={handleConfigClick}
        handleLogout={handleLogout}
      />
    </div>
  );
};