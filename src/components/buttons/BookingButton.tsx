import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { useConversionTracking } from '@/hooks/use-conversion-tracking';
import { toast } from '@/hooks/use-toast';
import { formatUrl } from '@/utils/urlFormatter';

interface BookingButtonProps {
  bookingUrl: string;
  profileId?: string;
  shortCode?: string;
  linkVisitId?: string;
}

export const BookingButton = ({ 
  bookingUrl, 
  profileId, 
  shortCode, 
  linkVisitId 
}: BookingButtonProps) => {
  const { trackConversion } = useConversionTracking();

  const handleBookingClick = async () => {
    console.log('BookingButton: Starting click handler with:', {
      bookingUrl,
      profileId,
      shortCode,
      linkVisitId,
      currentDomain: window.location.hostname
    });

    if (!bookingUrl) {
      console.error('BookingButton: No booking URL provided');
      toast({
        title: "Error",
        description: "No booking URL configured for this business",
        variant: "destructive"
      });
      return;
    }

    try {
      // Format the URL to ensure it has a protocol
      console.log('BookingButton: Formatting URL:', bookingUrl);
      const formattedUrl = formatUrl(bookingUrl);
      console.log('BookingButton: Formatted URL:', formattedUrl);
      
      // Track conversion first if we have all required data
      if (profileId && shortCode && linkVisitId) {
        console.log('BookingButton: Tracking conversion before redirect');
        await trackConversion(formattedUrl, { profileId, shortCode, linkVisitId });
        console.log('BookingButton: Conversion tracked successfully');
      } else {
        console.log('BookingButton: Missing data for conversion tracking:', { profileId, shortCode, linkVisitId });
      }

      // Open in new tab immediately
      console.log('BookingButton: Opening URL in new tab:', formattedUrl);
      window.open(formattedUrl, '_blank');
    } catch (error) {
      console.error('BookingButton: Error handling booking click:', error);
      toast({
        title: "Error",
        description: "Failed to open booking page. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleBookingClick}
      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-6 sm:py-4 text-base sm:text-sm rounded-xl"
    >
      <CalendarDays className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
      Book Consultation
    </Button>
  );
};