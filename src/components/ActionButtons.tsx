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

export const ActionButtons = ({ 
  bookingUrl, 
  onScanAgain, 
  profileId,
  shortCode,
  linkVisitId 
}: ActionButtonsProps) => {
  // Only show demo button if we're on the demo page
  const isDemoPage = window.location.pathname === '/demo';

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
};