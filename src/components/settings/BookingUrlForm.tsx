import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";

interface BookingUrlFormProps {
  initialUrl: string;
  onSave: (url: string) => Promise<void>;
}

export const BookingUrlForm = ({ initialUrl, onSave }: BookingUrlFormProps) => {
  const [localBookingUrl, setLocalBookingUrl] = useState(initialUrl);
  const [isSaving, setIsSaving] = useState(false);

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
      setIsSaving(true);
      await onSave(localBookingUrl);
      toast({
        title: "Success",
        description: "Your booking URL has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
        />
        <p className="text-sm text-muted-foreground">
          Enter the URL where clients can book appointments. This will be used to generate your unique booking link.
        </p>
      </div>
      <Button 
        onClick={handleSave}
        disabled={isSaving || localBookingUrl === initialUrl}
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save Booking URL"}
      </Button>
    </div>
  );
};