"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentAnalyzer = void 0;
class IntentAnalyzer {
    /**
     * Phân tích task (dựa trên Heuristic/Regex tạm thời).
     * Trong tương lai, có thể gọi LLM nhỏ để phân tích sâu hơn.
     */
    analyze(task) {
        const lowerTask = task.toLowerCase();
        const domains = [];
        const operations = [];
        let riskLevel = 'low';
        // Domain matching
        if (lowerTask.includes('auth') || lowerTask.includes('login') || lowerTask.includes('jwt')) {
            domains.push('auth', 'security');
            riskLevel = 'high'; // Auth is high risk
        }
        if (lowerTask.includes('db') || lowerTask.includes('database') || lowerTask.includes('sql') || lowerTask.includes('prisma')) {
            domains.push('database');
            riskLevel = 'high';
        }
        if (lowerTask.includes('ui') || lowerTask.includes('button') || lowerTask.includes('css')) {
            domains.push('ui');
        }
        // Operation matching
        if (lowerTask.includes('fix') || lowerTask.includes('bug')) {
            operations.push('fix');
        }
        if (lowerTask.includes('refactor')) {
            operations.push('refactor');
            riskLevel = riskLevel === 'low' ? 'medium' : riskLevel; // Refactoring carries some risk
        }
        if (lowerTask.includes('implement') || lowerTask.includes('add') || lowerTask.includes('create')) {
            operations.push('implement');
        }
        return {
            originalTask: task,
            domains,
            operations,
            riskLevel
        };
    }
}
exports.IntentAnalyzer = IntentAnalyzer;
