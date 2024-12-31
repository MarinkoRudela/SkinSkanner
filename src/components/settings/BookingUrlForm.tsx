import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";

interface BookingUrlFormProps {
  initialUrl: string;
  onSave: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const BookingUrlForm = ({ initialUrl, onSave, isLoading }: BookingUrlFormProps) => {
  const [localBookingUrl, setLocalBookingUrl] = useState(initialUrl);

  const handleSave = async () => {
    if (!localBookingUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid booking URL",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(localBookingUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bookingUrl">Booking URL</Label>
        <Input
          type="url"
          id="bookingUrl"
          value={localBookingUrl}
          onChange={(e) => setLocalBookingUrl(e.target.value)}
          placeholder="Enter your booking platform URL (e.g., Calendly, Acuity)"
          className="w-full"
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Enter the URL where clients can book appointments. This will be used to generate your unique booking link.
        </p>
      </div>
      <Button 
        onClick={handleSave}
        disabled={isLoading || localBookingUrl === initialUrl}
        className="w-full"
      >
        {isLoading ? "Saving..." : "Save Booking URL"}
      </Button>
    </div>
  );
};