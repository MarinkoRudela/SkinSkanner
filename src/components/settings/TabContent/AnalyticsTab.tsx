import { useEffect } from "react";
import { DailyMetrics } from "../analytics/DailyMetrics";
import { WeeklyTrendsChart } from "../analytics/WeeklyTrendsChart";
import { useAnalyticsData } from "../analytics/useAnalyticsData";

export const AnalyticsTab = ({ session }: { session: any }) => {
  const {
    todayData,
    weeklyData,
    todayLoading,
    weeklyLoading,
    refetchToday,
    refetchWeekly
  } = useAnalyticsData(session);

  // Refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetchToday();
      refetchWeekly();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refetchToday, refetchWeekly]);

  return (
    <div className="space-y-8">
      <DailyMetrics todayData={todayData} isLoading={todayLoading} />
      <WeeklyTrendsChart data={weeklyData || []} isLoading={weeklyLoading} />
    </div>
  );
};