import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, Users, TrendingUp } from "lucide-react";

interface AnalyticsTabProps {
  session: any;
}

export const AnalyticsTab = ({ session }: AnalyticsTabProps) => {
  const { data: visitsData, isLoading: visitsLoading } = useQuery({
    queryKey: ['analytics', 'visits', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('link_analytics')
        .select('*')
        .eq('profile_id', session.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: conversionsData, isLoading: conversionsLoading } = useQuery({
    queryKey: ['analytics', 'conversions', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_conversions')
        .select('*')
        .eq('profile_id', session.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: scannerData, isLoading: scannerLoading } = useQuery({
    queryKey: ['analytics', 'scanner', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scanner_analytics')
        .select('*')
        .eq('profile_id', session.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const totalVisits = visitsData?.length || 0;
  const totalConversions = conversionsData?.length || 0;
  const totalScans = scannerData?.length || 0;
  const conversionRate = totalVisits ? ((totalConversions / totalVisits) * 100).toFixed(1) : '0';

  // Sample data for the chart - in production, this would be processed from real data
  const visitsByDay = [
    { name: 'Mon', visits: 4 },
    { name: 'Tue', visits: 3 },
    { name: 'Wed', visits: 7 },
    { name: 'Thu', visits: 5 },
    { name: 'Fri', visits: 6 },
    { name: 'Sat', visits: 8 },
    { name: 'Sun', visits: 9 },
  ];

  const chartConfig = {
    visits: {
      label: 'Visits',
      color: '#7E69AB'
    }
  };

  if (visitsLoading || conversionsLoading || scannerLoading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground">Unique link visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">From visits to bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
            <p className="text-xs text-muted-foreground">Completed skin analyses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitsByDay}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visits" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};