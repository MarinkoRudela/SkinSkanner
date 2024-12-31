import { Button } from "@/components/ui/button";
import { Settings, LogIn, UserPlus, Home, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = ({ session }: { session: any }) => {
  const navigate = useNavigate();

  const handleScanClick = () => {
    // Clear any config parameters and navigate to home
    const baseUrl = window.location.pathname;
    navigate(baseUrl);
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
    // First navigate to root path, then add config parameter
    navigate("/");
    // Add a slight delay to ensure we're on the root path before adding the parameter
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("config", "true");
      navigate(`?${searchParams.toString()}`);
    }, 100);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      // After logout, clear any config parameters and go to home
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
    <div className="absolute top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleScanClick}>
            <Home className="mr-2 h-4 w-4" />
            Scan
          </DropdownMenuItem>
          
          {!session ? (
            <>
              <DropdownMenuItem onClick={() => navigate("/signup")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/login")}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={handleConfigClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};