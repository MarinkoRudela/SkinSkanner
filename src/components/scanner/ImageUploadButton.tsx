import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadButtonProps {
  currentView: string;
  onClick: () => void;
}

export const ImageUploadButton = ({ currentView, onClick }: ImageUploadButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 h-auto"
    >
      <Upload className="mr-2 h-5 w-5" />
      Upload {currentView} view
    </Button>
  );
};