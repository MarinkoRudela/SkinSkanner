import React from 'react';
import { Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScanButtonProps {
  onClick: () => void;
}

export const ScanButton = ({ onClick }: ScanButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="bg-primary hover:bg-primary-hover text-white rounded-full px-6 py-5 md:px-8 md:py-6 h-auto w-full max-w-sm text-sm md:text-base"
    >
      <Scan className="mr-2 h-4 w-4 md:h-5 md:w-5" />
      Scan Images
    </Button>
  );
};