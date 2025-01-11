import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
import { logMetric } from './logMetric';

export const initializeWebVitals = () => {
  const path = window.location.pathname;

  onFCP(metric => {
    logMetric({
      name: 'FCP',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onLCP(metric => {
    logMetric({
      name: 'LCP',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onCLS(metric => {
    logMetric({
      name: 'CLS',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onFID(metric => {
    logMetric({
      name: 'FID',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onTTFB(metric => {
    logMetric({
      name: 'TTFB',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });
};