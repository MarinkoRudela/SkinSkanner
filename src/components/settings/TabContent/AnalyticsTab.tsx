import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar, Users, TrendingUp, Clock } from "lucide-react";
import { MetricCard } from "../analytics/MetricCard";
import { WeeklyTrendsChart } from "../analytics/WeeklyTrendsChart";
import { formatHour, formatDuration } from "../analytics/utils";

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
      return data;
    },
  });

  if (todayLoading || weeklyLoading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  const metrics = [
    {
      title: "Total Visits Today",
      value: todayData?.total_visits_today || 0,
      description: "Unique scanner visits",
      icon: Users
    },
    {
      title: "Scans Today",
      value: todayData?.total_scans_today || 0,
      description: "Completed skin analyses",
      icon: ChartBar
    },
    {
      title: "Booking Clicks Today",
      value: todayData?.total_booking_clicks_today || 0,
      description: "Consultation bookings",
      icon: TrendingUp
    },
    {
      title: "Peak Hour",
      value: todayData?.peak_hour_today !== undefined ? formatHour(todayData.peak_hour_today) : '-',
      description: `Avg duration: ${formatDuration(todayData?.avg_session_duration_today || 0)}`,
      icon: Clock
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      <WeeklyTrendsChart data={weeklyData || []} />
    </div>
  );
};