import React from 'react';

type ViewType = 'front' | 'left' | 'right';

interface ImagePreviewProps {
  view: ViewType;
  imageUrl?: string;
  isCurrentView: boolean;
}

const HeadOutline = ({ view }: { view: ViewType }) => {
  switch (view) {
    case 'left':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-muted-foreground/60">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M60,20 Q60,10 50,10 Q40,10 40,20 L40,50 Q45,55 45,60 L45,75 Q45,80 50,80 Q55,80 55,75 L55,60 Q55,55 60,50 L60,20"
          />
        </svg>
      );
    case 'right':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-muted-foreground/60">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M40,20 Q40,10 50,10 Q60,10 60,20 L60,50 Q55,55 55,60 L55,75 Q55,80 50,80 Q45,80 45,75 L45,60 Q45,55 40,50 L40,20"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-muted-foreground/60">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M30,40 Q30,20 50,20 Q70,20 70,40 Q70,60 60,70 L60,80 Q60,85 50,85 Q40,85 40,80 L40,70 Q30,60 30,40"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M40,45 Q40,42 45,42 Q50,42 50,45"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M50,45 Q50,42 55,42 Q60,42 60,45"
          />
        </svg>
      );
  }
};

export const ImagePreview = ({ view, imageUrl, isCurrentView }: ImagePreviewProps) => {
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
          <HeadOutline view={view} />
          <span className="text-sm text-muted-foreground text-center">
            {view} view
          </span>
        </div>
      )}
    </div>
  );
};