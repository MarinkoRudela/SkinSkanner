import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { WeeklyAnalytics } from "@/integrations/supabase/types";

interface WeeklyTrendsChartProps {
  data: WeeklyAnalytics[];
}

export const WeeklyTrendsChart = ({ data }: WeeklyTrendsChartProps) => {
  const chartConfig = {
    visits: {
      color: "#7E69AB"
    },
    scans: {
      color: "#9F85D1"
    },
    bookings: {
      color: "#BBA3E8"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.reverse() || []}>
                <XAxis 
                  dataKey="visit_date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  name="Visits" 
                  dataKey="daily_visits" 
                  fill={chartConfig.visits.color}
                />
                <Bar 
                  name="Scans" 
                  dataKey="daily_completed_scans" 
                  fill={chartConfig.scans.color}
                />
                <Bar 
                  name="Bookings" 
                  dataKey="daily_booking_clicks" 
                  fill={chartConfig.bookings.color}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};