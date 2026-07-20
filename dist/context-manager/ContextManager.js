"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
const IntentAnalyzer_1 = require("./IntentAnalyzer");
const ContextRegistry_1 = require("./ContextRegistry");
const SelectorRanker_1 = require("./SelectorRanker");
const BudgetManager_1 = require("./BudgetManager");
const PromptBuilder_1 = require("./PromptBuilder");
const MetricsLogger_1 = require("./MetricsLogger");
const SecurityGuard_1 = require("./SecurityGuard");
class ContextManager {
    analyzer = new IntentAnalyzer_1.IntentAnalyzer();
    selectorRanker = new SelectorRanker_1.SelectorRanker();
    budgetManager = new BudgetManager_1.BudgetManager();
    builder = new PromptBuilder_1.PromptBuilder();
    security = new SecurityGuard_1.SecurityGuard();
    /**
     * The 7-step Context Engineering Pipeline
     */
    getOptimizedContext(task, budget, cxfDir, taskId) {
        // 1. Intent Analysis
        const intent = this.analyzer.analyze(task);
        // 2. Registry Load (In a real system, this is cached in memory)
        const registry = new ContextRegistry_1.ContextRegistry(cxfDir);
        registry.loadAll();
        const allObjects = registry.getAllObjects();
        // 3 & 4. Select and Rank
        const rankedObjects = this.selectorRanker.selectAndRank(allObjects, intent);
        // 5 & 6. Budget Management & Compression
        const finalObjects = this.budgetManager.allocate(rankedObjects, budget);
        // Observability: Log metrics
        const logger = new MetricsLogger_1.MetricsLogger(cxfDir);
        const totalTokens = finalObjects.reduce((acc, obj) => acc + (obj.metadata.token_cost || 0), 0);
        logger.logContextSelection(taskId || `task_${Date.now()}`, intent, finalObjects, totalTokens);
        // 7. Prompt Building
        let finalPrompt = this.builder.build(finalObjects, task);
        // 8. Security Redaction (Guardrails)
        finalPrompt = this.security.redact(finalPrompt);
        return finalPrompt;
    }
}
exports.ContextManager = ContextManager;
