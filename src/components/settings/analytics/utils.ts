/**
 * Formats a metric value for display
 * @param value The metric value to format
 * @returns Formatted string representation of the metric
 */
export const formatMetric = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  
  return value.toString();
};