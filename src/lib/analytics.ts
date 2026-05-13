/**
 * Analytics and event tracking utilities
 */

export interface AnalyticsEvent {
  name: string;
  userId?: string;
  timestamp: Date;
  properties?: Record<string, unknown>;
  sessionId?: string;
}

export interface PageViewEvent extends AnalyticsEvent {
  url: string;
  referrer?: string;
  title?: string;
}

export interface UserAction {
  action: string;
  target: string;
  value?: unknown;
  duration?: number;
}

/**
 * Event tracker
 */
export class EventTracker {
  private events: AnalyticsEvent[] = [];
  private maxEvents: number = 1000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Track event
   */
  trackEvent(event: Omit<AnalyticsEvent, "timestamp" | "sessionId">): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };

    this.events.push(fullEvent);

    // Remove oldest events if exceeds max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  /**
   * Track page view
   */
  trackPageView(url: string, title?: string, referrer?: string): void {
    this.trackEvent({
      name: "page_view",
      properties: { url, title, referrer },
    });
  }

  /**
   * Track user action
   */
  trackUserAction(
    userId: string,
    action: string,
    target: string,
    value?: unknown,
    duration?: number
  ): void {
    this.trackEvent({
      name: "user_action",
      userId,
      properties: { action, target, value, duration },
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, unknown>): void {
    this.trackEvent({
      name: "error",
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number): void {
    this.trackEvent({
      name: "performance",
      properties: { metric, value },
    });
  }

  /**
   * Get all events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Get events by name
   */
  getEventsByName(name: string): AnalyticsEvent[] {
    return this.events.filter((event) => event.name === name);
  }

  /**
   * Get events by user
   */
  getEventsByUser(userId: string): AnalyticsEvent[] {
    return this.events.filter((event) => event.userId === userId);
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Clear events
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Export events as JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

/**
 * Analytics aggregator
 */
export class AnalyticsAggregator {
  /**
   * Calculate event frequency
   */
  static getEventFrequency(events: AnalyticsEvent[]): Record<string, number> {
    const frequency: Record<string, number> = {};

    for (const event of events) {
      frequency[event.name] = (frequency[event.name] || 0) + 1;
    }

    return frequency;
  }

  /**
   * Get unique users
   */
  static getUniqueUsers(events: AnalyticsEvent[]): Set<string> {
    return new Set(events.filter((e) => e.userId).map((e) => e.userId!));
  }

  /**
   * Calculate event rate (events per minute)
   */
  static getEventRate(events: AnalyticsEvent[]): number {
    if (events.length < 2) return 0;

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const durationMs = lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime();
    const durationMinutes = durationMs / (1000 * 60);

    return events.length / durationMinutes;
  }

  /**
   * Get events in time range
   */
  static getEventsInRange(
    events: AnalyticsEvent[],
    startTime: Date,
    endTime: Date
  ): AnalyticsEvent[] {
    return events.filter(
      (event) => event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  /**
   * Group events by time period
   */
  static groupEventsByHour(events: AnalyticsEvent[]): Map<string, AnalyticsEvent[]> {
    const groups = new Map<string, AnalyticsEvent[]>();

    for (const event of events) {
      const hour = event.timestamp.toISOString().slice(0, 13);
      if (!groups.has(hour)) {
        groups.set(hour, []);
      }
      groups.get(hour)!.push(event);
    }

    return groups;
  }

  /**
   * Calculate average time between events
   */
  static getAverageTimeBetweenEvents(events: AnalyticsEvent[]): number {
    if (events.length < 2) return 0;

    let totalTime = 0;
    for (let i = 1; i < events.length; i++) {
      totalTime +=
        events[i].timestamp.getTime() - events[i - 1].timestamp.getTime();
    }

    return totalTime / (events.length - 1);
  }
}

/**
 * Conversion funnel tracker
 */
export class ConversionFunnel {
  private name: string;
  private steps: Array<{ name: string; count: number }> = [];

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Add step to funnel
   */
  addStep(stepName: string): void {
    const existing = this.steps.find((s) => s.name === stepName);
    if (existing) {
      existing.count++;
    } else {
      this.steps.push({ name: stepName, count: 1 });
    }
  }

  /**
   * Get conversion rate between steps
   */
  getConversionRate(fromStep: number, toStep: number): number {
    if (fromStep < 0 || toStep >= this.steps.length || fromStep >= toStep) {
      return 0;
    }

    const fromCount = this.steps[fromStep].count;
    const toCount = this.steps[toStep].count;

    return fromCount > 0 ? (toCount / fromCount) * 100 : 0;
  }

  /**
   * Get funnel summary
   */
  getSummary() {
    return {
      name: this.name,
      steps: this.steps,
      totalEntered: this.steps[0]?.count || 0,
      totalConverted: this.steps[this.steps.length - 1]?.count || 0,
      overallConversionRate:
        this.steps.length > 1 && this.steps[0].count > 0
          ? (this.steps[this.steps.length - 1].count / this.steps[0].count) * 100
          : 0,
    };
  }

  /**
   * Reset funnel
   */
  reset(): void {
    this.steps = [];
  }
}

/**
 * Global event tracker
 */
export const globalEventTracker = new EventTracker();
