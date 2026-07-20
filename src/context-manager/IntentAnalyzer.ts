export interface TaskIntent {
  originalTask: string;
  domains: string[];     // e.g., 'auth', 'database', 'ui'
  operations: string[];  // e.g., 'implement', 'refactor', 'fix'
  riskLevel: 'high' | 'medium' | 'low';
}

export class IntentAnalyzer {
  /**
   * Phân tích task (dựa trên Heuristic/Regex tạm thời).
   * Trong tương lai, có thể gọi LLM nhỏ để phân tích sâu hơn.
   */
  public analyze(task: string): TaskIntent {
    const lowerTask = task.toLowerCase();
    const domains: string[] = [];
    const operations: string[] = [];
    let riskLevel: 'high' | 'medium' | 'low' = 'low';

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
