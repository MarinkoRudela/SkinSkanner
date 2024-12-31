import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubscriptionSettings } from "../SubscriptionSettings";

interface SubscriptionTabProps {
  session: any;
}

export const SubscriptionTab = ({ session }: SubscriptionTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your subscription settings and billing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SubscriptionSettings />
      </CardContent>
    </Card>
  );
};