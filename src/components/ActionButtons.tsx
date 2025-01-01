import { Button } from '@/components/ui/button';
import { CalendarDays, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  bookingUrl: string;
  onScanAgain: () => void;
}

export const ActionButtons = ({ bookingUrl, onScanAgain }: ActionButtonsProps) => {
  const navigate = useNavigate();
  const isDemo = bookingUrl === '/signup';

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-4">
      <Button
        onClick={() => isDemo ? navigate('/signup') : window.open(bookingUrl, '_blank')}
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