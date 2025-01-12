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

      // Ensure we return the first item if it's an array, or the data itself if it's an object
      return (Array.isArray(data) ? data[0] : data) as DailyAnalytics;
    },
    enabled: !!session?.user?.id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

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
        .select('*')  // Select all fields to match the Tables type
        .eq('profile_id', session?.user?.id)
        .order('visit_date', { ascending: true })
        .limit(7);  // Removed maybeSingle() since we want an array

      if (error) {
        console.error('Error fetching weekly analytics:', error);
        throw error;
      }

      // Ensure we always return an array
      return (data || []) as Tables<'weekly_analytics'>[];
    },
    enabled: !!session?.user?.id,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
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