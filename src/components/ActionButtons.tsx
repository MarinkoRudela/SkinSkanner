import { Button } from '@/components/ui/button';
import { CalendarDays, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { formatUrl } from '@/utils/urlFormatter';
import { useState } from 'react';

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
  const [formattedUrl, setFormattedUrl] = useState('');

  const trackConversion = async (url: string) => {
    console.log('Tracking conversion for URL:', url);
    
    if (!profileId || !shortCode || !linkVisitId) {
      console.log('Missing required data for conversion tracking');
      return;
    }

    try {
      await supabase
        .from('booking_conversions')
        .insert([{
          link_visit_id: linkVisitId,
          profile_id: profileId,
          short_code: shortCode,
          booking_url_clicked: url
        }]);
      console.log('Conversion tracked successfully');
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  };

  const handleBookingClick = async () => {
    if (isDemo) {
      navigate('/signup');
      return;
    }

    const url = formatUrl(bookingUrl);
    console.log('Formatted booking URL:', url);
    setFormattedUrl(url);
    await trackConversion(url);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-4">
      {isDemo ? (
        <Button
          onClick={() => navigate('/signup')}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-6 sm:py-4 text-base sm:text-sm rounded-xl"
        >
          <CalendarDays className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
          Sign Up Now
        </Button>
      ) : (
        <a
          href={formattedUrl || formatUrl(bookingUrl)}
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
      )}
      
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