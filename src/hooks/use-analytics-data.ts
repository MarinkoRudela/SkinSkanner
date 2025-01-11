import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types/database";

interface DailyAnalytics {
  total_visits_today: number;
  total_scans_today: number;
  total_booking_clicks_today: number;
  peak_hour_today: number;
  avg_session_duration_today: number;
}

export const useAnalyticsData = (session: any) => {
  // Today's analytics query
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
    staleTime: 2 * 60 * 1000, // Data considered fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
    retry: 3,
  });

  // Weekly analytics query with optimized select
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
        .select('visit_date, daily_visits, daily_completed_scans, daily_booking_clicks')
        .eq('profile_id', session?.user?.id)
        .order('visit_date', { ascending: true })
        .limit(7)
        .maybeSingle();

      if (error) {
        console.error('Error fetching weekly analytics:', error);
        throw error;
      }

      return data as Tables<'weekly_analytics'>[];
    },
    enabled: !!session?.user?.id,
    staleTime: 15 * 60 * 1000, // Data considered fresh for 15 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return {
    todayData,
    weeklyData,
    todayLoading,
    weeklyLoading,
    refetchToday,
    refetchWeekly
  };
};