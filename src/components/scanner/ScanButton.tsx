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
      className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 h-auto w-full max-w-sm"
    >
      <Scan className="mr-2 h-5 w-5" />
      Scan Images
    </Button>
  );
};