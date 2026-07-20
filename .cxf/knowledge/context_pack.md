# Project Context Pack
Generated at: 2026-07-20T07:20:01.075Z


## File: CHANGELOG.md
```
# Changelog

Tất cả các thay đổi đáng chú ý đối với dự án này sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Thêm cờ `--yes` (`-y`) cho lệnh `init` để tự động duyệt.

## [3.1.0] - 2026-07-18

### Added
- **Smart Init (7 Phases)**: Khởi tạo ngữ cảnh động (`cxf init`).
- **Incremental Sync**: Đồng bộ hóa kiến thức dự án (`cxf sync`).
- **Skill Manager**: Hỗ trợ tạo và tùy chỉnh các kỹ năng AI (`cxf skill create`).
- **Daemon Mode**: Máy chủ MCP chạy dưới dạng tiến trình nền (`cxf daemon`).

### Changed
- Cập nhật Commander.js để cải thiện thông báo lỗi và tự động gợi ý (`showHelpAfterError`, `showSuggestionAfterError`).
- Bổ sung `README.md` giúp người mới tiếp cận nhanh (TTHW < 1 phút).

```

## File: package.json
```
{
  "name": "cxf-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "tsc",
    "start": "node ./dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.29.0",
    "chalk": "^4.1.2",
    "commander": "^15.0.0",
    "yaml": "^2.9.0"
  },
  "devDependencies": {
    "@types/node": "^26.1.1",
    "tsx": "^4.23.1",
    "typescript": "^7.0.2"
  },
  "bin": {
    "cxf": "./dist/index.js"
  }
}

```

## File: README.md
```
# CXF CLI (Context eXchange Framework)

CXF CLI là một hệ thống **Context Engine** được thiết kế để giải quyết điểm yếu cốt lõi của RAG (Retrieval-Augmented Generation) trong các tác vụ AI Agentic Coding. Nó đóng vai trò như một "máy chủ MCP (Model Context Protocol)" cung cấp ngữ cảnh cực kỳ chính xác, tiết kiệm token và bảo mật cho các AI Agents (Cursor, Claude Code, Gemini).

---

## Tại sao chọn CXF?

- **Real Init (Dynamic Detection)**: Không xài dữ liệu giả. `cxf init` tự động quét sâu vào mã nguồn (`package.json`, `src/`) để nhận diện chính xác 100% Framework (Next.js, NestJS, Go...) và danh sách Module hiện có.
- **Dynamic Guardrails**: Tự động sinh file `rules/global.md` chứa các Best Practices (VD: `"use client"` cho Next.js, cấm `any` cho TypeScript) khớp hoàn toàn với stack công nghệ của dự án.
- **Agent Directives**: Tự động tiêm các Mệnh lệnh (Skill) bắt buộc AI phải gọi MCP Tools (`cxf_get_optimized_context`, `cxf_learn_context`) để đảm bảo AI vận hành theo đúng quy trình.
- **Token Efficiency**: Thuật toán đa lớp (Minify, Strip Comments, Markdown Collapsing) giúp nén lượng token xuống mức tối thiểu mà không mất đi tính logic.
- **Dependency Spread (Level 2 Context)**: Hệ thống đọc hiểu `import`/`require` trong code để "lan truyền" điểm phụ thuộc, đảm bảo LLM không bao giờ bị thiếu thư viện khi code.
- **Autonomous Memory**: LLM tự động rút ra bài học sau mỗi task khó và ghi vào `learnings.yaml`. Kinh nghiệm này sẽ được cộng điểm ưu tiên cao nhất cho các lần gọi sau.
- **Security Guardrails**: Tường lửa Regex chặn đứng và mã hóa (`[REDACTED]`) các API Key, JWT, Password trước khi dữ liệu được gửi đến LLM bên thứ 3.
- **Observability**: Hệ thống liên tục ghi nhận dữ liệu vào `metrics.json` và chấm điểm ROI (Return on Investment) để theo dõi hiệu quả sử dụng token.

---

## Cài đặt

```bash
npm install -g cxf-cli
```
*Lưu ý: CXF CLI hiện tại đang ở bản 3.0.0. Yêu cầu Node.js >= 18.*

---

## Hướng dẫn sử dụng CLI

### 1. Khởi tạo Dự án
Di chuyển vào thư mục code của bạn và chạy:
```bash
cxf init -y
```
Lệnh này sẽ tạo ra thư mục `.cxf/` chứa các cấu hình về `knowledge` (kiến thức) và `skills` (hành vi).

### 2. Đồng bộ Hệ thống (Sync)
```bash
cxf sync
```
Quét đệ quy toàn bộ thư mục `src/` (hoặc thư mục mã nguồn) và tạo index siêu dữ liệu (metadata) lưu vào `sync_modules.yaml`.

### 3. Lưu Trí nhớ (Learnings)
```bash
cxf learn "auth" "Khi gọi API login phải truyền header x-api-key"
```
Trí nhớ này sẽ được tự động ghim với độ ưu tiên +500 điểm khi Agent tương tác với domain `auth`.

### 4. Phân tích Hiệu quả (ROI)
```bash
cxf roi
```
Truy xuất file `metrics.json` và phân tích xem Context Engine đang chi tiêu token hiệu quả ra sao so với tỷ lệ giải quyết lỗi thành công.

---

## Khởi chạy MCP Daemon (AI Agent Mode)

CXF CLI được tích hợp sẵn một máy chủ MCP (Model Context Protocol) chạy qua luồng `stdio`.

```bash
cxf daemon
```

Khi được kết nối vào IDE (như Cursor) hoặc một AI CLI, daemon này cung cấp 3 siêu công cụ (Tools) cho LLM sử dụng tự động:
1. `cxf_get_optimized_context`: Bơm ngữ cảnh động, thu gọn, đã lọc bảo mật.
2. `cxf_learn_context`: Để AI tự động ghi chép lại kinh nghiệm.
3. `cxf_get_metrics`: Để AI đọc và tự đánh giá chỉ số tiêu thụ token (ROI).

---

## Cấu trúc thư mục `.cxf`

```text
.cxf/
├── .cache/
│   └── metrics.json          # Lưu trữ lịch sử nạp context và ROI
├── knowledge/
│   ├── learnings.yaml        # Trí nhớ dài hạn của dự án
│   └── sync_modules.yaml     # Metadata tự sinh từ mã nguồn
└── skills/
    └── rules.md              # Các quy tắc đặc thù của dự án (Guardrails, styleguide)
```

---

## Kiến trúc Hoạt động (The 8-step Pipeline)

Mỗi khi có yêu cầu cấp phát ngữ cảnh, CXF chạy qua 8 bước:
1. **Intent Analysis**: Phân tích câu lệnh để dò tìm Domain (Vd: `auth`, `database`).
2. **Registry Load**: Tải toàn bộ Knowledge, Skills, Learnings từ `.cxf/`.
3. **Dependency Spread**: Đọc AST/Regex để kéo các file liên quan.
4. **Rank & Score**: Chấm điểm dựa trên Tag Matching và Priority (+1000 cho rules, +500 cho learnings).
5. **Budget Allocation**: Bắt đầu nhồi file vào ngân sách Token (Budget).
6. **Token Compression**: Nếu tràn Budget, kích hoạt máy nén đa lớp (Bỏ Comments, Minify, Gập Markdown).
7. **Prompt Build**: Ghép các file đã chọn thành một Prompt duy nhất.
8. **Security Redaction**: Chặn và mã hóa API Keys / Mật khẩu. Xuất log đo lường ROI ra `metrics.json`.

---

**CXF CLI - Định hình kỷ nguyên Context Engineering cho AI Agentic Coding.**

```

## File: src/context-manager/BudgetManager.ts
```
import { ContextObject } from './ContextObject';
import { TokenCompressor } from './TokenCompressor';

export class BudgetManager {
  private compressor = new TokenCompressor();

  /**
   * Cắt gọt danh sách Context Objects để vừa với budget token.
   * Danh sách truyền vào đã được xếp hạng (Ranked) từ quan trọng nhất đến ít quan trọng nhất.
   */
  public allocate(rankedObjects: ContextObject[], maxBudget: number): ContextObject[] {
    let currentTokens = 0;
    const finalSelection: ContextObject[] = [];

    for (const obj of rankedObjects) {
      const cost = obj.metadata.token_cost || 0;
      
      if (currentTokens + cost <= maxBudget) {
        finalSelection.push(obj);
        currentTokens += cost;
      } else {
        // Nén (Compress) đa lớp nếu được phép để nhét vừa
        if (obj.metadata.compression_allowed) {
          let sourceType: 'code' | 'markdown' | 'yaml' = 'markdown';
          if (obj.sourcePath.endsWith('.ts') || obj.sourcePath.endsWith('.js')) sourceType = 'code';
          else if (obj.sourcePath.endsWith('.yaml') || obj.sourcePath.endsWith('.yml')) sourceType = 'yaml';

          const compressedContent = this.compressor.compress(obj.content, sourceType);
          const compressedCost = Math.ceil(compressedContent.length / 4);
          
          if (currentTokens + compressedCost <= maxBudget) {
            finalSelection.push({
              ...obj,
              content: compressedContent,
              metadata: { ...obj.metadata, token_cost: compressedCost }
            });
            currentTokens += compressedCost;
          }
        }
        // Nếu vẫn không vừa sau khi nén, đành phải bỏ qua Object này (Isolation)
      }
    }

    return finalSelection;
  }
}

```

## File: src/context-manager/ContextManager.ts
```
import { IntentAnalyzer } from './IntentAnalyzer';
import { ContextRegistry } from './ContextRegistry';
import { SelectorRanker } from './SelectorRanker';
import { BudgetManager } from './BudgetManager';
import { PromptBuilder } from './PromptBuilder';
import { MetricsLogger } from './MetricsLogger';
import { SecurityGuard } from './SecurityGuard';

export class ContextManager {
  private analyzer = new IntentAnalyzer();
  private selectorRanker = new SelectorRanker();
  private budgetManager = new BudgetManager();
  private builder = new PromptBuilder();
  private security = new SecurityGuard();

  /**
   * The 7-step Context Engineering Pipeline
   */
  public getOptimizedContext(task: string, budget: number, cxfDir: string, taskId?: string): string {
    // 1. Intent Analysis
    const intent = this.analyzer.analyze(task);

    // 2. Registry Load (In a real system, this is cached in memory)
    const registry = new ContextRegistry(cxfDir);
    registry.loadAll();
    const allObjects = registry.getAllObjects();

    // 3 & 4. Select and Rank
    const rankedObjects = this.selectorRanker.selectAndRank(allObjects, intent);

    // 5 & 6. Budget Management & Compression
    const finalObjects = this.budgetManager.allocate(rankedObjects, budget);

    // Observability: Log metrics
    const logger = new MetricsLogger(cxfDir);
    const totalTokens = finalObjects.reduce((acc, obj) => acc + (obj.metadata.token_cost || 0), 0);
    logger.logContextSelection(taskId || `task_${Date.now()}`, intent, finalObjects, totalTokens);

    // 7. Prompt Building
    let finalPrompt = this.builder.build(finalObjects, task);

    // 8. Security Redaction (Guardrails)
    finalPrompt = this.security.redact(finalPrompt);

    return finalPrompt;
  }
}

```

## File: src/context-manager/ContextObject.ts
```
export interface ContextMetadata {
  id: string;
  title?: string;
  tags?: string[];
  priority?: number;
  token_cost?: number;
  summary?: string;
  dependencies?: string[];
  ttl?: number;
  version?: string;
  last_used?: string;
  success_rate?: number;
  compression_allowed?: boolean;
}

export interface ContextObject {
  metadata: ContextMetadata;
  content: string;     // The actual markdown content
  sourcePath: string;  // Where this object came from (e.g., .cxf/rules/auth.md)
}

```

## File: src/context-manager/ContextRegistry.ts
```
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { ContextObject, ContextMetadata } from './ContextObject';

export class ContextRegistry {
  private objects: ContextObject[] = [];

  constructor(private cxfDir: string) {}

  public loadAll() {
    this.objects = [];
    const dirsToScan = ['rules', 'knowledge', 'extensions', 'skills'];
    
    for (const dir of dirsToScan) {
      const fullPath = path.join(this.cxfDir, dir);
      if (fs.existsSync(fullPath)) {
        this.scanDirectory(fullPath);
      }
    }
  }

  private scanDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        this.scanDirectory(filePath);
      } else if (file.endsWith('.md')) {
        this.parseMarkdownFile(filePath);
      } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        this.parseYamlFile(filePath);
      }
    }
  }

  private parseMarkdownFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Tách Frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    let metadata: ContextMetadata;
    let actualContent = content;

    if (match) {
      try {
        metadata = yaml.parse(match[1]) as ContextMetadata;
        actualContent = match[2];
      } catch (e) {
        metadata = { id: path.basename(filePath, '.md') };
      }
    } else {
      metadata = { id: path.basename(filePath, '.md') };
    }

    if (!metadata.token_cost) metadata.token_cost = Math.ceil(actualContent.length / 4);
    if (metadata.priority === undefined) metadata.priority = 50;

    this.objects.push({ metadata, content: actualContent, sourcePath: filePath });
  }

  private parseYamlFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      const yamlData = yaml.parse(content) as any;
      
      // Xây dựng Metadata
      const metadata: ContextMetadata = {
        id: yamlData.id || path.basename(filePath, path.extname(filePath)),
        title: yamlData.title,
        tags: yamlData.tags || [],
        priority: yamlData.priority || 60,
        token_cost: Math.ceil(content.length / 4)
      };

      // Đẩy toàn bộ cục YAML thành String Content để Prompt Builder dùng
      this.objects.push({
        metadata,
        content: content,
        sourcePath: filePath
      });
    } catch (e) {
      // Bỏ qua nếu YAML hỏng
    }
  }

  public getAllObjects(): ContextObject[] {
    return this.objects;
  }
}

```

## File: src/context-manager/DependencyAnalyzer.ts
```
import fs from 'fs';
import path from 'path';

export class DependencyAnalyzer {
  /**
   * Trích xuất danh sách các module/file được import hoặc require trong nội dung code.
   * Sử dụng Regex để quét cú pháp ES6 và CommonJS.
   */
  public extractDependencies(content: string): string[] {
    const dependencies = new Set<string>();

    // Regex quét cú pháp: import { X } from './Y' hoặc import X from "Y"
    const importRegex = /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      if (match[1]) dependencies.add(this.normalize(match[1]));
    }

    // Regex quét cú pháp: require('./Y')
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      if (match[1]) dependencies.add(this.normalize(match[1]));
    }

    return Array.from(dependencies);
  }

  private normalize(dep: string): string {
    // Lược bỏ tiền tố ./ hoặc ../ để dễ dàng so sánh tên gốc
    let normalized = dep.split('/').pop() || dep;
    // Lược bỏ đuôi mở rộng nếu có để so sánh module name
    normalized = normalized.replace(/\.(ts|js|jsx|tsx)$/, '');
    return normalized;
  }
}

export class BlastRadiusAnalyzer {
  private dependencyAnalyzer = new DependencyAnalyzer();
  private reverseGraph: Map<string, Set<string>> = new Map();
  private filesScanned = 0;

  constructor(private rootDir: string) {}

  /** Build the reverse dependency graph */
  public buildGraph() {
    this.reverseGraph.clear();
    this.filesScanned = 0;
    this.scanDirectory(this.rootDir);
  }

  private scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    const ignoreList = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'vendor', '.cxf']);
    
    for (const entry of entries) {
      if (ignoreList.has(entry.name)) continue;
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        this.scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(ts|js|jsx|tsx)$/.test(entry.name)) {
        this.processFile(fullPath);
      }
    }
  }

  private processFile(filePath: string) {
    this.filesScanned++;
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const deps = this.dependencyAnalyzer.extractDependencies(content);
      
      for (const dep of deps) {
        if (!this.reverseGraph.has(dep)) {
          this.reverseGraph.set(dep, new Set());
        }
        this.reverseGraph.get(dep)!.add(filePath);
      }
    } catch (e) {
      // Ignore read errors (e.g., binary files or permissions)
    }
  }

  /**
   * Find files affected by changing a target file.
   * Uses basename to match imports (High Recall heuristic).
   */
  public getImpactRadius(targetFileName: string, depth = 2): { direct: string[], indirect: string[], tests: string[] } {
    const targetBase = this.normalizeName(targetFileName);
    const directDependents = this.getDirectDependents(targetBase);
    
    const direct = new Set<string>();
    const indirect = new Set<string>();
    const tests = new Set<string>();

    const categorize = (file: string, isDirect: boolean) => {
      const fileBase = this.normalizeName(file).toLowerCase();
      if (fileBase.includes('test') || fileBase.includes('spec')) {
        tests.add(file);
      } else {
        if (isDirect) direct.add(file);
        else indirect.add(file);
      }
    };

    // Direct
    for (const file of directDependents) {
      categorize(file, true);
    }

    // Indirect (Depth 2)
    if (depth >= 2) {
      for (const file of directDependents) {
        const fileBase = this.normalizeName(file);
        const secondLevel = this.getDirectDependents(fileBase);
        for (const subFile of secondLevel) {
          if (!direct.has(subFile) && !tests.has(subFile)) {
            categorize(subFile, false);
          }
        }
      }
    }

    return {
      direct: Array.from(direct),
      indirect: Array.from(indirect),
      tests: Array.from(tests)
    };
  }

  private getDirectDependents(baseName: string): string[] {
    const dependents = this.reverseGraph.get(baseName);
    return dependents ? Array.from(dependents) : [];
  }

  private normalizeName(filePath: string): string {
    let normalized = filePath.split(/[\\/]/).pop() || filePath;
    normalized = normalized.replace(/\.(ts|js|jsx|tsx)$/, '');
    return normalized;
  }
  
  public getStats() {
    return {
      filesScanned: this.filesScanned,
      uniqueDependenciesTracked: this.reverseGraph.size
    };
  }
}

```

## File: src/context-manager/IntentAnalyzer.ts
```
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

```

## File: src/context-manager/MemoryManager.ts
```
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export interface Learning {
  id: string;
  domain: string;
  content: string;
  createdAt: string;
  hitCount: number;
}

export class MemoryManager {
  private learningsFile: string;

  constructor(cxfDir: string) {
    const knowledgeDir = path.join(cxfDir, 'knowledge');
    if (!fs.existsSync(knowledgeDir)) {
      fs.mkdirSync(knowledgeDir, { recursive: true });
    }
    this.learningsFile = path.join(knowledgeDir, 'learnings.yaml');
  }

  public learn(domain: string, content: string) {
    let learnings: Learning[] = [];

    if (fs.existsSync(this.learningsFile)) {
      try {
        const fileContent = fs.readFileSync(this.learningsFile, 'utf-8');
        const parsed = yaml.parse(fileContent);
        if (parsed && Array.isArray(parsed.learnings)) {
          learnings = parsed.learnings;
        }
      } catch (e) {
        // Bỏ qua lỗi parse
      }
    }

    const newLearning: Learning = {
      id: `lrn_${Date.now()}`,
      domain,
      content,
      createdAt: new Date().toISOString(),
      hitCount: 0
    };

    learnings.push(newLearning);

    const yamlData = {
      id: 'learnings',
      title: 'Project Learnings & Memories',
      tags: ['memory', 'learnings', 'global'],
      priority: 950,
      learnings
    };

    fs.writeFileSync(this.learningsFile, yaml.stringify(yamlData));
    return newLearning;
  }
}

```

## File: src/context-manager/MetricsLogger.ts
```
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

```

## File: src/context-manager/PromptBuilder.ts
```
import { ContextObject } from './ContextObject';

export class PromptBuilder {
  /**
   * Lắp ghép các Context Objects thành một khối Prompt chuẩn xác
   */
  public build(finalObjects: ContextObject[], originalTask: string): string {
    let prompt = `====================================================\n`;
    prompt += `CONTEXT ENGINEERING FRAMEWORK (CXF)\n`;
    prompt += `Optimized Context Payload\n`;
    prompt += `====================================================\n\n`;

    // Phân nhóm
    const rules = finalObjects.filter(o => o.sourcePath.includes('rules'));
    const knowledge = finalObjects.filter(o => o.sourcePath.includes('knowledge'));
    const memory = finalObjects.filter(o => o.sourcePath.includes('memory'));

    if (rules.length > 0) {
      prompt += `### RULES & POLICIES (Bắt buộc tuân thủ) ###\n`;
      rules.forEach(r => prompt += this.formatObject(r));
    }

    if (knowledge.length > 0) {
      prompt += `### KNOWLEDGE (Kiến thức dự án) ###\n`;
      knowledge.forEach(k => prompt += this.formatObject(k));
    }

    if (memory.length > 0) {
      prompt += `### MEMORY & LEARNINGS (Bài học rút ra) ###\n`;
      memory.forEach(m => prompt += this.formatObject(m));
    }

    prompt += `\n====================================================\n`;
    prompt += `USER TASK: ${originalTask}\n`;
    prompt += `====================================================\n`;

    return prompt;
  }

  private formatObject(obj: ContextObject): string {
    return `\n--- [${obj.metadata.id}] ---\n${obj.content}\n`;
  }
}

```

## File: src/context-manager/RoiAnalyzer.ts
```
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

```

## File: src/context-manager/SecurityGuard.ts
```
export class SecurityGuard {
  /**
   * Redact sensitive information (API Keys, JWTs, Passwords) before sending to LLM.
   */
  public redact(content: string): string {
    let safeContent = content;

    // 1. Redact API Keys (e.g., sk-123456...)
    // Thường dài ít nhất 32 ký tự alphanumeric
    const apiKeyRegex = /sk-[a-zA-Z0-9]{32,}/g;
    safeContent = safeContent.replace(apiKeyRegex, '[REDACTED_API_KEY]');

    // 2. Redact JWT Tokens
    // Cấu trúc: header.payload.signature (base64url)
    const jwtRegex = /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;
    safeContent = safeContent.replace(jwtRegex, '[REDACTED_JWT_TOKEN]');

    // 3. Redact Passwords in code (e.g., password: "secret")
    const passwordRegex = /(password|secret|passwd)\s*[:=]\s*['"]([^'"]+)['"]/gi;
    safeContent = safeContent.replace(passwordRegex, '$1: "[REDACTED_PASSWORD]"');

    return safeContent;
  }
}

```

## File: src/context-manager/SelectorRanker.ts
```
import { ContextObject } from './ContextObject';
import { TaskIntent } from './IntentAnalyzer';
import { DependencyAnalyzer } from './DependencyAnalyzer';

export class SelectorRanker {
  private depAnalyzer = new DependencyAnalyzer();

  /**
   * Chọn và Xếp hạng các Context Objects dựa trên Intent
   */
  public selectAndRank(objects: ContextObject[], intent: TaskIntent): ContextObject[] {
    const scoredObjects = objects.map(obj => {
      let score = obj.metadata.priority || 50;

      // Cộng điểm nếu khớp Domain
      if (obj.metadata.tags) {
        for (const domain of intent.domains) {
          if (obj.metadata.tags.includes(domain)) {
            score += 30; // Trùng domain thì cộng 30 điểm
          }
        }
      }

      // Cộng điểm nếu đây là file Global/Rules bắt buộc
      if (obj.sourcePath.includes('rules\\global.md') || obj.sourcePath.includes('rules/global.md')) {
        score += 1000; // Global rule luôn phải được nạp
      }

      // Ưu tiên cực cao cho hệ thống Trí nhớ (Learnings)
      if (obj.sourcePath.includes('learnings.yaml')) {
        score += 500;
      }

      return { object: obj, score };
    });

    // Thuật toán lan truyền phụ thuộc (Dependency Spread)
    // Nếu một file có điểm cao, những file mà nó phụ thuộc cũng được cộng điểm.
    for (const item of scoredObjects) {
      if (item.score >= 80) { // Chỉ những file quan trọng mới tạo ra lực hút
        const dependencies = this.depAnalyzer.extractDependencies(item.object.content);
        for (const dep of dependencies) {
          const target = scoredObjects.find(t => t.object.sourcePath.includes(dep));
          if (target) {
            target.score += 20; // Kích điểm cho dependency
          }
        }
      }
    }

    // Lọc bỏ những file có điểm quá thấp (dưới mức cơ sở 50) và không khớp domain
    const selected = scoredObjects.filter(item => item.score >= 50);

    // Xếp hạng từ cao xuống thấp
    selected.sort((a, b) => b.score - a.score);

    return selected.map(item => item.object);
  }
}

```

## File: src/context-manager/TokenCompressor.ts
```
export class TokenCompressor {
  public compress(content: string, sourceType: 'code' | 'markdown' | 'yaml'): string {
    let result = content;

    if (sourceType === 'code') {
      result = this.stripComments(result);
      result = this.minifyWhitespace(result);
    } else if (sourceType === 'markdown') {
      result = this.collapseStructuralSections(result);
      result = this.minifyWhitespace(result);
    } else if (sourceType === 'yaml') {
      result = this.minifyWhitespace(result);
    }

    return result;
  }

  private stripComments(content: string): string {
    // Lược bỏ block comments /* */
    let noBlock = content.replace(/\/\*[\s\S]*?\*\//g, '');
    // Lược bỏ line comments // (trừ trường hợp URL như http://)
    let noLine = noBlock.replace(/(?<!:)\/\/.*$/gm, '');
    return noLine;
  }

  private collapseStructuralSections(content: string): string {
    // Gập gọn các section thường chứa quá nhiều text không mang tính logic cao
    const regex = /#+\s*(?:Examples|Ví dụ|Usage|API Response|Demo)[\s\S]*?(?=(?:\n#+ )|$)/gi;
    return content.replace(regex, '\n[... Collapsed section for token efficiency ...]\n');
  }

  private minifyWhitespace(content: string): string {
    // Xóa các dòng trống liên tiếp, chỉ giữ lại tối đa 1 dòng trống
    let minified = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    // Trim khoảng trắng ở đầu và cuối mỗi dòng
    minified = minified.split('\n').map(line => line.trimEnd()).join('\n');
    return minified.trim();
  }
}

```

## File: src/daemon.ts
```
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
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

      let result = `Blast-Radius Analysis cho ${args.filePath} (Depth: ${args.depth || 2})\n`;
      result += `Đã quét ${stats.filesScanned} files, theo dõi ${stats.uniqueDependenciesTracked} dependencies.\n\n`;
      if (impact.tests.length > 0) result += `🧪 Tests bị ảnh hưởng:\n${impact.tests.map((f: string) => `- ${f}`).join('\n')}\n\n`;
      if (impact.direct.length > 0) result += `⚡ Direct Dependents:\n${impact.direct.map((f: string) => `- ${f}`).join('\n')}\n\n`;
      if (impact.indirect.length > 0) result += `🔗 Indirect Dependents:\n${impact.indirect.map((f: string) => `- ${f}`).join('\n')}\n\n`;
      if (impact.tests.length === 0 && impact.direct.length === 0 && impact.indirect.length === 0) {
        result += `✅ File này dường như không bị ai phụ thuộc (Safe to change).`;
      }
      return { content: [{ type: "text", text: result }] };
    } else if (request.params.name === "cxf_pack") {
      const args = request.params.arguments as any;
      const cliPath = path.join(__dirname, 'index.js');
      
      let cmd = `node "${cliPath}" pack`;
      if (args.module) {
        cmd += ` "${args.module}"`;
      }

      try {
        const stdout = execSync(cmd, { cwd: targetDir, encoding: 'utf8' });
        return { content: [{ type: "text", text: `Đã chạy cxf pack thành công:\n${stdout}\nĐường dẫn file: .cxf/knowledge/context_pack.md` }] };
      } catch (e: any) {
        return { content: [{ type: "text", text: `Lỗi khi chạy cxf pack: ${e.message}` }] };
      }
    }

    throw new Error("Tool not found");
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("🚀 CXF Dynamic Context Manager (MCP Server) đang chạy trên stdio");
}

```

## File: src/index.ts
```
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { runDaemon } from './daemon';
import { RoiAnalyzer } from './context-manager/RoiAnalyzer';
import { MemoryManager } from './context-manager/MemoryManager';
import { BlastRadiusAnalyzer } from './context-manager/DependencyAnalyzer';

const program = new Command();

program
  .name('cxf')
  .description('Context Engineering Framework CLI - Dynamic Context Manager')
  .version('3.1.0')
  .showHelpAfterError()
  .showSuggestionAfterError();

/** Helper function to ask Y/N questions */
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

/** Smart Module Discovery */
function discoverModules(targetDir: string): string[] {
  const ignoreList = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'vendor', '.cxf', 'docs', 'public', 'storage', 'tests', 'ci', 'bin', 'scripts', 'resources', 'config', 'database', 'bootstrap']);
  
  const getSubDirs = (dir: string): string[] => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('.') && !ignoreList.has(e.name))
      .map(e => e.name);
  };

  // 1. Core-Dir Priority
  const coreDirs = ['app', 'src', 'lib', 'pkg'];
  for (const core of coreDirs) {
    const corePath = path.join(targetDir, core);
    if (fs.existsSync(corePath)) {
      const modules = getSubDirs(corePath);
      if (modules.length > 0) return modules;
    }
  }

  // 2. Fallback to Root
  return getSubDirs(targetDir);
}

/** Check if file is binary or large lock file */
function isBinaryFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.mp4', '.zip', '.tar', '.gz', '.jar', '.exe', '.dll', '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.wav', '.pyc', '.pyo', '.pyd', '.so', '.dylib', '.class'];
  const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock', 'poetry.lock', 'Gemfile.lock'];
  if (binaryExts.includes(ext)) return true;
  if (lockFiles.includes(path.basename(filename))) return true;
  return false;
}

/** Pack project codebase */
function packProject(targetDir: string, outputFile: string, specificModule?: string) {
  const ignoreList = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'vendor', '.cxf', 'docs', 'public', 'storage', 'tests', 'ci', 'bin', 'scripts', 'resources', 'config', 'database', 'bootstrap', '.idea', '.vscode', '.github']);
  
  let packContent = `# Project Context Pack\nGenerated at: ${new Date().toISOString()}\n\n`;
  let filesPacked = 0;

  const startDir = specificModule ? path.join(targetDir, specificModule) : targetDir;

  function traverse(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue; // ignore all hidden dirs/files
      if (ignoreList.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        if (!isBinaryFile(entry.name)) {
           try {
             const stat = fs.statSync(fullPath);
             if (stat.size > 1024 * 500) continue; // Skip files > 500KB
             const content = fs.readFileSync(fullPath, 'utf-8');
             const relativePath = path.relative(targetDir, fullPath).replace(/\\/g, '/');
             packContent += `\n## File: ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n`;
             filesPacked++;
           } catch (e) {}
        }
      }
    }
  }

  traverse(startDir);
  fs.writeFileSync(outputFile, packContent);
  return filesPacked;
}

// cxf init
program
  .command('init [targetPath]')
  .description('Khởi tạo cấu trúc CXF v3 thông qua 7 Phase thông minh (Smart Init)')
  .option('-y, --yes', 'Tự động duyệt mọi đề xuất, không cần Human-in-the-loop')
  .action(async (targetPath, options) => {
    // Nếu targetPath là object, tức là user không truyền targetPath (do commander pass options vào param cuối)
    if (typeof targetPath === 'object') {
      options = targetPath;
      targetPath = undefined;
    }
    console.log(chalk.blue.bold('\n🚀 CXF Smart Init: Bắt đầu quy trình 7 bước...'));
    const wrapperDir = process.cwd();
    const cxfDir = path.join(wrapperDir, '.cxf');
    const targetDir = targetPath ? path.resolve(wrapperDir, targetPath) : wrapperDir;
    const relativeTarget = targetPath ? path.relative(wrapperDir, targetDir) : undefined;


    // Phase 1: Discovery
    console.log(chalk.cyan('\n[Phase 1/7] Discovery (Khám phá dự án)...'));
    let hasPackageJson = fs.existsSync(path.join(targetDir, 'package.json'));
    let hasGoMod = fs.existsSync(path.join(targetDir, 'go.mod'));
    let hasComposer = fs.existsSync(path.join(targetDir, 'composer.json'));
    
    // Phase 2: Inference
    console.log(chalk.cyan('[Phase 2/7] Architecture Inference (Phân tích Kiến trúc)...'));
    let framework = 'Unknown';
    if (hasPackageJson) framework = 'Node.js/TypeScript';
    if (hasGoMod) framework = 'Golang';
    if (hasComposer) framework = 'PHP/Laravel';
    console.log(`> Detected Stack: ${chalk.green(framework)}`);

    const detectedConventions: { name: string, confidence: number }[] = [];
    const codeStyles: string[] = [];

    // Base package.json detection
    if (hasPackageJson) {
      try {
        const pkgContent = fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8');
        const pkg = JSON.parse(pkgContent);
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        
        if (deps['react']) detectedConventions.push({ name: 'React App', confidence: 0.95 });
        if (deps['next']) detectedConventions.push({ name: 'Next.js App Router', confidence: 0.90 });
        if (deps['express']) detectedConventions.push({ name: 'Express.js Backend', confidence: 0.90 });
        if (deps['@nestjs/core']) detectedConventions.push({ name: 'NestJS Architecture', confidence: 0.95 });
        if (deps['typescript']) detectedConventions.push({ name: 'TypeScript Strict Mode', confidence: 0.90 });
        if (deps['jest']) detectedConventions.push({ name: 'Jest Testing', confidence: 0.85 });
      } catch (e) {}
    }

    // Python Detection
    if (fs.existsSync(path.join(targetDir, 'requirements.txt')) || fs.existsSync(path.join(targetDir, 'pyproject.toml'))) {
      framework = 'Python Backend';
      detectedConventions.push({ name: 'Python Backend', confidence: 0.85 });
      try {
        const req = fs.readFileSync(path.join(targetDir, 'requirements.txt'), 'utf-8');
        if (req.includes('Django')) detectedConventions.push({ name: 'Django Framework', confidence: 0.9 });
        if (req.includes('fastapi')) detectedConventions.push({ name: 'FastAPI', confidence: 0.9 });
      } catch (e) {}
    }

    // Deep Architecture Inference
    if (framework === 'PHP/Laravel') {
      detectedConventions.push({ name: 'Laravel/PHP MVC', confidence: 0.8 });
      if (fs.existsSync(path.join(targetDir, 'app', 'Services'))) detectedConventions.push({ name: 'Service Pattern (Thin Controllers, Fat Services)', confidence: 0.95 });
      if (fs.existsSync(path.join(targetDir, 'app', 'Repositories'))) detectedConventions.push({ name: 'Repository Pattern', confidence: 0.95 });
      if (fs.existsSync(path.join(targetDir, 'app', 'Http', 'Livewire'))) detectedConventions.push({ name: 'Livewire Components', confidence: 0.95 });
      if (fs.existsSync(path.join(targetDir, 'resources', 'js', 'Pages'))) detectedConventions.push({ name: 'Inertia.js Frontend', confidence: 0.95 });
    }

    if (framework === 'Node.js/TypeScript') {
      if (fs.existsSync(path.join(targetDir, 'src', 'controllers')) && fs.existsSync(path.join(targetDir, 'src', 'services'))) {
        detectedConventions.push({ name: 'Controller-Service Layered Architecture', confidence: 0.9 });
      }
      if (fs.existsSync(path.join(targetDir, 'src', 'graphql'))) {
        detectedConventions.push({ name: 'GraphQL API', confidence: 0.9 });
      }
    }

    if (framework === 'Golang') {
      detectedConventions.push({ name: 'Golang Standard Layout', confidence: 0.8 });
      if (fs.existsSync(path.join(targetDir, 'cmd')) && fs.existsSync(path.join(targetDir, 'internal'))) {
        detectedConventions.push({ name: 'Golang Standard Project Layout', confidence: 0.95 });
      }
    }

    // Phase 3 & 4: Module & Convention Detection
    console.log(chalk.cyan('\n[Phase 3 & 4/7] Module & Convention Detection...'));
    const detectedModules = discoverModules(targetDir);
    
    if (detectedModules.length > 0) {
      console.log(chalk.green(`✅ Đã tìm thấy ${detectedModules.length} modules tiềm năng.`));
    } else {
      console.log(chalk.yellow(`⚠️ Không tìm thấy thư mục module nào.`));
    }

    // Extract Prettier
    if (fs.existsSync(path.join(targetDir, '.prettierrc'))) {
      try {
        const prettier = JSON.parse(fs.readFileSync(path.join(targetDir, '.prettierrc'), 'utf-8'));
        if (prettier.semi === false) codeStyles.push('Cấm sử dụng dấu chấm phẩy (semi: false).');
        if (prettier.singleQuote === true) codeStyles.push('Sử dụng dấu nháy đơn (singleQuotes: true) cho chuỗi.');
        if (prettier.tabWidth) codeStyles.push(`Thụt lề bằng ${prettier.tabWidth} spaces.`);
      } catch (e) {}
    }

    // Extract TSConfig
    if (fs.existsSync(path.join(targetDir, 'tsconfig.json'))) {
      try {
        const tsconfigStr = fs.readFileSync(path.join(targetDir, 'tsconfig.json'), 'utf-8');
        if (/"strict"\s*:\s*true/.test(tsconfigStr)) {
          codeStyles.push('TypeScript Strict Mode đang BẬT. Tuyệt đối không dùng kiểu `any`. Phải khai báo interface/type rõ ràng.');
        }
      } catch (e) {}
    }

    if (!fs.existsSync(cxfDir)) fs.mkdirSync(cxfDir);
    const knowledgeDir = path.join(cxfDir, 'knowledge');
    const skillsDir = path.join(cxfDir, 'skills');
    
    if (!fs.existsSync(knowledgeDir)) fs.mkdirSync(knowledgeDir, { recursive: true });
    if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });
    if (!fs.existsSync(path.join(cxfDir, 'rules'))) fs.mkdirSync(path.join(cxfDir, 'rules'), { recursive: true });
    if (!fs.existsSync(path.join(cxfDir, '.cache'))) fs.mkdirSync(path.join(cxfDir, '.cache'), { recursive: true });

    // Phase 5: Knowledge Generation (In Memory & Packing)
    console.log(chalk.cyan('\n[Phase 5/7] Knowledge Generation (Tiến hành thu thập)...'));
    console.log(chalk.dim('Đang tự động gom (pack) mã nguồn...'));
    const packFile = path.join(knowledgeDir, 'context_pack.md');
    const filesPacked = packProject(targetDir, packFile);
    console.log(chalk.green(`✅ Đã đóng gói ${filesPacked} files vào context_pack.md`));
    
    // Phase 6: Human Review (or Auto)
    console.log(chalk.magenta.bold('\n[Phase 6/7] Review:'));
    
    const finalConventions: string[] = [];
    if (options.yes) {
      console.log(chalk.yellow('⚠️  Chạy chế độ Tự động (Non-human-loop). AI sẽ duyệt mọi thứ!'));
      for (const conv of detectedConventions) {
        console.log(`✅ Đã tự động chấp nhận: ${conv.name}`);
        finalConventions.push(conv.name);
      }
    } else {
      if (detectedConventions.length === 0) {
        console.log('Không phát hiện được Convention đặc thù nào (Có thể là Vanilla project).');
      } else {
        console.log('AI đã phân tích cấu trúc dự án thực tế:');
        for (const conv of detectedConventions) {
          if (conv.confidence >= 0.9) {
            console.log(`✅ Tự động duyệt: ${conv.name} (Tự tin: ${conv.confidence * 100}%)`);
            finalConventions.push(conv.name);
          } else {
            const answer = await askQuestion(`❓ Phát hiện: ${chalk.yellow(conv.name)} (Độ tin cậy: ${Math.round(conv.confidence * 100)}%) - Có đúng không? [Y/n] `);
            if (answer.toLowerCase() === 'y' || answer === '') {
              finalConventions.push(conv.name);
            }
          }
        }
      }
    }

    // Phase 7: Publish
    console.log(chalk.cyan('\n[Phase 7/7] Publish (Xuất bản Knowledge Objects & Skills)...'));
    
    // Ghi các Knowledge Objects (YAML) thay vì Markdown
    const architectureYaml = `id: architecture
title: System Architecture
priority: 900
tags: [architecture, core]
framework: ${framework}
conventions:
${finalConventions.length > 0 ? finalConventions.map(c => `  - ${c}`).join('\n') : '  - Standard'}
`;
    fs.writeFileSync(path.join(knowledgeDir, 'architecture.yaml'), architectureYaml);

    if (detectedModules.length > 0) {
      const modulesYaml = `id: modules
title: System Modules
priority: 800
tags: [modules]
modules:
${detectedModules.map(m => `  - ${m}`).join('\n')}
`;
      fs.writeFileSync(path.join(knowledgeDir, 'modules.yaml'), modulesYaml);
    }
    const configData: any = { version: "3.1.0" };
    if (relativeTarget) {
      configData.targetRepoPath = relativeTarget;
    }
    fs.writeFileSync(path.join(cxfDir, 'config.json'), JSON.stringify(configData, null, 2));

    // Tự động sinh Project-specific Rules (rules/global.md)
    let globalRules = `---
id: global-rules
title: Dự án Global Rules
priority: 1000
type: rule
tags: [rules, guardrails]
---
# Global Guardrails & Best Practices\n\n`;
    
    globalRules += `## 1. Security & Clean Code (Mặc định)\n`;
    globalRules += `- Tuyệt đối không hardcode API Keys, Passwords, hay Secrets vào source code.\n`;
    globalRules += `- Viết code sạch, chia nhỏ hàm, đặt tên biến rõ ràng bằng tiếng Anh.\n\n`;

    let ruleIndex = 2;
    if (finalConventions.includes('Next.js App Router')) {
      globalRules += `## ${ruleIndex++}. Next.js App Router\n`;
      globalRules += `- Mặc định mọi component là Server Component. Chỉ thêm \`"use client"\` khi thực sự cần thiết (dùng hooks, DOM).\n`;
      globalRules += `- Fetch data trên server-side ưu tiên dùng \`fetch\` API chuẩn của Next.js.\n\n`;
    }
    
    if (finalConventions.includes('React App')) {
      globalRules += `## ${ruleIndex++}. React Best Practices\n`;
      globalRules += `- Sử dụng Functional Components và Hooks.\n`;
      globalRules += `- Tối ưu hóa render dư thừa bằng \`useMemo\` hoặc \`useCallback\` khi truyền prop cho child.\n\n`;
    }

    if (finalConventions.includes('Express.js Backend')) {
      globalRules += `## ${ruleIndex++}. Express.js Backend\n`;
      globalRules += `- Sử dụng Global Error Handling middleware.\n`;
      globalRules += `- Luôn trả về response chuẩn JSON (ví dụ: \`{ status, data, message }\`).\n\n`;
    }

    if (finalConventions.includes('NestJS Architecture')) {
      globalRules += `## ${ruleIndex++}. NestJS Architecture\n`;
      globalRules += `- Tuân thủ Dependency Injection triệt để.\n`;
      globalRules += `- Không viết business logic trong Controller. Controller chỉ gọi Service.\n\n`;
    }

    if (finalConventions.includes('TypeScript Strict Mode')) {
      globalRules += `## ${ruleIndex++}. TypeScript Strict Mode\n`;
      globalRules += `- Cấm tuyệt đối sử dụng kiểu \`any\`. Hãy định nghĩa \`interface\` hoặc \`type\` rõ ràng.\n`;
      globalRules += `- Tận dụng Optional Chaining (\`?.\`) và Nullish Coalescing (\`??\`).\n\n`;
    }

    if (finalConventions.includes('Python Backend')) {
      globalRules += `## ${ruleIndex++}. Python Best Practices\n`;
      globalRules += `- Tuân thủ PEP-8. Sử dụng type hints cho các hàm.\n`;
      globalRules += `- Viết docstring cho các class/method phức tạp.\n\n`;
    }

    if (finalConventions.includes('Django Framework')) {
      globalRules += `## ${ruleIndex++}. Django Architecture\n`;
      globalRules += `- Không viết logic vào Views, hãy đưa logic vào Services hoặc Models (Fat Models, Thin Views).\n`;
      globalRules += `- Tránh N+1 queries bằng cách sử dụng \`select_related\` và \`prefetch_related\`. \n\n`;
    }

    if (finalConventions.includes('Golang Standard Layout')) {
      globalRules += `## ${ruleIndex++}. Golang Best Practices\n`;
      globalRules += `- Luôn chạy \`go fmt\` trước khi hoàn thành code.\n`;
      globalRules += `- Xử lý error dứt khoát bằng \`if err != nil\`, không dùng panic bừa bãi.\n\n`;
    }

    if (finalConventions.includes('Laravel/PHP MVC')) {
      globalRules += `## ${ruleIndex++}. Laravel Best Practices\n`;
      globalRules += `- Sử dụng Eloquent đúng chuẩn, tránh viết raw SQL.\n`;
      globalRules += `- Inject dependencies thông qua constructor thay vì gọi trực tiếp từ Service Container.\n\n`;
    }

    if (finalConventions.includes('Service Pattern (Thin Controllers, Fat Services)')) {
      globalRules += `## ${ruleIndex++}. Service Pattern\n`;
      globalRules += `- Controller tuyệt đối không chứa business logic, chỉ xử lý Request/Response.\n`;
      globalRules += `- Mọi logic tính toán, gọi external API, xử lý phức tạp phải đặt trong thư mục Services/.\n\n`;
    }

    if (finalConventions.includes('Repository Pattern')) {
      globalRules += `## ${ruleIndex++}. Repository Pattern\n`;
      globalRules += `- Service không tương tác trực tiếp với Database/Eloquent Model.\n`;
      globalRules += `- Mọi logic Query (where, join, order) phải nằm trong Repository.\n\n`;
    }

    if (codeStyles.length > 0) {
      globalRules += `## ${ruleIndex++}. Code Style & Conventions (Auto-detected)\n`;
      for (const style of codeStyles) {
        globalRules += `- ${style}\n`;
      }
      globalRules += `\n`;
    }

    fs.writeFileSync(path.join(cxfDir, 'rules', 'global.md'), globalRules);

    // Sinh 4 Kỹ năng Mặc định (Default Skills)
    const planSkill = `---
id: plan-task
title: Quy trình Lên Kế hoạch Task
priority: 960
type: skill
triggers: [plan, design, architecture, propose]
---
# Hướng dẫn Lên Kế hoạch Task (Planning)
1. BẮT BUỘC ĐẦU TIÊN: Gọi MCP Tool \`cxf_get_optimized_context\` (hoặc phân tích context tương tự) với từ khóa nhiệm vụ để lấy bối cảnh kiến trúc/mã nguồn trước khi nghĩ.
2. Tuyệt đối KHÔNG viết code ở bước này.
3. Đọc lướt yêu cầu người dùng và các Knowledge Objects liên quan.
4. Phác thảo kế hoạch triển khai (Implementation Plan) chia thành các bước nhỏ gọn.
5. Dừng lại và chờ người dùng duyệt kế hoạch trước khi chuyển sang kỹ năng \`implement-task\`.
`;
    fs.writeFileSync(path.join(skillsDir, 'plan-task.md'), planSkill);

    const taskSkill = `---
id: implement-task
title: Quy trình Làm Task
priority: 950
type: skill
triggers: [implement, build, create, task, feature]
---
# Hướng dẫn Xây dựng Tính năng (Làm Task)
1. BẮT BUỘC ĐẦU TIÊN: Gọi MCP Tool \`cxf_get_optimized_context\` để xin cấp phát bộ ngữ cảnh (context) đầy đủ cho task này nếu chưa có.
2. Đọc kỹ yêu cầu (Intent) và Context được trả về.
3. Không bắt đầu viết code ngay. Hãy phác thảo kiến trúc nhỏ (Draft) trước nếu task phức tạp.
4. Viết code tuần tự, đảm bảo chạy linter hoặc test sau mỗi thay đổi lớn.
5. Nhớ gọi Tool \`cxf_learn_context\` nếu bạn vừa giải quyết một bug khó hoặc chốt một quy ước mới để dạy lại cho AI.
6. Cập nhật Knowledge Object (chạy \`cxf sync\`) nếu bạn vừa thêm module mới.
`;
    fs.writeFileSync(path.join(skillsDir, 'implement-task.md'), taskSkill);

    const reviewSkill = `---
id: code-review
title: Quy trình Code Review
priority: 900
type: skill
triggers: [review, audit, pr, check]
---
# Hướng dẫn Code Review
1. Đọc lướt các file bị thay đổi.
2. Kiểm tra các lỗi bảo mật (đảm bảo không hardcode secret).
3. Đánh giá Big-O (độ phức tạp thuật toán) của các vòng lặp.
4. So sánh với Convention trong \`architecture.yaml\`.
5. Đề xuất refactor (nếu có).
`;
    fs.writeFileSync(path.join(skillsDir, 'code-review.md'), reviewSkill);

    const testSkill = `---
id: write-tests
title: Quy trình Viết Tests
priority: 850
type: skill
triggers: [test, coverage, jest, unit test]
---
# Hướng dẫn Viết Unit Tests
1. Đọc hiểu logic của hàm cần test.
2. Viết các test case cho Happy Path.
3. Viết các test case cho Edge Cases (dữ liệu rỗng, undefined, sai kiểu).
4. Sử dụng Mock cho mọi tương tác IO/Database/Network.
`;
    fs.writeFileSync(path.join(skillsDir, 'write-tests.md'), testSkill);

    console.log(chalk.green.bold('🎉 Khởi tạo hoàn tất! Knowledge Objects và Skills đã được tạo trong .cxf/'));
  });

// cxf sync
program
  .command('sync')
  .description('Đồng bộ tăng dần (Incremental Sync) khi có file/module mới')
  .action(() => {
    console.log(chalk.blue('🔄 Đang chạy đồng bộ tăng dần (Sync)...'));
    const wrapperDir = process.cwd();
    const cxfDir = path.join(wrapperDir, '.cxf');
    let targetDir = wrapperDir;
    
    const configPath = path.join(cxfDir, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.targetRepoPath) {
        targetDir = path.resolve(wrapperDir, config.targetRepoPath);
      }
    }
    
    console.log(chalk.dim(`Quét hệ thống file tại ${targetDir}...`));
    const knowledgeDir = path.join(cxfDir, 'knowledge');
    
    if (!fs.existsSync(targetDir)) {
      console.log(chalk.yellow(`⚠️  Không tìm thấy thư mục ${targetDir}. Bỏ qua việc quét module.`));
      return;
    }
    if (!fs.existsSync(knowledgeDir)) {
      fs.mkdirSync(knowledgeDir, { recursive: true });
    }
    
    const modules = discoverModules(targetDir);
    
    if (modules.length > 0) {
      console.log(chalk.green(`✅ Phát hiện ${modules.length} module: ${modules.join(', ')}`));
      const syncYaml = `id: sync_modules\ntitle: Dynamically Synced Modules\npriority: 700\ntags: [sync, auto]\nmodules:\n${modules.map(m => `  - ${m}`).join('\n')}\n`;
      fs.writeFileSync(path.join(knowledgeDir, 'sync_modules.yaml'), syncYaml);
      console.log(chalk.green('✅ Đã cập nhật sync_modules.yaml vào Knowledge Registry.'));
    } else {
      console.log(chalk.yellow('ℹ️  Không phát hiện thư mục con nào trong src/.'));
    }
    console.log('Hoàn tất quá trình đồng bộ ngữ cảnh.');
  });

// cxf pack
program
  .command('pack [module]')
  .description('Gom toàn bộ mã nguồn của dự án (hoặc một module) thành một file context duy nhất cho AI')
  .action((module?: string) => {
    console.log(chalk.blue('📦 Đang tiến hành gom (pack) mã nguồn...'));
    const wrapperDir = process.cwd();
    const cxfDir = path.join(wrapperDir, '.cxf');
    let targetDir = wrapperDir;
    
    const configPath = path.join(cxfDir, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.targetRepoPath) {
        targetDir = path.resolve(wrapperDir, config.targetRepoPath);
      }
    }

    const knowledgeDir = path.join(cxfDir, 'knowledge');
    if (!fs.existsSync(knowledgeDir)) fs.mkdirSync(knowledgeDir, { recursive: true });
    
    const outputFile = path.join(knowledgeDir, 'context_pack.md');
    const filesPacked = packProject(targetDir, outputFile, module);
    console.log(chalk.green(`✅ Đã đóng gói thành công ${filesPacked} files vào ${outputFile}`));
  });

// cxf roi
program
  .command('roi')
  .description('Tính toán tỷ suất hoàn vốn (Context ROI) của hệ thống ngữ cảnh')
  .action(() => {
    const targetDir = process.cwd();
    const cxfDir = path.join(targetDir, '.cxf');
    const analyzer = new RoiAnalyzer(cxfDir);
    analyzer.runAnalysis();
  });

// cxf learn <domain> <content>
program
  .command('learn <domain> <content>')
  .description('Lưu trữ một bài học hoặc trí nhớ (Learning) vào hệ thống (vd: cxf learn auth "Luôn truyền x-api-key")')
  .action((domain: string, content: string) => {
    const targetDir = process.cwd();
    const cxfDir = path.join(targetDir, '.cxf');
    const manager = new MemoryManager(cxfDir);
    manager.learn(domain, content);
    console.log(chalk.green(`✅ Đã lưu trí nhớ cho domain [${domain}]: "${content}"`));
  });

// cxf skill create <name>
const skillCommand = program
  .command('skill')
  .description('Quản lý hệ thống Kỹ năng (Skills) - Cho phép tạo và tùy chỉnh các kỹ năng AI');

skillCommand
  .command('create <name>')
  .description('Tạo một mẫu kỹ năng (Skill) mới với YAML Frontmatter')
  .action((name: string) => {
    const targetDir = process.cwd();
    const skillsDir = path.join(targetDir, '.cxf', 'skills');
    
    if (!fs.existsSync(skillsDir)) {
      console.log(chalk.red('❌ Không tìm thấy thư mục .cxf/skills/. Hãy chạy cxf init trước.'));
      return;
    }

    const filename = name.endsWith('.md') ? name : `${name}.md`;
    const filePath = path.join(skillsDir, filename);

    if (fs.existsSync(filePath)) {
      console.log(chalk.yellow(`⚠️ Kỹ năng ${filename} đã tồn tại.`));
      return;
    }

    const template = `---
id: ${name.replace('.md', '')}
title: Quy trình ${name.replace('.md', '')}
priority: 500
type: skill
triggers: [${name.replace('.md', '')}]
---
# Hướng dẫn ${name.replace('.md', '')}
1. Bước 1: Phân tích...
2. Bước 2: Thực thi...
3. Bước 3: Kiểm tra...
`;

    fs.writeFileSync(filePath, template);
    console.log(chalk.green(`✅ Đã tạo thành công mẫu kỹ năng tại: .cxf/skills/${filename}`));
  });

// cxf daemon
const daemonCommand = program
  .command('daemon')
  .description('Quản lý Máy chủ CXF MCP - Khởi động và quản lý tiến trình nền cho các tính năng Agentic');

daemonCommand
  .command('start')
  .description('Chạy máy chủ CXF trên stdio để kết nối với AI')
  .action(async () => {
    await runDaemon();
  });

// cxf impact
program
  .command('impact <filePath>')
  .description('Phân tích bán kính ảnh hưởng (Blast-Radius) của một file')
  .option('-d, --depth <number>', 'Độ sâu phân tích', '2')
  .action((filePath: string, options: { depth: string }) => {
    const wrapperDir = process.cwd();
    const cxfDir = path.join(wrapperDir, '.cxf');
    let targetDir = wrapperDir;
    
    const configPath = path.join(cxfDir, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.targetRepoPath) {
        targetDir = path.resolve(wrapperDir, config.targetRepoPath);
      }
    }

    if (!fs.existsSync(targetDir)) {
      console.log(chalk.red(`❌ Không tìm thấy thư mục tại ${targetDir}.`));
      return;
    }

    console.log(chalk.blue(`💥 Đang phân tích Blast-Radius cho: ${chalk.bold(filePath)}...`));
    const analyzer = new BlastRadiusAnalyzer(targetDir);
    analyzer.buildGraph();

    const depth = parseInt(options.depth) || 2;
    const impact = analyzer.getImpactRadius(filePath, depth);
    const stats = analyzer.getStats();

    console.log(chalk.dim(`Đã quét ${stats.filesScanned} files, theo dõi ${stats.uniqueDependenciesTracked} dependencies.`));
    
    if (impact.tests.length > 0) {
      console.log(chalk.green.bold(`\n🧪 Tests bị ảnh hưởng (${impact.tests.length}):`));
      impact.tests.forEach(f => console.log(`  - ${f}`));
    }
    
    if (impact.direct.length > 0) {
      console.log(chalk.yellow.bold(`\n⚡ Direct Dependents (Gọi trực tiếp) (${impact.direct.length}):`));
      impact.direct.forEach(f => console.log(`  - ${f}`));
    }

    if (impact.indirect.length > 0) {
      console.log(chalk.yellow(`\n🔗 Indirect Dependents (Bị ảnh hưởng gián tiếp) (${impact.indirect.length}):`));
      impact.indirect.forEach(f => console.log(`  - ${f}`));
    }

    if (impact.tests.length === 0 && impact.direct.length === 0 && impact.indirect.length === 0) {
      console.log(chalk.green('✅ File này dường như không bị ai phụ thuộc (Safe to change).'));
    }
  });

program.parse(process.argv);

```

## File: test_context.js
```
const { ContextManager } = require('./dist/context-manager/ContextManager');
const path = require('path');

const mgr = new ContextManager();
const cxfDir = path.join(__dirname, '.cxf');
const prompt = mgr.getOptimizedContext('I want to fix the auth logic', 5000, cxfDir);
console.log('Prompt Generated length:', prompt.length);

```

## File: tsconfig.json
```
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": [
      "node"
    ]
  }
}
```
