import fs from 'fs';
import path from 'path';
import { TaskIntent } from './IntentAnalyzer';
import { ContextObject } from './ContextObject';
import { TelemetryEvent, ContextMetricsResponse, ContextBudgetBreakdown } from './TelemetryTypes';

export class TelemetryManager {
  private telemetryDir: string;
  private logFile: string;
  private maxEvents = 1000;

  constructor(cxfDir: string) {
    this.telemetryDir = path.join(cxfDir, 'telemetry');
    this.logFile = path.join(this.telemetryDir, 'events.jsonl');
  }

  private ensureDir() {
    if (!fs.existsSync(this.telemetryDir)) {
      fs.mkdirSync(this.telemetryDir, { recursive: true });
    }
  }

  /**
   * Calculates Jaccard similarity index across two sets of selected files.
   * J(S1, S2) = |S1 ∩ S2| / |S1 ∪ S2|
   */
  public static calculateJaccardSimilarity(setA: string[], setB: string[]): number {
    if (setA.length === 0 && setB.length === 0) return 1.0;
    const a = new Set(setA);
    const b = new Set(setB);
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    return union.size === 0 ? 1.0 : parseFloat((intersection.size / union.size).toFixed(4));
  }

  /**
   * Log fine-grained telemetry event asynchronously. Non-fatal: catches all errors.
   */
  public async logTelemetryEvent(
    taskId: string,
    intent: TaskIntent,
    finalObjects: ContextObject[],
    totalTokens: number,
    maxBudget: number
  ): Promise<void> {
    try {
      this.ensureDir();

      const selectedFiles = finalObjects.map(obj => obj.sourcePath);

      // Categorize tokens by category
      let rulesTokens = 0;
      let knowledgeTokens = 0;
      let memoryTokens = 0;
      let runtimeTokens = 0;
      let targetDomainTokens = 0;

      for (const obj of finalObjects) {
        const tokens = obj.metadata.token_cost || 0;
        const sourceLower = obj.sourcePath.toLowerCase();

        if (sourceLower.includes('rules')) rulesTokens += tokens;
        else if (sourceLower.includes('memory')) memoryTokens += tokens;
        else if (sourceLower.includes('knowledge')) knowledgeTokens += tokens;
        else runtimeTokens += tokens;

        // Domain matching check
        const objectTags = obj.metadata.tags || [];
        const isDomainMatch = intent.domains.some(d =>
          objectTags.includes(d.toLowerCase()) || sourceLower.includes(d.toLowerCase())
        );

        if (isDomainMatch) {
          targetDomainTokens += tokens;
        }
      }

      const budgetBreakdown: ContextBudgetBreakdown = {
        rules: rulesTokens,
        knowledge: knowledgeTokens,
        memory: memoryTokens,
        runtime: runtimeTokens,
        reserve: Math.max(0, maxBudget - totalTokens),
        total: totalTokens
      };

      // Attention Noise Ratio: 1.0 - (targetDomainTokens / totalTokens)
      const noiseRatio = totalTokens > 0
        ? parseFloat((1.0 - (targetDomainTokens / totalTokens)).toFixed(4))
        : 0.0;

      // Simulated success rate for baseline ROI score
      let successRate = 60;
      if (intent.riskLevel === 'low') successRate += 25;
      if (intent.riskLevel === 'medium') successRate += 15;
      if (totalTokens > 0 && totalTokens <= 3000) successRate += 15;

      const roiScore = totalTokens > 0
        ? parseFloat(((successRate / totalTokens) * 100).toFixed(2))
        : 0.0;

      // Calculate Jaccard Stability Index against past events
      const pastEvents = this.getRecentEvents(10);
      const matchingPastEvent = pastEvents.reverse().find(e =>
        e.intent.domains.join(',') === intent.domains.join(',')
      );

      const stabilityIndex = matchingPastEvent
        ? TelemetryManager.calculateJaccardSimilarity(selectedFiles, matchingPastEvent.selectedFiles)
        : 1.0;

      const event: TelemetryEvent = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        taskId,
        intent,
        budgetBreakdown,
        selectedFiles,
        totalTokens,
        roiScore,
        noiseRatio,
        stabilityIndex
      };

      await fs.promises.appendFile(this.logFile, JSON.stringify(event) + '\n', 'utf-8');

      // Rolling log cap cleanup
      this.pruneEventsLogIfNeeded();
    } catch (e) {
      // Non-fatal: telemetry failure must never interrupt LLM pipeline
    }
  }

  /**
   * Reads recent telemetry events synchronously.
   */
  public getRecentEvents(limit = 50): TelemetryEvent[] {
    if (!fs.existsSync(this.logFile)) return [];

    try {
      const content = fs.readFileSync(this.logFile, 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);
      const events: TelemetryEvent[] = [];

      for (const line of lines) {
        try {
          events.push(JSON.parse(line));
        } catch (e) {
          // Skip corrupt JSON line
        }
      }

      return events.slice(-limit);
    } catch (e) {
      return [];
    }
  }

  /**
   * Generates summary response for MCP cxf_get_metrics tool.
   */
  public getMetricsSummary(): ContextMetricsResponse {
    const events = this.getRecentEvents(100);
    if (events.length === 0) {
      return {
        totalEventsLogged: 0,
        averageRoiScore: 0,
        averageNoiseRatio: 0,
        averageStabilityIndex: 1.0,
        recentEvents: []
      };
    }

    const totalRoi = events.reduce((sum, e) => sum + e.roiScore, 0);
    const totalNoise = events.reduce((sum, e) => sum + e.noiseRatio, 0);
    const totalStability = events.reduce((sum, e) => sum + e.stabilityIndex, 0);

    return {
      latestEvent: events[events.length - 1],
      totalEventsLogged: events.length,
      averageRoiScore: parseFloat((totalRoi / events.length).toFixed(2)),
      averageNoiseRatio: parseFloat((totalNoise / events.length).toFixed(4)),
      averageStabilityIndex: parseFloat((totalStability / events.length).toFixed(4)),
      recentEvents: events.slice(-10)
    };
  }

  /**
   * Prunes log file if line count exceeds maxEvents (rolling log retention).
   */
  private pruneEventsLogIfNeeded(): void {
    try {
      if (!fs.existsSync(this.logFile)) return;
      const content = fs.readFileSync(this.logFile, 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);

      if (lines.length > this.maxEvents) {
        const trimmed = lines.slice(-this.maxEvents);
        fs.writeFileSync(this.logFile, trimmed.join('\n') + '\n', 'utf-8');
      }
    } catch (e) {
      // Non-fatal
    }
  }
}
