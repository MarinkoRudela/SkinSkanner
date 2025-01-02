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
            d="M65,20 C65,15 60,10 50,10 C40,10 35,15 35,20 
               L35,45 C35,48 36,50 37,52
               L37,65 C37,70 38,72 40,74
               L42,78 C44,82 47,85 50,85
               C53,85 56,82 58,78
               L60,74 C62,72 63,70 63,65
               L63,52 C64,50 65,48 65,45 Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M45,40 C45,38 47,37 50,37"
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
            d="M35,20 C35,15 40,10 50,10 C60,10 65,15 65,20 
               L65,45 C65,48 64,50 63,52
               L63,65 C63,70 62,72 60,74
               L58,78 C56,82 53,85 50,85
               C47,85 44,82 42,78
               L40,74 C38,72 37,70 37,65
               L37,52 C36,50 35,48 35,45 Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M50,37 C53,37 55,38 55,40"
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
            d="M30,45 C30,25 35,15 50,15
               C65,15 70,25 70,45
               C70,65 65,70 60,75
               L60,80 C60,85 55,90 50,90
               C45,90 40,85 40,80
               L40,75 C35,70 30,65 30,45 Z"
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
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M45,60 Q50,65 55,60"
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