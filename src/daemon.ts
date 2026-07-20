import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import path from 'path';
import fs from 'fs';
import { ContextManager } from "./context-manager/ContextManager";
import { BlastRadiusAnalyzer } from "./context-manager/DependencyAnalyzer";

export async function runDaemon() {
  const server = new Server(
    {
      name: "cxf-daemon",
      version: "3.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const contextManager = new ContextManager();

  // Đăng ký Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
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
        }
      ]
    };
  });

  // Xử lý Tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const targetDir = process.env.CXF_TARGET_DIR || process.cwd();
    const cxfDir = path.join(targetDir, '.cxf');
    
    if (!fs.existsSync(cxfDir)) {
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
      const args = request.params.arguments as { task: string, budget: number };
      const task = args.task || "Unknown task";
      const budget = args.budget || 10000;
      const taskId = `cxf_req_${Date.now()}`;

      const finalPrompt = contextManager.getOptimizedContext(task, budget, cxfDir, taskId);

      return { content: [{ type: "text", text: finalPrompt }] };
    }

    if (request.params.name === "cxf_learn_context") {
      // Import MemoryManager dynamically or we could import it at the top
      const { MemoryManager } = require('./context-manager/MemoryManager');
      const memory = new MemoryManager(cxfDir);
      const args = request.params.arguments as { domain: string, content: string };
      const result = memory.learn(args.domain || 'general', args.content || '');
      return { content: [{ type: "text", text: `Đã lưu trí nhớ thành công! ID: ${result.id}` }] };
    }

    if (request.params.name === "cxf_get_metrics") {
      const metricsFile = path.join(cxfDir, '.cache', 'metrics.json');
      if (fs.existsSync(metricsFile)) {
        const content = fs.readFileSync(metricsFile, 'utf-8');
        return { content: [{ type: "text", text: content }] };
      }
      return { content: [{ type: "text", text: "Chưa có dữ liệu metrics." }] };
    }

    if (request.params.name === "cxf_get_impact_radius") {
      const args = request.params.arguments as { filePath: string, depth?: number };
      const configPath = path.join(cxfDir, 'config.json');
      let actualTargetDir = targetDir;
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (config.targetRepoPath) actualTargetDir = path.resolve(targetDir, config.targetRepoPath);
      }
      
      if (!fs.existsSync(actualTargetDir)) {
        return { content: [{ type: "text", text: `Không tìm thấy thư mục tại ${actualTargetDir}.` }] };
      }
      
      const analyzer = new BlastRadiusAnalyzer(actualTargetDir);
      analyzer.buildGraph();
      const impact = analyzer.getImpactRadius(args.filePath, args.depth || 2);
      const stats = analyzer.getStats();

      let result = `💥 Blast-Radius Analysis cho [${args.filePath}]:\n`;
      result += `- Quét ${stats.filesScanned} files, ${stats.uniqueDependenciesTracked} dependencies.\n\n`;
      if (impact.tests.length) result += `🧪 Tests bị ảnh hưởng:\n${impact.tests.map(f => '  - ' + f).join('\n')}\n\n`;
      if (impact.direct.length) result += `⚡ Direct Dependents:\n${impact.direct.map(f => '  - ' + f).join('\n')}\n\n`;
      if (impact.indirect.length) result += `🔗 Indirect Dependents:\n${impact.indirect.map(f => '  - ' + f).join('\n')}\n\n`;
      if (!impact.tests.length && !impact.direct.length && !impact.indirect.length) {
        result += `✅ Không có file nào phụ thuộc vào file này.`;
      }
      return { content: [{ type: "text", text: result }] };
    }

    throw new Error("Tool not found");
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("🚀 CXF Dynamic Context Manager (MCP Server) đang chạy trên stdio");
}
