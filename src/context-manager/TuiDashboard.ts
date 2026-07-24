import chalk from 'chalk';
import readline from 'readline';
import { TelemetryManager } from './TelemetryManager';
import { TelemetryEvent, ContextMetricsResponse } from './TelemetryTypes';

export class TuiDashboard {
  private telemetryManager: TelemetryManager;
  private timer: NodeJS.Timeout | null = null;
  private isTTY: boolean;

  constructor(cxfDir: string) {
    this.telemetryManager = new TelemetryManager(cxfDir);
    this.isTTY = Boolean(process.stdout.isTTY);
  }

  /**
   * Registers signal traps for clean exit and cursor restoration.
   */
  private setupSignalHandlers(): void {
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
  private renderBudgetBar(event?: TelemetryEvent): string {
    if (!event) return chalk.dim('[ No telemetry events logged yet ]');
    const b = event.budgetBreakdown;
    const width = 40;
    const total = Math.max(1, b.total + b.reserve);

    const rLen = Math.round((b.rules / total) * width);
    const kLen = Math.round((b.knowledge / total) * width);
    const mLen = Math.round((b.memory / total) * width);
    const rtLen = Math.round((b.runtime / total) * width);
    const resLen = Math.max(0, width - (rLen + kLen + mLen + rtLen));

    const bar =
      chalk.bgBlue(' '.repeat(rLen)) +
      chalk.bgYellow(' '.repeat(kLen)) +
      chalk.bgMagenta(' '.repeat(mLen)) +
      chalk.bgCyan(' '.repeat(rtLen)) +
      chalk.bgGray(' '.repeat(resLen));

    return (
      `${bar}\n` +
      `  ${chalk.blue('■ Rules:')} ${b.rules}t  ` +
      `${chalk.yellow('■ Knowledge:')} ${b.knowledge}t  ` +
      `${chalk.magenta('■ Memory:')} ${b.memory}t  ` +
      `${chalk.cyan('■ Runtime:')} ${b.runtime}t  ` +
      `${chalk.gray('■ Reserve:')} ${b.reserve}t`
    );
  }

  /**
   * Generates formatted TUI view string.
   */
  public renderFormattedSnapshot(): string {
    const summary: ContextMetricsResponse = this.telemetryManager.getMetricsSummary();
    const latest = summary.latestEvent;

    if (!this.isTTY) {
      return JSON.stringify(summary, null, 2);
    }

    const title = chalk.bold.cyan('📊 CXF Real-Time Context Analytics & ROI TUI');
    const divider = chalk.dim('─'.repeat(60));

    const totalEvents = chalk.bold.white(summary.totalEventsLogged.toString());
    const roiColor = summary.averageRoiScore >= 1.5 ? chalk.green : chalk.yellow;
    const roiStr = roiColor(`${summary.averageRoiScore} ROI`);

    const noiseColor = summary.averageNoiseRatio <= 0.3 ? chalk.green : summary.averageNoiseRatio <= 0.6 ? chalk.yellow : chalk.red;
    const noisePct = (summary.averageNoiseRatio * 100).toFixed(1);
    const noiseStr = noiseColor(`${noisePct}% noise (${(100 - parseFloat(noisePct)).toFixed(1)}% pure)`);

    const stabColor = summary.averageStabilityIndex >= 0.8 ? chalk.green : chalk.yellow;
    const stabStr = stabColor(`${(summary.averageStabilityIndex * 100).toFixed(1)}% Jaccard similarity`);

    const lastTask = latest ? `${chalk.dim('Task:')} ${latest.taskId} (${latest.intent.domains.join(', ') || 'general'})` : chalk.dim('No recent task');

    const lines = [
      divider,
      ` ${title}`,
      divider,
      `  ${chalk.bold('Total Invocations:')}  ${totalEvents}`,
      `  ${chalk.bold('Context ROI Score:')}   ${roiStr}`,
      `  ${chalk.bold('Attention Leakage:')}   ${noiseStr}`,
      `  ${chalk.bold('Context Stability:')}   ${stabStr}`,
      divider,
      `  ${chalk.bold('Token Allocation Breakdown:')}`,
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
  public renderOnce(): void {
    console.log(this.renderFormattedSnapshot());
  }

  /**
   * Starts live interactive dashboard loop.
   */
  public startLiveDashboard(intervalMs = 500): void {
    if (!this.isTTY) {
      console.log(this.renderFormattedSnapshot());
      return;
    }

    this.setupSignalHandlers();
    process.stdout.write('\x1b[?25l'); // Hide cursor
    process.stdout.write('\x1b[2J\x1b[0;0H'); // Clear screen

    this.timer = setInterval(() => {
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      process.stdout.write(this.renderFormattedSnapshot() + '\n\n' + chalk.dim(' Press Ctrl+C to exit live telemetry inspector...'));
    }, intervalMs);
  }

  /**
   * Stops live dashboard loop.
   */
  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
