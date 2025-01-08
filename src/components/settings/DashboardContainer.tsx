import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface DashboardContainerProps {
  session: any;
  brandName: string | null;
  children: React.ReactNode;
}

export const DashboardContainer = ({ session, brandName, children }: DashboardContainerProps) => {
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto p-4 md:p-6 pt-16">
        <Navigation session={session} />
        
        {!brandName && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please set up your brand name in the Branding tab to activate your scanner.
            </AlertDescription>
          </Alert>
        )}

        {children}
      </div>
    </div>
  );
};