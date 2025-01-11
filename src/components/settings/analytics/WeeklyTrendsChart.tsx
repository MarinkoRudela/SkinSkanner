import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartSkeleton } from "@/components/ui/skeletons/ContentSkeleton";

interface WeeklyTrendsChartProps {
  data: any[];
  isLoading: boolean;
}

export const WeeklyTrendsChart = ({ data, isLoading }: WeeklyTrendsChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <ChartSkeleton />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Weekly Trends</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="visit_date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
              className="text-muted-foreground"
            />
            <YAxis className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="daily_visits"
              name="Visits"
              stroke="#7E69AB"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="daily_completed_scans"
              name="Completed Scans"
              stroke="#6E59A5"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="daily_booking_clicks"
              name="Booking Clicks"
              stroke="#E5DEFF"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};