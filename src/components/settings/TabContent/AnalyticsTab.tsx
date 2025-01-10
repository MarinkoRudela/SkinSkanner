import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, Users, TrendingUp, Clock } from "lucide-react";

interface AnalyticsTabProps {
  session: any;
}

interface TodayAnalytics {
  total_visits_today: number;
  total_scans_today: number;
  total_booking_clicks_today: number;
  peak_hour_today: number;
  avg_session_duration_today: number;
}

interface WeeklyAnalytics {
  visit_date: string;
  daily_visits: number;
  daily_completed_scans: number;
  daily_booking_clicks: number;
  avg_session_duration: number;
}

export const AnalyticsTab = ({ session }: AnalyticsTabProps) => {
  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ['analytics', 'today', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_todays_analytics', {
          profile_id_param: session.user.id
        });
      
      if (error) throw error;
      return data as TodayAnalytics;
    },
  });

  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: ['analytics', 'weekly', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_analytics')
        .select('*')
        .eq('profile_id', session.user.id)
        .order('visit_date', { ascending: false })
        .limit(7);
      
      if (error) throw error;
      return data as WeeklyAnalytics[];
    },
  });

  if (todayLoading || weeklyLoading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  const formatHour = (hour: number) => {
    return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m` : `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayData?.total_visits_today || 0}</div>
            <p className="text-xs text-muted-foreground">Unique scanner visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans Today</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayData?.total_scans_today || 0}</div>
            <p className="text-xs text-muted-foreground">Completed skin analyses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Clicks Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayData?.total_booking_clicks_today || 0}</div>
            <p className="text-xs text-muted-foreground">Consultation bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayData?.peak_hour_today !== undefined ? formatHour(todayData.peak_hour_today) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg duration: {formatDuration(todayData?.avg_session_duration_today || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData?.reverse() || []}>
                  <XAxis 
                    dataKey="visit_date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar 
                    name="Visits" 
                    dataKey="daily_visits" 
                    fill="#7E69AB" 
                  />
                  <Bar 
                    name="Scans" 
                    dataKey="daily_completed_scans" 
                    fill="#9F85D1" 
                  />
                  <Bar 
                    name="Bookings" 
                    dataKey="daily_booking_clicks" 
                    fill="#BBA3E8" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};