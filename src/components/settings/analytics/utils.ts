export const formatHour = (hour: number): string => {
  return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
};

export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0s';
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m` : `${seconds}s`;
};

export const formatMetric = (value: number | undefined): string => {
  if (value === undefined) return '-';
  return value.toString();
};