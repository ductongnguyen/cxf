import fs from 'fs';
import path from 'path';
import { TaskIntent } from './IntentAnalyzer';
import { ContextObject } from './ContextObject';

export interface ContextLog {
  taskId: string;
  timestamp: string;
  intent: TaskIntent;
  selectedFiles: string[];
  totalTokens: number;
}

export class MetricsLogger {
  private logFile: string;

  constructor(cxfDir: string) {
    const cacheDir = path.join(cxfDir, '.cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    this.logFile = path.join(cacheDir, 'metrics.json');
  }

  public logContextSelection(
    taskId: string,
    intent: TaskIntent,
    finalObjects: ContextObject[],
    totalTokens: number
  ) {
    const selectedFiles = finalObjects.map(obj => obj.sourcePath);

    const logEntry: ContextLog = {
      taskId,
      timestamp: new Date().toISOString(),
      intent,
      selectedFiles,
      totalTokens
    };

    let existingLogs: ContextLog[] = [];
    if (fs.existsSync(this.logFile)) {
      try {
        const content = fs.readFileSync(this.logFile, 'utf-8');
        existingLogs = JSON.parse(content);
      } catch (e) {
        // Bỏ qua nếu file hỏng
      }
    }

    existingLogs.push(logEntry);
    fs.writeFileSync(this.logFile, JSON.stringify(existingLogs, null, 2));
  }
}
