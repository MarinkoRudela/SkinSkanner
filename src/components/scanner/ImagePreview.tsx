import React from 'react';

type ViewType = 'front' | 'left' | 'right';

interface ImagePreviewProps {
  view: ViewType;
  imageUrl?: string;
  isCurrentView: boolean;
}

export const ImagePreview = ({ view, imageUrl, isCurrentView }: ImagePreviewProps) => {
  return (
    <div
      className={`aspect-square rounded-2xl border-2 ${
        imageUrl
          ? 'border-primary'
          : isCurrentView
          ? 'border-dashed border-primary/60'
          : 'border-muted'
      } flex items-center justify-center overflow-hidden bg-white/50`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${view} view`}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm text-muted-foreground text-center p-2">
          {view === 'front' ? 'front pic' : view === 'left' ? 'left side pic' : 'right side pic'}
        </span>
      )}
    </div>
  );
};