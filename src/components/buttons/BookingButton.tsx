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

  const handleBookingClick = async () => {
    console.log('Booking URL clicked:', bookingUrl);
    await trackConversion(bookingUrl, { profileId, shortCode, linkVisitId });
  };

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
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