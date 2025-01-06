import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info, AlertTriangle, FileText, Settings, Link, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const GuideTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting Started Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Configuration */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuration
          </h3>
          <div className="ml-7 space-y-3">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-1 text-green-500" />
              <div>
                <p>Set your business name and branding</p>
                <p className="text-sm text-muted-foreground">Navigate to the Branding tab to customize your appearance</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-1 text-green-500" />
              <div>
                <p>Upload your business logo</p>
                <p className="text-sm text-muted-foreground">Recommended size: 200x200px, PNG or JPG format</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-1 text-green-500" />
              <div>
                <p>Add your business tagline</p>
                <p className="text-sm text-muted-foreground">A brief description that appears under your logo</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-1 text-green-500" />
              <div>
                <p>Set up your booking URL</p>
                <p className="text-sm text-muted-foreground">Examples: calendly.com/your-business, square.com/book/your-business</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Integration
          </h3>
          <div className="ml-7 space-y-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-1 text-primary" />
              <div>
                <p>Your unique scanner URL</p>
                <p className="text-sm text-muted-foreground">Find this in the Booking Settings tab</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-1 text-primary" />
              <div>
                <p>Share your scanner</p>
                <ul className="list-disc ml-4 text-sm text-muted-foreground">
                  <li>Add to your website using the provided iframe code</li>
                  <li>Share directly on social media</li>
                  <li>Include in email signatures</li>
                  <li>Add to marketing materials</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Best Practices
          </h3>
          <div className="ml-7 space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Always test your scanner after setup by:
                <ul className="list-disc ml-4 mt-2">
                  <li>Visiting your unique URL</li>
                  <li>Completing a test scan</li>
                  <li>Verifying the booking link works</li>
                  <li>Checking your branding appears correctly</li>
                </ul>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="font-medium">Tips for Success:</p>
              <ul className="list-disc ml-4 space-y-1 text-sm text-muted-foreground">
                <li>Keep your logo clear and professional</li>
                <li>Use a concise, engaging tagline</li>
                <li>Regularly verify your booking URL is working</li>
                <li>Share your scanner link across all marketing channels</li>
                <li>Consider adding the scanner to your email signature</li>
              </ul>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};