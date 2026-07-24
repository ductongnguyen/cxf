"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuiDashboard = void 0;
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
const TelemetryManager_1 = require("./TelemetryManager");
class TuiDashboard {
    telemetryManager;
    timer = null;
    isTTY;
    constructor(cxfDir) {
        this.telemetryManager = new TelemetryManager_1.TelemetryManager(cxfDir);
        this.isTTY = Boolean(process.stdout.isTTY);
    }
    /**
     * Registers signal traps for clean exit and cursor restoration.
     */
    setupSignalHandlers() {
        const cleanup = () => {
            this.stop();
            if (this.isTTY) {
                process.stdout.write('\x1b[?25h'); // Restore cursor
                process.stdout.write('\n');
            }
            process.exit(0);
        };
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
    }
    /**
     * Generates token allocation progress bar string.
     */
    renderBudgetBar(event) {
        if (!event)
            return chalk_1.default.dim('[ No telemetry events logged yet ]');
        const b = event.budgetBreakdown;
        const width = 40;
        const total = Math.max(1, b.total + b.reserve);
        const rLen = Math.round((b.rules / total) * width);
        const kLen = Math.round((b.knowledge / total) * width);
        const mLen = Math.round((b.memory / total) * width);
        const rtLen = Math.round((b.runtime / total) * width);
        const resLen = Math.max(0, width - (rLen + kLen + mLen + rtLen));
        const bar = chalk_1.default.bgBlue(' '.repeat(rLen)) +
            chalk_1.default.bgYellow(' '.repeat(kLen)) +
            chalk_1.default.bgMagenta(' '.repeat(mLen)) +
            chalk_1.default.bgCyan(' '.repeat(rtLen)) +
            chalk_1.default.bgGray(' '.repeat(resLen));
        return (`${bar}\n` +
            `  ${chalk_1.default.blue('■ Rules:')} ${b.rules}t  ` +
            `${chalk_1.default.yellow('■ Knowledge:')} ${b.knowledge}t  ` +
            `${chalk_1.default.magenta('■ Memory:')} ${b.memory}t  ` +
            `${chalk_1.default.cyan('■ Runtime:')} ${b.runtime}t  ` +
            `${chalk_1.default.gray('■ Reserve:')} ${b.reserve}t`);
    }
    /**
     * Generates formatted TUI view string.
     */
    renderFormattedSnapshot() {
        const summary = this.telemetryManager.getMetricsSummary();
        const latest = summary.latestEvent;
        if (!this.isTTY) {
            return JSON.stringify(summary, null, 2);
        }
        const title = chalk_1.default.bold.cyan('📊 CXF Real-Time Context Analytics & ROI TUI');
        const divider = chalk_1.default.dim('─'.repeat(60));
        const totalEvents = chalk_1.default.bold.white(summary.totalEventsLogged.toString());
        const roiColor = summary.averageRoiScore >= 1.5 ? chalk_1.default.green : chalk_1.default.yellow;
        const roiStr = roiColor(`${summary.averageRoiScore} ROI`);
        const noiseColor = summary.averageNoiseRatio <= 0.3 ? chalk_1.default.green : summary.averageNoiseRatio <= 0.6 ? chalk_1.default.yellow : chalk_1.default.red;
        const noisePct = (summary.averageNoiseRatio * 100).toFixed(1);
        const noiseStr = noiseColor(`${noisePct}% noise (${(100 - parseFloat(noisePct)).toFixed(1)}% pure)`);
        const stabColor = summary.averageStabilityIndex >= 0.8 ? chalk_1.default.green : chalk_1.default.yellow;
        const stabStr = stabColor(`${(summary.averageStabilityIndex * 100).toFixed(1)}% Jaccard similarity`);
        const lastTask = latest ? `${chalk_1.default.dim('Task:')} ${latest.taskId} (${latest.intent.domains.join(', ') || 'general'})` : chalk_1.default.dim('No recent task');
        const lines = [
            divider,
            ` ${title}`,
            divider,
            `  ${chalk_1.default.bold('Total Invocations:')}  ${totalEvents}`,
            `  ${chalk_1.default.bold('Context ROI Score:')}   ${roiStr}`,
            `  ${chalk_1.default.bold('Attention Leakage:')}   ${noiseStr}`,
            `  ${chalk_1.default.bold('Context Stability:')}   ${stabStr}`,
            divider,
            `  ${chalk_1.default.bold('Token Allocation Breakdown:')}`,
            `  ${this.renderBudgetBar(latest)}`,
            divider,
            `  ${lastTask}`,
            divider
        ];
        return lines.join('\n');
    }
    /**
     * Renders a single snapshot to console.
     */
    renderOnce() {
        console.log(this.renderFormattedSnapshot());
    }
    /**
     * Starts live interactive dashboard loop.
     */
    startLiveDashboard(intervalMs = 500) {
        if (!this.isTTY) {
            console.log(this.renderFormattedSnapshot());
            return;
        }
        this.setupSignalHandlers();
        process.stdout.write('\x1b[?25l'); // Hide cursor
        process.stdout.write('\x1b[2J\x1b[0;0H'); // Clear screen
        this.timer = setInterval(() => {
            readline_1.default.cursorTo(process.stdout, 0, 0);
            readline_1.default.clearScreenDown(process.stdout);
            process.stdout.write(this.renderFormattedSnapshot() + '\n\n' + chalk_1.default.dim(' Press Ctrl+C to exit live telemetry inspector...'));
        }, intervalMs);
    }
    /**
     * Stops live dashboard loop.
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
exports.TuiDashboard = TuiDashboard;
