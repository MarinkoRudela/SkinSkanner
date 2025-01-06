import { Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const Support = () => {
  const email = "info@skinskanner.ai";

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-lg">
            <Mail className="h-4 w-4 mr-2" />
            Support
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Need Help?</SheetTitle>
            <SheetDescription className="space-y-4 pt-4">
              <p>
                We're here to help! Reach out to our support team at:
              </p>
              <Button
                variant="link"
                className="text-primary text-lg font-semibold"
                onClick={handleEmailClick}
              >
                {email}
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Our team typically responds within 24 hours during business days.
              </p>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};