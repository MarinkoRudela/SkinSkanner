import { Home, LogIn, UserPlus, Settings, Sparkles } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface MenuItemsProps {
  session: any;
  handleScanClick: () => void;
  handleConfigClick: () => void;
  handleLogout: () => void;
}

export const MenuItems = ({ session, handleScanClick, handleConfigClick, handleLogout }: MenuItemsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenuItem 
        onClick={handleScanClick} 
        className="py-3 md:py-2.5 px-4 cursor-pointer touch-manipulation"
      >
        <Home className="mr-2 h-5 w-5 md:h-4 md:w-4" />
        Home
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onClick={() => navigate("/features")} 
        className="py-3 md:py-2.5 px-4 cursor-pointer touch-manipulation"
      >
        <Sparkles className="mr-2 h-5 w-5 md:h-4 md:w-4" />
        Features
      </DropdownMenuItem>

      {!session ? (
        <>
          <DropdownMenuItem 
            onClick={() => navigate("/signup")} 
            className="py-3 md:py-2.5 px-4 cursor-pointer touch-manipulation"
          >
            <UserPlus className="mr-2 h-5 w-5 md:h-4 md:w-4" />
            Sign Up
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate("/login")} 
            className="py-3 md:py-2.5 px-4 cursor-pointer touch-manipulation"
          >
            <LogIn className="mr-2 h-5 w-5 md:h-4 md:w-4" />
            Login
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuItem 
            onClick={handleConfigClick} 
            className="py-3 md:py-2.5 px-4 cursor-pointer touch-manipulation"
          >
            <Settings className="mr-2 h-5 w-5 md:h-4 md:w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="py-3 md:py-2.5 px-4 cursor-pointer touch-manipulation"
          >
            Logout
          </DropdownMenuItem>
        </>
      )}
    </>
  );
};