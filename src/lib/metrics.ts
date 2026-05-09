/**
 * Performance monitoring and metrics utilities
 */

/**
 * Performance timer class
 */
export class PerformanceTimer {
  private startTime: number;
  private marks: Map<string, number> = new Map();

  constructor() {
    this.startTime = performance.now();
  }

  /**
   * Mark a point in time
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Measure time between marks
   */
  measure(startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (!start || !end) {
      return -1;
    }

    return end - start;
  }

  /**
   * Get elapsed time since timer start
   */
  elapsed(): number {
    return performance.now() - this.startTime;
  }

  /**
   * Get all marks
   */
  getMarks(): Record<string, number> {
    const result: Record<string, number> = {};
    this.marks.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Clear all marks
   */
  clear(): void {
    this.marks.clear();
  }
}

/**
 * Metrics collector
 */
export class MetricsCollector {
  private metrics: Map<string, number[]> = new Map();

  /**
   * Record a metric value
   */
  record(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  /**
   * Get average for metric
   */
  getAverage(name: string): number {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get min value for metric
   */
  getMin(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.length > 0 ? Math.min(...values) : 0;
  }

  /**
   * Get max value for metric
   */
  getMax(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.length > 0 ? Math.max(...values) : 0;
  }

  /**
   * Get summary for metric
   */
  getSummary(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
  } {
    const values = this.metrics.get(name) || [];
    return {
      count: values.length,
      average: this.getAverage(name),
      min: this.getMin(name),
      max: this.getMax(name),
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

// Global metrics instance
export const globalMetrics = new MetricsCollector();
