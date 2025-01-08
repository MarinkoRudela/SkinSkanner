import { Loader2 } from 'lucide-react';

export const AnalysisLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Analyzing your photos...</p>
    </div>
  );
};