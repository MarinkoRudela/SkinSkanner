import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types/helpers";
import { formatHour } from "./utils";

type WeeklyAnalyticsData = Tables<'weekly_analytics'>;

interface WeeklyTrendsChartProps {
  data: WeeklyAnalyticsData[];
  isLoading: boolean;
}

export const WeeklyTrendsChart = ({ data, isLoading }: WeeklyTrendsChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  const chartConfig = {
    width: "100%",
    height: 400,
    margin: { top: 20, right: 30, left: 0, bottom: 0 },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Trends</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={chartConfig.margin}>
            <XAxis 
              dataKey="visit_date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value: number) => [value, '']}
            />
            <Line
              type="monotone"
              dataKey="daily_visits"
              name="Visits"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="daily_completed_scans"
              name="Completed Scans"
              stroke="#82ca9d"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="daily_booking_clicks"
              name="Booking Clicks"
              stroke="#ffc658"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};