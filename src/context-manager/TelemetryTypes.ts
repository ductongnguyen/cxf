import { TaskIntent } from './IntentAnalyzer';

export interface ContextBudgetBreakdown {
  rules: number;
  knowledge: number;
  memory: number;
  runtime: number;
  reserve: number;
  total: number;
}

export interface TelemetryEvent {
  eventId: string;
  timestamp: string;
  taskId: string;
  intent: TaskIntent;
  budgetBreakdown: ContextBudgetBreakdown;
  selectedFiles: string[];
  totalTokens: number;
  roiScore: number;
  noiseRatio: number;      // 0.0 (pure) to 1.0 (all noise)
  stabilityIndex: number;  // 0.0 to 1.0 (Jaccard similarity index)
}

export interface ContextMetricsResponse {
  latestEvent?: TelemetryEvent;
  totalEventsLogged: number;
  averageRoiScore: number;
  averageNoiseRatio: number;
  averageStabilityIndex: number;
  recentEvents: TelemetryEvent[];
}
