import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SubscriptionSettings = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  const { data: subscription, refetch } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/functions/v1/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel subscription');
      }

      await refetch();
      
      toast({
        title: "Success",
        description: "Your subscription has been cancelled",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReactivateSubscription = () => {
    window.location.href = '/signup';
  };

  // If no subscription data exists, show a different message
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You currently don't have any active subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="default"
            onClick={() => window.location.href = '/signup'}
          >
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your subscription settings and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                {subscription?.plan_type}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Status: {subscription?.status}
              </p>
              {subscription?.current_period_end && subscription.status === 'active' && (
                <p className="text-sm text-muted-foreground">
                  Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {subscription?.status === 'unpaid' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription payment has failed. Please update your payment method to continue using our services.
            </AlertDescription>
          </Alert>
        )}
        
        {subscription?.status === 'active' && (
          <Button
            variant="destructive"
            onClick={handleCancelSubscription}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        )}

        {(subscription?.status === 'cancelled' || subscription?.status === 'unpaid') && (
          <Button
            variant="default"
            onClick={handleReactivateSubscription}
            disabled={isReactivating}
          >
            Reactivate Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
};