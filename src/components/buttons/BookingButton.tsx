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
    e.preventDefault(); // Prevent default to handle tracking first
    console.log('Booking URL clicked:', bookingUrl);
    
    try {
      await trackConversion(bookingUrl, { profileId, shortCode, linkVisitId });
      // After tracking is complete, redirect to the booking URL
      window.location.href = bookingUrl;
    } catch (error) {
      console.error('Error tracking conversion:', error);
      // Even if tracking fails, still redirect to ensure functionality
      window.location.href = bookingUrl;
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