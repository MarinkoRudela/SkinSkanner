import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

interface BookingUrlFormProps {
  initialUrl: string;
  onSave: (url: string) => Promise<void>;
}

export const BookingUrlForm = ({ initialUrl, onSave }: BookingUrlFormProps) => {
  const [localBookingUrl, setLocalBookingUrl] = useState(initialUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
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
    <div>
      <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 mb-1">
        Booking URL
      </label>
      <div className="flex gap-2">
        <input
          type="url"
          id="bookingUrl"
          className="flex-1 p-2 border rounded"
          value={localBookingUrl}
          onChange={(e) => setLocalBookingUrl(e.target.value)}
          placeholder="Enter your booking platform URL"
        />
        <Button 
          onClick={handleSave}
          disabled={isSaving || localBookingUrl === initialUrl}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Enter the URL where clients can book appointments (e.g., your Calendly or Acuity link)
      </p>
    </div>
  );
};