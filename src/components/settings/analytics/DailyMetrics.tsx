import { Users, Activity, MousePointerClick, Clock } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { MetricsSkeleton } from "@/components/ui/skeletons/ContentSkeleton";

interface DailyMetricsProps {
  todayData: any;
  isLoading: boolean;
}

export const DailyMetrics = ({ todayData, isLoading }: DailyMetricsProps) => {
  if (isLoading) {
    return <MetricsSkeleton />;
  }

  const metrics = [
    {
      title: "Total Visits",
      value: todayData?.total_visits_today || 0,
      description: "Unique visitors today",
      icon: Users
    },
    {
      title: "Completed Scans",
      value: todayData?.total_scans_today || 0,
      description: "Successful analyses today",
      icon: Activity
    },
    {
      title: "Booking Clicks",
      value: todayData?.total_booking_clicks_today || 0,
      description: "Booking link clicks today",
      icon: MousePointerClick
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
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
};