"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TelemetryManager_1 = require("../src/context-manager/TelemetryManager");
const TuiDashboard_1 = require("../src/context-manager/TuiDashboard");
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ TEST FAILED: ${message}`);
        process.exit(1);
    }
    console.log(`  ✓ ${message}`);
}
async function runTelemetryTests() {
    console.log('🧪 Starting CXF Telemetry & Analytics Unit Tests...\n');
    const testCxfDir = path_1.default.join(__dirname, '.tmp_test_cxf');
    if (fs_1.default.existsSync(testCxfDir)) {
        fs_1.default.rmSync(testCxfDir, { recursive: true, force: true });
    }
    try {
        // Test 1: Jaccard Similarity Calculation
        console.log('Test 1: Jaccard Similarity Index Calculation');
        const setA = ['.cxf/rules/auth.md', '.cxf/knowledge/db.yaml'];
        const setB = ['.cxf/rules/auth.md', '.cxf/knowledge/db.yaml'];
        const setC = ['.cxf/rules/auth.md', '.cxf/rules/ui.md'];
        const simIdentical = TelemetryManager_1.TelemetryManager.calculateJaccardSimilarity(setA, setB);
        assert(simIdentical === 1.0, `Identical sets must yield similarity 1.0, got ${simIdentical}`);
        const simPartial = TelemetryManager_1.TelemetryManager.calculateJaccardSimilarity(setA, setC);
        assert(simPartial === 0.3333, `Partial sets must yield similarity ~0.3333, got ${simPartial}`);
        // Test 2: Event Logging & Persistence
        console.log('\nTest 2: Telemetry Event Append & File Persistence');
        const manager = new TelemetryManager_1.TelemetryManager(testCxfDir);
        const sampleIntent = {
            originalTask: 'implement auth jwt login',
            domains: ['auth', 'security'],
            operations: ['implement'],
            riskLevel: 'high'
        };
        const sampleObjects = [
            {
                metadata: { id: 'auth_rule', tags: ['auth', 'security'], token_cost: 400 },
                content: 'Auth security rules',
                sourcePath: '.cxf/rules/auth.md'
            },
            {
                metadata: { id: 'db_knowledge', tags: ['database'], token_cost: 600 },
                content: 'Database connection info',
                sourcePath: '.cxf/knowledge/db.yaml'
            }
        ];
        await manager.logTelemetryEvent('task_test_001', sampleIntent, sampleObjects, 1000, 4000);
        const logFile = path_1.default.join(testCxfDir, 'telemetry', 'events.jsonl');
        assert(fs_1.default.existsSync(logFile), 'telemetry/events.jsonl file must be created');
        const events = manager.getRecentEvents(10);
        assert(events.length === 1, `Expected 1 logged event, got ${events.length}`);
        assert(events[0].taskId === 'task_test_001', 'Task ID mismatch in logged event');
        assert(events[0].totalTokens === 1000, 'Total tokens mismatch');
        assert(events[0].budgetBreakdown.rules === 400, 'Rules token breakdown mismatch');
        assert(events[0].budgetBreakdown.knowledge === 600, 'Knowledge token breakdown mismatch');
        // Test 3: Metrics Summary Aggregation
        console.log('\nTest 3: Metrics Summary Aggregation');
        const summary = manager.getMetricsSummary();
        assert(summary.totalEventsLogged === 1, `Expected totalEventsLogged = 1, got ${summary.totalEventsLogged}`);
        assert(summary.averageRoiScore > 0, `Average ROI score must be positive, got ${summary.averageRoiScore}`);
        assert(summary.averageNoiseRatio === 0.6, `Noise ratio expected 0.6 (400 pure / 1000 total), got ${summary.averageNoiseRatio}`);
        // Test 4: TUI Snapshot Formatting (Non-TTY Mode)
        console.log('\nTest 4: TuiDashboard Snapshot Rendering');
        const dashboard = new TuiDashboard_1.TuiDashboard(testCxfDir);
        const snapshot = dashboard.renderFormattedSnapshot();
        assert(typeof snapshot === 'string' && snapshot.length > 0, 'Snapshot must return non-empty string');
        console.log('\n🎉 ALL CXF TELEMETRY TESTS PASSED CLEANLY!\n');
    }
    finally {
        if (fs_1.default.existsSync(testCxfDir)) {
            fs_1.default.rmSync(testCxfDir, { recursive: true, force: true });
        }
    }
}
runTelemetryTests().catch(err => {
    console.error('Unhandled error in telemetry test:', err);
    process.exit(1);
});
