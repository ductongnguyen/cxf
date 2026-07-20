"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoiAnalyzer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
class RoiAnalyzer {
    cxfDir;
    constructor(cxfDir) {
        this.cxfDir = cxfDir;
    }
    runAnalysis() {
        const metricsFile = path_1.default.join(this.cxfDir, '.cache', 'metrics.json');
        if (!fs_1.default.existsSync(metricsFile)) {
            console.log(chalk_1.default.yellow('⚠️  Không tìm thấy dữ liệu metrics. Hãy chạy ứng dụng để generate log context trước.'));
            return;
        }
        const content = fs_1.default.readFileSync(metricsFile, 'utf-8');
        let logs = [];
        try {
            logs = JSON.parse(content);
        }
        catch (e) {
            console.log(chalk_1.default.red('❌ Lỗi khi đọc file metrics.json'));
            return;
        }
        if (logs.length === 0) {
            console.log(chalk_1.default.yellow('ℹ️  File metrics trống.'));
            return;
        }
        console.log(chalk_1.default.magenta.bold('\n📊 Báo Cáo Context ROI (Return on Investment)\n'));
        console.log(chalk_1.default.white('Mô phỏng đo lường hiệu quả cấp phát Token so với Tỷ lệ thành công (Task Success Improvement):\n'));
        console.log(''.padEnd(85, '-'));
        console.log(`| ${'Task ID'.padEnd(20)} | ${'Domains'.padEnd(15)} | ${'Tokens Spent'.padEnd(12)} | ${'Sim. Success'.padEnd(12)} | ${'ROI Score'.padEnd(12)} |`);
        console.log(''.padEnd(85, '-'));
        let totalRoi = 0;
        for (const log of logs) {
            // Giả lập Task Success dựa trên risk level và tokens
            // Trong hệ thống thực tế, đây sẽ là dữ liệu hồi tiếp từ kết quả test của task.
            let successRate = 50;
            if (log.intent.riskLevel === 'low')
                successRate += 30;
            if (log.intent.riskLevel === 'medium')
                successRate += 20;
            if (log.intent.riskLevel === 'high')
                successRate += 10;
            // Nếu tốn token hợp lý (< 2000), điểm success cao hơn
            if (log.totalTokens > 0 && log.totalTokens < 2000)
                successRate += 15;
            else if (log.totalTokens >= 2000)
                successRate += 5;
            // Công thức tính ROI = (Success Improvement / Tokens) * multiplier (để scale ra số đẹp hơn)
            const multiplier = 100;
            const roiScore = log.totalTokens > 0 ? ((successRate / log.totalTokens) * multiplier).toFixed(2) : 'N/A';
            if (roiScore !== 'N/A')
                totalRoi += parseFloat(roiScore);
            const domains = log.intent.domains.length > 0 ? log.intent.domains.join(',') : 'none';
            let roiColor = chalk_1.default.white;
            if (roiScore !== 'N/A') {
                const score = parseFloat(roiScore);
                if (score > 10)
                    roiColor = chalk_1.default.green;
                else if (score > 5)
                    roiColor = chalk_1.default.yellow;
                else
                    roiColor = chalk_1.default.red;
            }
            console.log(`| ${log.taskId.padEnd(20)} | ${domains.padEnd(15).substring(0, 15)} | ${log.totalTokens.toString().padEnd(12)} | ${(successRate + '%').padEnd(12)} | ${roiColor(roiScore.padEnd(12))} |`);
        }
        console.log(''.padEnd(85, '-'));
        const avgRoi = (totalRoi / logs.length).toFixed(2);
        console.log(chalk_1.default.cyan(`\n💡 Điểm Context ROI Trung bình: ${avgRoi}`));
        console.log(chalk_1.default.dim(`(ROI > 10 là Tốt, ROI < 5 là đang lãng phí token)`));
        // Tạm tính độ ổn định (Context Stability)
        // Tính tỷ lệ trung bình số lượng file được load.
        const avgFiles = logs.reduce((acc, log) => acc + log.selectedFiles.length, 0) / logs.length;
        console.log(chalk_1.default.cyan(`💡 Context Stability: Hệ thống nạp trung bình ${avgFiles.toFixed(1)} file/task.`));
        console.log('\n');
    }
}
exports.RoiAnalyzer = RoiAnalyzer;
