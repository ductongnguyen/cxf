"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsLogger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TelemetryManager_1 = require("./TelemetryManager");
class MetricsLogger {
    logFile;
    cxfDir;
    telemetryManager;
    constructor(cxfDir) {
        this.cxfDir = cxfDir;
        const cacheDir = path_1.default.join(cxfDir, '.cache');
        if (!fs_1.default.existsSync(cacheDir)) {
            fs_1.default.mkdirSync(cacheDir, { recursive: true });
        }
        this.logFile = path_1.default.join(cacheDir, 'metrics.json');
        this.telemetryManager = new TelemetryManager_1.TelemetryManager(cxfDir);
    }
    logContextSelection(taskId, intent, finalObjects, totalTokens, maxBudget = 4000) {
        const selectedFiles = finalObjects.map(obj => obj.sourcePath);
        const logEntry = {
            taskId,
            timestamp: new Date().toISOString(),
            intent,
            selectedFiles,
            totalTokens
        };
        let existingLogs = [];
        if (fs_1.default.existsSync(this.logFile)) {
            try {
                const content = fs_1.default.readFileSync(this.logFile, 'utf-8');
                existingLogs = JSON.parse(content);
            }
            catch (e) {
                // Bỏ qua nếu file hỏng
            }
        }
        existingLogs.push(logEntry);
        fs_1.default.writeFileSync(this.logFile, JSON.stringify(existingLogs, null, 2));
        // Delegate async non-blocking telemetry event logging
        this.telemetryManager.logTelemetryEvent(taskId, intent, finalObjects, totalTokens, maxBudget);
    }
}
exports.MetricsLogger = MetricsLogger;
