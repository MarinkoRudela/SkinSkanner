export type MetricType = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'API';

export interface PerformanceMetric {
  name: MetricType;
  value: number;
  path: string;
  timestamp: string;
}