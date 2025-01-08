import { Button } from '@/components/ui/button';
import { CalendarDays, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { formatUrl } from '@/utils/urlFormatter';

interface ActionButtonsProps {
  bookingUrl: string;
  onScanAgain: () => void;
  profileId?: string;
  shortCode?: string;
  linkVisitId?: string;
}

export const ActionButtons = ({ 
  bookingUrl, 
  onScanAgain, 
  profileId,
  shortCode,
  linkVisitId 
}: ActionButtonsProps) => {
  const navigate = useNavigate();
  const isDemo = bookingUrl === '/signup';

  const handleBookingClick = async () => {
    if (isDemo) {
      navigate('/signup');
      return;
    }

    try {
      // Only track conversion if we have all required data
      if (profileId && shortCode && linkVisitId) {
        await supabase
          .from('booking_conversions')
          .insert([{
            link_visit_id: linkVisitId,
            profile_id: profileId,
            short_code: shortCode,
            booking_url_clicked: bookingUrl
          }]);
      }

      // Format URL before opening
      const formattedUrl = formatUrl(bookingUrl);
      window.open(formattedUrl, '_blank');
    } catch (error) {
      console.error('Error tracking booking conversion:', error);
      // Still open the booking URL even if tracking fails
      const formattedUrl = formatUrl(bookingUrl);
      window.open(formattedUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-4">
      <Button
        onClick={handleBookingClick}
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-6 sm:py-4 text-base sm:text-sm rounded-xl"
      >
        <CalendarDays className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
        {isDemo ? 'Sign Up Now' : 'Book Consultation'}
      </Button>
      
      {!isDemo && (
        <Button
          onClick={onScanAgain}
          variant="outline"
          className="w-full py-6 sm:py-4 text-base sm:text-sm rounded-xl"
        >
          <ScanLine className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
          Scan Again
        </Button>
      )}
    </div>
  );
};