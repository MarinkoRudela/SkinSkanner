import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingUrlForm } from "../BookingUrlForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BookingTabProps {
  bookingUrl: string;
  updateBookingUrl: (url: string) => Promise<void>;
  uniqueLink: string;
}

export const BookingTab = ({ bookingUrl, updateBookingUrl, uniqueLink }: BookingTabProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueLink);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BookingUrlForm 
          initialUrl={bookingUrl} 
          onSave={updateBookingUrl}
        />
        
        {bookingUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Your Unique Booking Link</h3>
            <div className="flex gap-2">
              <Input value={uniqueLink} readOnly />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Share this link with your clients to let them book appointments through your customized scanner.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};