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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 md:h-9 md:w-9">
            <Menu className="h-5 w-5 md:h-4 md:w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 md:w-40">
          <DropdownMenuItem onClick={handleScanClick} className="py-3 md:py-2">
            <Home className="mr-2 h-5 w-5 md:h-4 md:w-4" />
            Scan
          </DropdownMenuItem>
          
          {!session ? (
            <>
              <DropdownMenuItem onClick={() => navigate("/signup")} className="py-3 md:py-2">
                <UserPlus className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                Sign Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/login")} className="py-3 md:py-2">
                <LogIn className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                Login
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={handleConfigClick} className="py-3 md:py-2">
                <Settings className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="py-3 md:py-2">
                Logout
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};