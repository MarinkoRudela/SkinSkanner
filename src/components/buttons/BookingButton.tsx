import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { useConversionTracking } from '@/hooks/use-conversion-tracking';

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
    console.log('Booking button clicked with URL:', bookingUrl);
    
    if (!bookingUrl) {
      console.error('No booking URL provided');
      return;
    }

    // Track conversion first
    if (profileId && shortCode && linkVisitId) {
      console.log('Tracking conversion before redirect');
      try {
        await trackConversion(bookingUrl, { profileId, shortCode, linkVisitId });
        console.log('Conversion tracked successfully');
      } catch (error) {
        console.error('Error tracking conversion:', error);
        // Continue with redirect even if tracking fails
      }
    }

    // Ensure redirect happens after tracking attempt
    console.log('Redirecting to:', bookingUrl);
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
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