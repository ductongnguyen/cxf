import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ContextLog } from './MetricsLogger';

export class RoiAnalyzer {
  constructor(private cxfDir: string) {}

  public runAnalysis() {
    const metricsFile = path.join(this.cxfDir, '.cache', 'metrics.json');
    if (!fs.existsSync(metricsFile)) {
      console.log(chalk.yellow('⚠️  Không tìm thấy dữ liệu metrics. Hãy chạy ứng dụng để generate log context trước.'));
      return;
    }

    const content = fs.readFileSync(metricsFile, 'utf-8');
    let logs: ContextLog[] = [];
    try {
      logs = JSON.parse(content);
    } catch (e) {
      console.log(chalk.red('❌ Lỗi khi đọc file metrics.json'));
      return;
    }

    if (logs.length === 0) {
      console.log(chalk.yellow('ℹ️  File metrics trống.'));
      return;
    }

    console.log(chalk.magenta.bold('\n📊 Báo Cáo Context ROI (Return on Investment)\n'));
    console.log(chalk.white('Mô phỏng đo lường hiệu quả cấp phát Token so với Tỷ lệ thành công (Task Success Improvement):\n'));
    
    console.log(''.padEnd(85, '-'));
    console.log(`| ${'Task ID'.padEnd(20)} | ${'Domains'.padEnd(15)} | ${'Tokens Spent'.padEnd(12)} | ${'Sim. Success'.padEnd(12)} | ${'ROI Score'.padEnd(12)} |`);
    console.log(''.padEnd(85, '-'));

    let totalRoi = 0;

    for (const log of logs) {
      // Giả lập Task Success dựa trên risk level và tokens
      // Trong hệ thống thực tế, đây sẽ là dữ liệu hồi tiếp từ kết quả test của task.
      let successRate = 50;
      if (log.intent.riskLevel === 'low') successRate += 30;
      if (log.intent.riskLevel === 'medium') successRate += 20;
      if (log.intent.riskLevel === 'high') successRate += 10;
      
      // Nếu tốn token hợp lý (< 2000), điểm success cao hơn
      if (log.totalTokens > 0 && log.totalTokens < 2000) successRate += 15;
      else if (log.totalTokens >= 2000) successRate += 5;

      // Công thức tính ROI = (Success Improvement / Tokens) * multiplier (để scale ra số đẹp hơn)
      const multiplier = 100;
      const roiScore = log.totalTokens > 0 ? ((successRate / log.totalTokens) * multiplier).toFixed(2) : 'N/A';
      
      if (roiScore !== 'N/A') totalRoi += parseFloat(roiScore);

      const domains = log.intent.domains.length > 0 ? log.intent.domains.join(',') : 'none';
      
      let roiColor = chalk.white;
      if (roiScore !== 'N/A') {
        const score = parseFloat(roiScore);
        if (score > 10) roiColor = chalk.green;
        else if (score > 5) roiColor = chalk.yellow;
        else roiColor = chalk.red;
      }

      console.log(`| ${log.taskId.padEnd(20)} | ${domains.padEnd(15).substring(0,15)} | ${log.totalTokens.toString().padEnd(12)} | ${(successRate + '%').padEnd(12)} | ${roiColor(roiScore.padEnd(12))} |`);
    }
    console.log(''.padEnd(85, '-'));

    const avgRoi = (totalRoi / logs.length).toFixed(2);
    console.log(chalk.cyan(`\n💡 Điểm Context ROI Trung bình: ${avgRoi}`));
    console.log(chalk.dim(`(ROI > 10 là Tốt, ROI < 5 là đang lãng phí token)`));

    // Tạm tính độ ổn định (Context Stability)
    // Tính tỷ lệ trung bình số lượng file được load.
    const avgFiles = logs.reduce((acc, log) => acc + log.selectedFiles.length, 0) / logs.length;
    console.log(chalk.cyan(`💡 Context Stability: Hệ thống nạp trung bình ${avgFiles.toFixed(1)} file/task.`));
    console.log('\n');
  }
}
