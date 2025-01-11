import { Users, ScanLine, MousePointerClick } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { memo } from "react";

interface DailyAnalytics {
  total_visits_today: number;
  total_scans_today: number;
  total_booking_clicks_today: number;
  peak_hour_today: number;
  avg_session_duration_today: number;
}

interface DailyMetricsProps {
  todayData: DailyAnalytics | undefined;
  isLoading: boolean;
}

export const DailyMetrics = memo(({ todayData, isLoading }: DailyMetricsProps) => {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
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
  );
});

DailyMetrics.displayName = 'DailyMetrics';