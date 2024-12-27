import { Button } from "@/components/ui/button";
import { Settings, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const Navigation = ({ session }: { session: any }) => {
  const navigate = useNavigate();

  const handleConfigClick = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to access settings",
      });
      return;
    }
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("config", "true");
    navigate(`?${searchParams.toString()}`);
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
    <div className="absolute top-4 right-4 flex gap-2">
      {!session ? (
        <>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate("/signup")}
          >
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate("/login")}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleConfigClick}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};