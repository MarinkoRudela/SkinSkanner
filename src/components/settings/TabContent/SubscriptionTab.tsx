import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubscriptionSettings } from "../SubscriptionSettings";

export const SubscriptionTab = () => {
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