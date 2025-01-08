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

  const handleBookingClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (!bookingUrl) {
      console.error('No booking URL provided');
      toast({
        title: "Error",
        description: "No booking URL configured for this business",
        variant: "destructive"
      });
      return;
    }

    console.log('Booking button clicked with:', {
      bookingUrl,
      profileId,
      shortCode,
      linkVisitId
    });

    try {
      // Format the URL to ensure it has a protocol
      const formattedUrl = formatUrl(bookingUrl);
      
      // Track conversion first if we have all required data
      if (profileId && shortCode && linkVisitId) {
        console.log('Tracking conversion before redirect');
        await trackConversion(formattedUrl, { profileId, shortCode, linkVisitId });
        console.log('Conversion tracked successfully');
      }

      // Open the URL in a new tab
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error handling booking click:', error);
      toast({
        title: "Error",
        description: "Failed to open booking page. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <a
      href={bookingUrl}
      onClick={handleBookingClick}
      className="w-full"
    >
      <Button
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-6 sm:py-4 text-base sm:text-sm rounded-xl"
      >
        <CalendarDays className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
        Book Consultation
      </Button>
    </a>
  );
};