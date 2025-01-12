import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingUrlForm } from "../BookingUrlForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BookingUrlGuide } from "../BookingUrlGuide";
import { QRCodeGenerator } from "../QRCodeGenerator";

interface BookingTabProps {
  bookingUrl: string;
  updateBookingUrl: (url: string) => Promise<void>;
  uniqueLink: string;
  isLoading: boolean;
}

export const BookingTab = ({ 
  bookingUrl, 
  updateBookingUrl, 
  uniqueLink,
  isLoading 
}: BookingTabProps) => {
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

  // Extract short code from unique link
  const shortCode = uniqueLink.split('/').pop() || '';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Booking Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BookingUrlForm 
          initialUrl={bookingUrl} 
          onSave={updateBookingUrl}
          isLoading={isLoading}
        />
        
        {bookingUrl && uniqueLink && (
          <>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Your Unique Scanner Link</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  value={uniqueLink} 
                  readOnly 
                  className="flex-1 text-sm"
                />
                <Button 
                  onClick={copyToClipboard} 
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Share this link with your clients to let them book appointments through your customized scanner.
              </p>
            </div>

            <QRCodeGenerator shortCode={shortCode} />
          </>
        )}

        <BookingUrlGuide />
      </CardContent>
    </Card>
  );
};