import React from 'react';
import { DemoButton } from './buttons/DemoButton';
import { BookingButton } from './buttons/BookingButton';
import { ScanAgainButton } from './buttons/ScanAgainButton';

interface ActionButtonsProps {
  bookingUrl: string;
  onScanAgain: () => void;
  profileId?: string;
  shortCode?: string;
  linkVisitId?: string;
}

export const ActionButtons = React.memo(({ 
  bookingUrl, 
  onScanAgain, 
  profileId,
  shortCode,
  linkVisitId 
}: ActionButtonsProps) => {
  // Only show demo button if we're on the demo page
  const isDemoPage = window.location.pathname === '/demo';
  
  console.log('ActionButtons - isDemoPage:', isDemoPage);
  console.log('ActionButtons - bookingUrl:', bookingUrl);
  console.log('ActionButtons - profileId:', profileId);
  console.log('ActionButtons - shortCode:', shortCode);
  console.log('ActionButtons - linkVisitId:', linkVisitId);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-4">
      {isDemoPage ? (
        <DemoButton />
      ) : (
        <>
          <BookingButton
            bookingUrl={bookingUrl}
            profileId={profileId}
            shortCode={shortCode}
            linkVisitId={linkVisitId}
          />
          <ScanAgainButton onScanAgain={onScanAgain} />
        </>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.bookingUrl === nextProps.bookingUrl &&
    prevProps.profileId === nextProps.profileId &&
    prevProps.shortCode === nextProps.shortCode &&
    prevProps.linkVisitId === nextProps.linkVisitId
  );
});