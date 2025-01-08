import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';

interface ScanAgainButtonProps {
  onScanAgain: () => void;
}

export const ScanAgainButton = ({ onScanAgain }: ScanAgainButtonProps) => {
  return (
    <Button
      onClick={onScanAgain}
      variant="outline"
      className="w-full py-6 sm:py-4 text-base sm:text-sm rounded-xl"
    >
      <ScanLine className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
      Scan Again
    </Button>
  );
};