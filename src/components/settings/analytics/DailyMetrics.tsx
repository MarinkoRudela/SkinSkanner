import { Card } from "@/components/ui/card";
import { MetricCard } from "./MetricCard";
import { EmptyState } from "./EmptyState";
import { formatMetric } from "./utils";

interface DailyMetricsProps {
  todayData: {
    total_visits_today: number;
    total_scans_today: number;
    total_booking_clicks_today: number;
    peak_hour_today: number;
    avg_session_duration_today: number;
  } | null;
  isLoading: boolean;
}

export const DailyMetrics = ({ todayData, isLoading }: DailyMetricsProps) => {
  if (!todayData && !isLoading) {
    return (
      <EmptyState
        title="No metrics available"
        message="Start sharing your scanner link to see today's visitor metrics, including total visits, completed scans, and booking clicks."
        type="metrics"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Visits"
        value={formatMetric(todayData?.total_visits_today)}
        description="Unique visitors today"
        isLoading={isLoading}
      />
      <MetricCard
        title="Completed Scans"
        value={formatMetric(todayData?.total_scans_today)}
        description="Successful analyses today"
        isLoading={isLoading}
      />
      <MetricCard
        title="Booking Clicks"
        value={formatMetric(todayData?.total_booking_clicks_today)}
        description="Booking link clicks today"
        isLoading={isLoading}
      />
      <MetricCard
        title="Peak Hour"
        value={todayData?.peak_hour_today !== undefined ? `${todayData.peak_hour_today}:00` : '-'}
        description="Busiest hour of the day"
        isLoading={isLoading}
      />
    </div>
  );
};