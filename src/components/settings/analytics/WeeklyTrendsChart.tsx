import { FC, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Tables } from '@/integrations/supabase/types/database';
import { Skeleton } from '@/components/ui/skeleton';

export interface WeeklyTrendsChartProps {
  data: Tables<'weekly_analytics'>[];
  isLoading: boolean;
}

export const WeeklyTrendsChart: FC<WeeklyTrendsChartProps> = memo(({ data, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />;
  }

  const chartData = data.map(item => ({
    date: format(new Date(item.visit_date), 'MMM d'),
    visits: Number(item.daily_visits) || 0,
    scans: Number(item.daily_completed_scans) || 0,
    bookings: Number(item.daily_booking_clicks) || 0,
  }));

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="visits" stroke="#8884d8" name="Visits" />
          <Line type="monotone" dataKey="scans" stroke="#82ca9d" name="Completed Scans" />
          <Line type="monotone" dataKey="bookings" stroke="#ffc658" name="Booking Clicks" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

WeeklyTrendsChart.displayName = 'WeeklyTrendsChart';