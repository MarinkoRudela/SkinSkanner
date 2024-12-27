import { Header } from "./Header";
import { AuthForm } from "./auth/AuthForm";
import { BookingUrlForm } from "./settings/BookingUrlForm";
import { IntegrationGuide } from "./settings/IntegrationGuide";
import { ShareLinks } from "./settings/ShareLinks";

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
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Business Configuration</h2>
      <div className="space-y-6">
        <BookingUrlForm 
          initialUrl={bookingUrl} 
          onSave={updateBookingUrl} 
        />
        <IntegrationGuide />
        <ShareLinks userId={session.user.id} />
      </div>
    </div>
  );
};