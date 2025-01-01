import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Edit2, Save } from "lucide-react";

interface BookingUrlFormProps {
  initialUrl: string;
  onSave: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const BookingUrlForm = ({ initialUrl, onSave, isLoading }: BookingUrlFormProps) => {
  const [localBookingUrl, setLocalBookingUrl] = useState(initialUrl);
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Booking URL updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving booking URL:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bookingUrl">Booking URL</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            id="bookingUrl"
            value={localBookingUrl}
            onChange={(e) => setLocalBookingUrl(e.target.value)}
            placeholder="Enter your booking platform URL (e.g., Calendly, Acuity)"
            className="w-full"
            disabled={!isEditing || isLoading}
          />
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="shrink-0"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              disabled={isLoading || localBookingUrl === initialUrl}
              className="shrink-0"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Enter the URL where clients can book appointments. This will be used to generate your unique booking link.
        </p>
      </div>
    </div>
  );
};