"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDaemon = runDaemon;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const ContextManager_1 = require("./context-manager/ContextManager");
const DependencyAnalyzer_1 = require("./context-manager/DependencyAnalyzer");
async function runDaemon() {
    const server = new index_js_1.Server({
        name: "cxf-daemon",
        version: "3.0.0",
    }, {
        capabilities: {
            tools: {},
        },
    });
    const contextManager = new ContextManager_1.ContextManager();
    // Đăng ký Tools
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: "cxf_get_optimized_context",
                    description: "Yêu cầu CXF xây dựng một gói Context tối ưu, được lọc và nén dựa trên task hiện tại.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            task: {
                                type: "string",
                                description: "Mô tả chi tiết về tác vụ bạn đang muốn thực hiện."
                            },
                            budget: {
                                type: "number",
                                description: "Ngân sách token tối đa bạn muốn cấp cho context (vd: 5000)."
                            }
                        },
                        required: ["task", "budget"]
                    }
                },
                {
                    name: "cxf_learn_context",
                    description: "Lưu trữ kiến thức/bài học vào trí nhớ dài hạn (learnings.yaml) để được ưu tiên nạp trong các lần request sau.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            domain: { type: "string", description: "Domain của kiến thức (vd: auth, database)" },
                            content: { type: "string", description: "Nội dung bài học hoặc quy tắc cần nhớ." }
                        },
                        required: ["domain", "content"]
                    }
                },
                {
                    name: "cxf_get_metrics",
                    description: "Lấy dữ liệu thô về ROI và độ hiệu quả cấp phát token của các request gần đây.",
                    inputSchema: {
                        type: "object",
                        properties: {},
                        required: []
                    }
                },
                {
                    name: "cxf_get_impact_radius",
                    description: "Phân tích bán kính ảnh hưởng (Blast-Radius) của một file. Giúp AI biết được những file nào gọi đến nó để tránh break code.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            filePath: { type: "string", description: "Tên file (hoặc đường dẫn) cần phân tích." },
                            depth: { type: "number", description: "Độ sâu phân tích. Mặc định là 2." }
                        },
                        required: ["filePath"]
                    }
                },
                {
                    name: "cxf_pack",
                    description: "Gom toàn bộ mã nguồn của dự án (hoặc một module) thành một file context duy nhất (context_pack.md) cho AI.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            module: { type: "string", description: "Tên module muốn pack (vd: src/auth). Để trống nếu muốn pack toàn bộ dự án." }
                        }
                    }
                }
            ]
        };
    });
    // Xử lý Tools
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const targetDir = process.env.CXF_TARGET_DIR || process.cwd();
        const cxfDir = path_1.default.join(targetDir, '.cxf');
        if (!fs_1.default.existsSync(cxfDir)) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Lỗi: Không tìm thấy thư mục .cxf tại ${targetDir}. Vui lòng chạy cxf init.`
                    }
                ]
            };
        }
        if (request.params.name === "cxf_get_optimized_context") {
            const args = request.params.arguments;
            const task = args.task || "Unknown task";
            const budget = args.budget || 10000;
            const taskId = `cxf_req_${Date.now()}`;
            const finalPrompt = contextManager.getOptimizedContext(task, budget, cxfDir, taskId);
            return { content: [{ type: "text", text: finalPrompt }] };
        }
        if (request.params.name === "cxf_learn_context") {
            const { MemoryManager } = require('./context-manager/MemoryManager');
            const memory = new MemoryManager(cxfDir);
            const args = request.params.arguments;
            const result = memory.learn(args.domain || 'general', args.content || '');
            return { content: [{ type: "text", text: `Đã lưu trí nhớ thành công! ID: ${result.id}` }] };
        }
        if (request.params.name === "cxf_get_metrics") {
            const metricsFile = path_1.default.join(cxfDir, '.cache', 'metrics.json');
            if (fs_1.default.existsSync(metricsFile)) {
                const content = fs_1.default.readFileSync(metricsFile, 'utf-8');
                return { content: [{ type: "text", text: content }] };
            }
            return { content: [{ type: "text", text: "Chưa có dữ liệu metrics." }] };
        }
        if (request.params.name === "cxf_get_impact_radius") {
            const args = request.params.arguments;
            const configPath = path_1.default.join(cxfDir, 'config.json');
            let actualTargetDir = targetDir;
            if (fs_1.default.existsSync(configPath)) {
                const config = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
                if (config.targetRepoPath)
                    actualTargetDir = path_1.default.resolve(targetDir, config.targetRepoPath);
            }
            if (!fs_1.default.existsSync(actualTargetDir)) {
                return { content: [{ type: "text", text: `Không tìm thấy thư mục tại ${actualTargetDir}.` }] };
            }
            const analyzer = new DependencyAnalyzer_1.BlastRadiusAnalyzer(actualTargetDir);
            analyzer.buildGraph();
            const impact = analyzer.getImpactRadius(args.filePath, args.depth || 2);
            const stats = analyzer.getStats();
            let result = `Blast-Radius Analysis cho ${args.filePath} (Depth: ${args.depth || 2})\n`;
            result += `Đã quét ${stats.filesScanned} files, theo dõi ${stats.uniqueDependenciesTracked} dependencies.\n\n`;
            if (impact.tests.length > 0)
                result += `🧪 Tests bị ảnh hưởng:\n${impact.tests.map((f) => `- ${f}`).join('\n')}\n\n`;
            if (impact.direct.length > 0)
                result += `⚡ Direct Dependents:\n${impact.direct.map((f) => `- ${f}`).join('\n')}\n\n`;
            if (impact.indirect.length > 0)
                result += `🔗 Indirect Dependents:\n${impact.indirect.map((f) => `- ${f}`).join('\n')}\n\n`;
            if (impact.tests.length === 0 && impact.direct.length === 0 && impact.indirect.length === 0) {
                result += `✅ File này dường như không bị ai phụ thuộc (Safe to change).`;
            }
            return { content: [{ type: "text", text: result }] };
        }
        else if (request.params.name === "cxf_pack") {
            const args = request.params.arguments;
            const cliPath = path_1.default.join(__dirname, 'index.js');
            let cmd = `node "${cliPath}" pack`;
            if (args.module) {
                cmd += ` "${args.module}"`;
            }
            try {
                const stdout = (0, child_process_1.execSync)(cmd, { cwd: targetDir, encoding: 'utf8' });
                return { content: [{ type: "text", text: `Đã chạy cxf pack thành công:\n${stdout}\nĐường dẫn file: .cxf/knowledge/context_pack.md` }] };
            }
            catch (e) {
                return { content: [{ type: "text", text: `Lỗi khi chạy cxf pack: ${e.message}` }] };
            }
        }
        throw new Error("Tool not found");
    });
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("🚀 CXF Dynamic Context Manager (MCP Server) đang chạy trên stdio");
}
