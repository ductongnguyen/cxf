import { IntentAnalyzer } from './IntentAnalyzer';
import { ContextRegistry } from './ContextRegistry';
import { SelectorRanker } from './SelectorRanker';
import { BudgetManager } from './BudgetManager';
import { PromptBuilder } from './PromptBuilder';
import { MetricsLogger } from './MetricsLogger';
import { SecurityGuard } from './SecurityGuard';

export class ContextManager {
  private analyzer = new IntentAnalyzer();
  private selectorRanker = new SelectorRanker();
  private budgetManager = new BudgetManager();
  private builder = new PromptBuilder();
  private security = new SecurityGuard();

  /**
   * The 7-step Context Engineering Pipeline
   */
  public getOptimizedContext(task: string, budget: number, cxfDir: string, taskId?: string): string {
    // 1. Intent Analysis
    const intent = this.analyzer.analyze(task);

    // 2. Registry Load (In a real system, this is cached in memory)
    const registry = new ContextRegistry(cxfDir);
    registry.loadAll();
    const allObjects = registry.getAllObjects();

    // 3 & 4. Select and Rank
    const rankedObjects = this.selectorRanker.selectAndRank(allObjects, intent);

    // 5 & 6. Budget Management & Compression
    const finalObjects = this.budgetManager.allocate(rankedObjects, budget);

    // Observability: Log metrics
    const logger = new MetricsLogger(cxfDir);
    const totalTokens = finalObjects.reduce((acc, obj) => acc + (obj.metadata.token_cost || 0), 0);
    logger.logContextSelection(taskId || `task_${Date.now()}`, intent, finalObjects, totalTokens);

    // 7. Prompt Building
    let finalPrompt = this.builder.build(finalObjects, task);

    // 8. Security Redaction (Guardrails)
    finalPrompt = this.security.redact(finalPrompt);

    return finalPrompt;
  }
}
