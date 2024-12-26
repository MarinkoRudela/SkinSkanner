import { Button } from '@/components/ui/button';
import { CalendarDays, Share2 } from 'lucide-react';

interface ActionButtonsProps {
  bookingUrl: string;
  onShare: () => void;
}

export const ActionButtons = ({ bookingUrl, onShare }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-3 pt-4">
      <Button
        onClick={() => window.open(bookingUrl, '_blank')}
        className="w-full bg-medspa-600 hover:bg-medspa-700 text-white"
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        Book Consultation
      </Button>
      
      <Button
        onClick={onShare}
        variant="outline"
        className="w-full"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Analysis
      </Button>
    </div>
  );
};