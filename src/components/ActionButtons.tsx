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
  const isDemo = bookingUrl === '/signup';

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-sm mx-auto pt-4">
      {isDemo ? (
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