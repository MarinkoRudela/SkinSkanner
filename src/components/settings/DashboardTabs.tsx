import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full mb-6">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tab" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="guide">Setup Guide</SelectItem>
            <SelectItem value="booking">Booking Settings</SelectItem>
            <SelectItem value="branding">Branding</SelectItem>
            <SelectItem value="integration">Integration</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="guide">Setup Guide</TabsTrigger>
      <TabsTrigger value="booking">Booking Settings</TabsTrigger>
      <TabsTrigger value="branding">Branding</TabsTrigger>
      <TabsTrigger value="integration">Integration</TabsTrigger>
      <TabsTrigger value="subscription">Subscription</TabsTrigger>
    </TabsList>
  );
};