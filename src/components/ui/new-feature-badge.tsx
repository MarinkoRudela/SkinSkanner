import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewFeatureBadgeProps {
  className?: string;
}

export const NewFeatureBadge = ({ className }: NewFeatureBadgeProps) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full animate-pulse",
        className
      )}
    >
      <Star className="w-3 h-3" />
      New
    </span>
  );
};