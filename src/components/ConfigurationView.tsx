import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "./Header";

interface ConfigurationViewProps {
  session: any;
  bookingUrl: string;
  updateBookingUrl: (url: string) => Promise<void>;
}

export const ConfigurationView = ({
  session,
  bookingUrl,
  updateBookingUrl,
}: ConfigurationViewProps) => {
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
        <div className="container max-w-md mx-auto px-4 py-8">
          <Header />
          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Business Owner Login</h2>
            <Auth 
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Business Configuration</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Booking URL
          </label>
          <input
            type="url"
            id="bookingUrl"
            className="w-full p-2 border rounded"
            value={bookingUrl}
            onChange={(e) => updateBookingUrl(e.target.value)}
            placeholder="Enter your booking platform URL"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter the URL where clients can book appointments (e.g., your Calendly or Acuity link)
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Integration Guide</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">To embed this application on your website:</p>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                {`<iframe
  src="${window.location.origin}"
  width="100%"
  height="800px"
  frameborder="0"
></iframe>`}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Share on Social Media</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Your unique link to share:</p>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                {`${window.location.origin}?business=${session.user.id}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};