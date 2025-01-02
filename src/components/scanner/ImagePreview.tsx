import React from 'react';
import { User } from 'lucide-react';

type ViewType = 'front' | 'left' | 'right';

interface ImagePreviewProps {
  view: ViewType;
  imageUrl?: string;
  isCurrentView: boolean;
}

export const ImagePreview = ({ view, imageUrl, isCurrentView }: ImagePreviewProps) => {
  const getRotationClass = () => {
    switch (view) {
      case 'left':
        return 'rotate-[-30deg]';
      case 'right':
        return 'rotate-[30deg]';
      default:
        return '';
    }
  };

  return (
    <div
      className={`aspect-square rounded-2xl border-2 ${
        imageUrl
          ? 'border-primary'
          : isCurrentView
          ? 'border-dashed border-primary/60'
          : 'border-muted'
      } flex flex-col items-center justify-center overflow-hidden bg-white/50 p-4`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${view} view`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <User 
            className={`w-12 h-12 text-muted-foreground/60 ${getRotationClass()}`}
          />
          <span className="text-sm text-muted-foreground text-center">
            {view} view
          </span>
        </div>
      )}
    </div>
  );
};