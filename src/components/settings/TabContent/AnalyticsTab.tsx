import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "../analytics/MetricCard";
import { WeeklyTrendsChart } from "../analytics/WeeklyTrendsChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types/database";
import { Users, ScanLine, MousePointerClick } from "lucide-react";

interface DailyAnalytics {
  total_visits_today: number;
  total_scans_today: number;
  total_booking_clicks_today: number;
  peak_hour_today: number;
  avg_session_duration_today: number;
}

export const AnalyticsTab = ({ session }: { session: any }) => {
  // Fetch today's analytics
  const { 
    data: todayData,
    isLoading: todayLoading,
    refetch: refetchToday
  } = useQuery({
    queryKey: ['todayAnalytics', session?.user?.id],
    queryFn: async () => {
      console.log('Fetching today analytics for user:', session?.user?.id);
      const { data, error } = await supabase
        .rpc('get_todays_analytics', {
          profile_id_param: session?.user?.id
        });

      if (error) {
        console.error('Error fetching today analytics:', error);
        throw error;
      }

      return data as DailyAnalytics;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch weekly analytics
  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    refetch: refetchWeekly
  } = useQuery({
    queryKey: ['weeklyAnalytics', session?.user?.id],
    queryFn: async () => {
      console.log('Fetching weekly analytics for user:', session?.user?.id);
      const { data, error } = await supabase
        .from('weekly_analytics')
        .select('*')
        .eq('profile_id', session?.user?.id)
        .order('visit_date', { ascending: true })
        .limit(7);

      if (error) {
        console.error('Error fetching weekly analytics:', error);
        throw error;
      }

      return data as Tables<'weekly_analytics'>[];
    },
    enabled: !!session?.user?.id,
  });

  // Refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetchToday();
      refetchWeekly();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refetchToday, refetchWeekly]);

  if (todayLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Visits Today",
      value: todayData?.total_visits_today || 0,
      description: "Number of unique visitors today",
      icon: Users
    },
    {
      title: "Completed Scans Today",
      value: todayData?.total_scans_today || 0,
      description: "Number of completed skin analyses",
      icon: ScanLine
    },
    {
      title: "Booking Clicks Today",
      value: todayData?.total_booking_clicks_today || 0,
      description: "Number of booking link clicks",
      icon: MousePointerClick
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
          />
        ))}
      </div>
      
      <WeeklyTrendsChart data={weeklyData || []} isLoading={weeklyLoading} />
    </div>
  );
};