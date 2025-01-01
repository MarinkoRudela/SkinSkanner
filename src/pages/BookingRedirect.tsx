import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/LoadingScreen";

const BookingRedirect = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToBooking = async () => {
      try {
        // First get the profile_id from the short code
        const { data: shortCodeData, error: shortCodeError } = await supabase
          .from('business_short_codes')
          .select('profile_id')
          .eq('short_code', shortCode)
          .single();

        if (shortCodeError || !shortCodeData) {
          setError('Invalid booking link');
          return;
        }

        // Then get the booking URL for this profile
        const { data: settingsData, error: settingsError } = await supabase
          .from('business_settings')
          .select('booking_url')
          .eq('profile_id', shortCodeData.profile_id)
          .single();

        if (settingsError || !settingsData?.booking_url) {
          setError('Booking URL not found');
          return;
        }

        // Redirect to the booking URL
        window.location.href = settingsData.booking_url;
      } catch (err) {
        console.error('Error redirecting to booking:', err);
        setError('Something went wrong');
      }
    };

    redirectToBooking();
  }, [shortCode, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-medspa-50 to-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-medspa-600 text-white rounded-md hover:bg-medspa-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <LoadingScreen />;
};

export default BookingRedirect;