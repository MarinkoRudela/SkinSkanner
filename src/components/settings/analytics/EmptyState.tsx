import { AlertCircle, ChartLine } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  message: string;
  type?: 'chart' | 'metrics';
}

export const EmptyState = ({ title, message, type = 'chart' }: EmptyStateProps) => {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
      {type === 'chart' ? (
        <ChartLine className="h-12 w-12 text-muted-foreground/50" />
      ) : (
        <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-sm">{message}</p>
      </div>
    </Card>
  );
};