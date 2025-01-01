import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Calendar, Share2 } from "lucide-react";

export const BookingUrlGuide = () => {
  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-medium">URL Guide</h3>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Globe className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-base">Business Websites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>www.yourbusiness.com</li>
              <li>https://www.yoursalon.com</li>
              <li>yourbusiness.net/book</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Calendar className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-base">Booking Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>calendly.com/your-business</li>
              <li>square.com/appointments</li>
              <li>acuity.com/schedule</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Share2 className="w-8 h-8 text-primary mb-2" />
            <CardTitle className="text-base">Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>instagram.com/your-business</li>
              <li>facebook.com/your-page</li>
              <li>linkedin.com/company/your-business</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};