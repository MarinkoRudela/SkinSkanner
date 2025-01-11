import { DailyMetrics } from "../analytics/DailyMetrics";
import { WeeklyTrendsChart } from "../analytics/WeeklyTrendsChart";
import { useAnalyticsData } from "../analytics/useAnalyticsData";

export const AnalyticsTab = ({ session }: { session: any }) => {
  const {
    todayData,
    weeklyData,
    todayLoading,
    weeklyLoading,
  } = useAnalyticsData(session);

  return (
    <div className="space-y-8">
      <DailyMetrics todayData={todayData} isLoading={todayLoading} />
      <WeeklyTrendsChart data={weeklyData || []} isLoading={weeklyLoading} />
    </div>
  );
};