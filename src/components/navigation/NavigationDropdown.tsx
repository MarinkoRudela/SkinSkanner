import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItems } from "./MenuItems";

interface NavigationDropdownProps {
  session: any;
  handleScanClick: () => void;
  handleConfigClick: () => void;
  handleLogout: () => void;
}

export const NavigationDropdown = ({ 
  session, 
  handleScanClick, 
  handleConfigClick, 
  handleLogout 
}: NavigationDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 md:h-9 md:w-9 touch-manipulation"
        >
          <Menu className="h-5 w-5 md:h-4 md:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 md:w-48"
      >
        <MenuItems 
          session={session}
          handleScanClick={handleScanClick}
          handleConfigClick={handleConfigClick}
          handleLogout={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};