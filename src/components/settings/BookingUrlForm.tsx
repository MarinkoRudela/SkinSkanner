import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Edit2, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { formatUrl } from "@/utils/urlFormatter";

interface BookingUrlFormProps {
  initialUrl: string;
  onSave: (url: string) => Promise<void>;
  isLoading: boolean;
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const BookingUrlForm = ({ initialUrl, onSave, isLoading }: BookingUrlFormProps) => {
  const [localBookingUrl, setLocalBookingUrl] = useState(initialUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string) => {
    if (!url) {
      setError("Please enter a booking URL");
      return false;
    }
    
    // Format URL with protocol if needed
    const formattedUrl = formatUrl(url);
    
    if (!isValidUrl(formattedUrl)) {
      setError("Please enter a valid URL");
      return false;
    }

    setError(null);
    return formattedUrl;
  };

  const handleSave = async () => {
    const formattedUrl = validateUrl(localBookingUrl);
    if (!formattedUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid booking URL",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(formattedUrl);
      setIsEditing(false);
      setLocalBookingUrl(formattedUrl); // Update local state with formatted URL
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
            onChange={(e) => {
              setLocalBookingUrl(e.target.value);
              validateUrl(e.target.value);
            }}
            placeholder="Enter your booking platform URL (e.g., calendly.com/your-business)"
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
              disabled={isLoading || localBookingUrl === initialUrl || !!error}
              className="shrink-0"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground">
          Enter the URL where clients can book appointments. This will be used to generate your unique booking link.
        </p>
      </div>
    </div>
  );
};