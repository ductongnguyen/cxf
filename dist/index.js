#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const daemon_1 = require("./daemon");
const RoiAnalyzer_1 = require("./context-manager/RoiAnalyzer");
const MemoryManager_1 = require("./context-manager/MemoryManager");
const DependencyAnalyzer_1 = require("./context-manager/DependencyAnalyzer");
const program = new commander_1.Command();
program
    .name('cxf')
    .description('Context Engineering Framework CLI - Dynamic Context Manager')
    .version('3.1.0')
    .showHelpAfterError()
    .showSuggestionAfterError();
/** Helper function to ask Y/N questions */
function askQuestion(query) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
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
    console.log(chalk_1.default.blue.bold('\n🚀 CXF Smart Init: Bắt đầu quy trình 7 bước...'));
    const wrapperDir = process.cwd();
    const cxfDir = path_1.default.join(wrapperDir, '.cxf');
    const targetDir = targetPath ? path_1.default.resolve(wrapperDir, targetPath) : wrapperDir;
    const relativeTarget = targetPath ? path_1.default.relative(wrapperDir, targetDir) : undefined;
    // Phase 1: Discovery
    console.log(chalk_1.default.cyan('\n[Phase 1/7] Discovery (Khám phá dự án)...'));
    let hasPackageJson = fs_1.default.existsSync(path_1.default.join(targetDir, 'package.json'));
    let hasGoMod = fs_1.default.existsSync(path_1.default.join(targetDir, 'go.mod'));
    let hasComposer = fs_1.default.existsSync(path_1.default.join(targetDir, 'composer.json'));
    // Phase 2: Inference
    console.log(chalk_1.default.cyan('[Phase 2/7] Architecture Inference (Phân tích Kiến trúc)...'));
    let framework = 'Unknown';
    if (hasPackageJson)
        framework = 'Node.js/TypeScript';
    if (hasGoMod)
        framework = 'Golang';
    if (hasComposer)
        framework = 'PHP/Laravel';
    console.log(`> Detected Stack: ${chalk_1.default.green(framework)}`);
    // Phase 3 & 4: Module & Convention Detection
    console.log(chalk_1.default.cyan('[Phase 3 & 4/7] Module & Convention Detection...'));
    const detectedModules = [];
    const detectedConventions = [];
    // Real Module Detection
    const possibleSrcDirs = ['src', 'app', 'lib', 'pkg', 'cmd'];
    for (const dir of possibleSrcDirs) {
        const fullPath = path_1.default.join(targetDir, dir);
        if (fs_1.default.existsSync(fullPath)) {
            const entries = fs_1.default.readdirSync(fullPath, { withFileTypes: true });
            const subDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
            detectedModules.push(...subDirs);
        }
    }
    // Real Convention Inference & Code Style Extraction
    const codeStyles = [];
    if (hasPackageJson) {
        try {
            const pkgContent = fs_1.default.readFileSync(path_1.default.join(targetDir, 'package.json'), 'utf-8');
            const pkg = JSON.parse(pkgContent);
            const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            if (deps['react'])
                detectedConventions.push({ name: 'React App', confidence: 0.95 });
            if (deps['next'])
                detectedConventions.push({ name: 'Next.js App Router', confidence: 0.90 });
            if (deps['express'])
                detectedConventions.push({ name: 'Express.js Backend', confidence: 0.90 });
            if (deps['@nestjs/core'])
                detectedConventions.push({ name: 'NestJS Architecture', confidence: 0.95 });
            if (deps['typescript'])
                detectedConventions.push({ name: 'TypeScript Strict Mode', confidence: 0.90 });
            if (deps['jest'])
                detectedConventions.push({ name: 'Jest Testing', confidence: 0.85 });
        }
        catch (e) { }
    }
    if (hasComposer) {
        detectedConventions.push({ name: 'Laravel/PHP MVC', confidence: 0.8 });
    }
    // Python Detection
    if (fs_1.default.existsSync(path_1.default.join(targetDir, 'requirements.txt')) || fs_1.default.existsSync(path_1.default.join(targetDir, 'pyproject.toml'))) {
        detectedConventions.push({ name: 'Python Backend', confidence: 0.85 });
        try {
            const req = fs_1.default.readFileSync(path_1.default.join(targetDir, 'requirements.txt'), 'utf-8');
            if (req.includes('Django'))
                detectedConventions.push({ name: 'Django Framework', confidence: 0.9 });
            if (req.includes('fastapi'))
                detectedConventions.push({ name: 'FastAPI', confidence: 0.9 });
        }
        catch (e) { }
    }
    // Go Detection
    if (fs_1.default.existsSync(path_1.default.join(targetDir, 'go.mod'))) {
        detectedConventions.push({ name: 'Golang Standard Layout', confidence: 0.9 });
    }
    // Extract Prettier
    if (fs_1.default.existsSync(path_1.default.join(targetDir, '.prettierrc'))) {
        try {
            const prettier = JSON.parse(fs_1.default.readFileSync(path_1.default.join(targetDir, '.prettierrc'), 'utf-8'));
            if (prettier.semi === false)
                codeStyles.push('Cấm sử dụng dấu chấm phẩy (semi: false).');
            if (prettier.singleQuote === true)
                codeStyles.push('Sử dụng dấu nháy đơn (singleQuotes: true) cho chuỗi.');
            if (prettier.tabWidth)
                codeStyles.push(`Thụt lề bằng ${prettier.tabWidth} spaces.`);
        }
        catch (e) { }
    }
    // Extract TSConfig
    if (fs_1.default.existsSync(path_1.default.join(targetDir, 'tsconfig.json'))) {
        try {
            const tsconfigStr = fs_1.default.readFileSync(path_1.default.join(targetDir, 'tsconfig.json'), 'utf-8');
            if (/"strict"\s*:\s*true/.test(tsconfigStr)) {
                codeStyles.push('TypeScript Strict Mode đang BẬT. Tuyệt đối không dùng kiểu `any`. Phải khai báo interface/type rõ ràng.');
            }
        }
        catch (e) { }
    }
    // Phase 5: Knowledge Generation (In Memory)
    console.log(chalk_1.default.cyan('[Phase 5/7] Knowledge Generation (Tiến hành thu thập)...'));
    // Phase 6: Human Review (or Auto)
    console.log(chalk_1.default.magenta.bold('\n[Phase 6/7] Review:'));
    const finalConventions = [];
    if (options.yes) {
        console.log(chalk_1.default.yellow('⚠️  Chạy chế độ Tự động (Non-human-loop). AI sẽ duyệt mọi thứ!'));
        for (const conv of detectedConventions) {
            console.log(`✅ Đã tự động chấp nhận: ${conv.name}`);
            finalConventions.push(conv.name);
        }
    }
    else {
        if (detectedConventions.length === 0) {
            console.log('Không phát hiện được Convention đặc thù nào (Có thể là Vanilla project).');
        }
        else {
            console.log('AI đã phân tích cấu trúc dự án thực tế:');
            for (const conv of detectedConventions) {
                if (conv.confidence >= 0.9) {
                    console.log(`✅ Tự động duyệt: ${conv.name} (Tự tin: ${conv.confidence * 100}%)`);
                    finalConventions.push(conv.name);
                }
                else {
                    const answer = await askQuestion(`❓ Phát hiện: ${chalk_1.default.yellow(conv.name)} (Độ tin cậy: ${Math.round(conv.confidence * 100)}%) - Có đúng không? [Y/n] `);
                    if (answer.toLowerCase() === 'y' || answer === '') {
                        finalConventions.push(conv.name);
                    }
                }
            }
        }
    }
    // Phase 7: Publish
    console.log(chalk_1.default.cyan('\n[Phase 7/7] Publish (Xuất bản Knowledge Objects & Skills)...'));
    if (!fs_1.default.existsSync(cxfDir))
        fs_1.default.mkdirSync(cxfDir);
    const knowledgeDir = path_1.default.join(cxfDir, 'knowledge');
    const skillsDir = path_1.default.join(cxfDir, 'skills');
    if (!fs_1.default.existsSync(knowledgeDir))
        fs_1.default.mkdirSync(knowledgeDir);
    if (!fs_1.default.existsSync(skillsDir))
        fs_1.default.mkdirSync(skillsDir);
    if (!fs_1.default.existsSync(path_1.default.join(cxfDir, 'rules')))
        fs_1.default.mkdirSync(path_1.default.join(cxfDir, 'rules'));
    if (!fs_1.default.existsSync(path_1.default.join(cxfDir, '.cache')))
        fs_1.default.mkdirSync(path_1.default.join(cxfDir, '.cache'));
    // Ghi các Knowledge Objects (YAML) thay vì Markdown
    const architectureYaml = `id: architecture
title: System Architecture
priority: 900
tags: [architecture, core]
framework: ${framework}
conventions:
${finalConventions.length > 0 ? finalConventions.map(c => `  - ${c}`).join('\n') : '  - Standard'}
`;
    fs_1.default.writeFileSync(path_1.default.join(knowledgeDir, 'architecture.yaml'), architectureYaml);
    if (detectedModules.length > 0) {
        const modulesYaml = `id: modules
title: System Modules
priority: 800
tags: [modules]
modules:
${detectedModules.map(m => `  - ${m}`).join('\n')}
`;
        fs_1.default.writeFileSync(path_1.default.join(knowledgeDir, 'modules.yaml'), modulesYaml);
    }
    const configData = { version: "3.1.0" };
    if (relativeTarget) {
        configData.targetRepoPath = relativeTarget;
    }
    fs_1.default.writeFileSync(path_1.default.join(cxfDir, 'config.json'), JSON.stringify(configData, null, 2));
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
        globalRules += `- Tránh N+1 queries bằng cách sử dụng \`select_related\` và \`prefetch_related\`.\n\n`;
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
    if (codeStyles.length > 0) {
        globalRules += `## ${ruleIndex++}. Code Style & Conventions (Auto-detected)\n`;
        for (const style of codeStyles) {
            globalRules += `- ${style}\n`;
        }
        globalRules += `\n`;
    }
    fs_1.default.writeFileSync(path_1.default.join(cxfDir, 'rules', 'global.md'), globalRules);
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
    fs_1.default.writeFileSync(path_1.default.join(skillsDir, 'plan-task.md'), planSkill);
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
    fs_1.default.writeFileSync(path_1.default.join(skillsDir, 'implement-task.md'), taskSkill);
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
    fs_1.default.writeFileSync(path_1.default.join(skillsDir, 'code-review.md'), reviewSkill);
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
    fs_1.default.writeFileSync(path_1.default.join(skillsDir, 'write-tests.md'), testSkill);
    console.log(chalk_1.default.green.bold('🎉 Khởi tạo hoàn tất! Knowledge Objects và Skills đã được tạo trong .cxf/'));
});
// cxf sync
program
    .command('sync')
    .description('Đồng bộ tăng dần (Incremental Sync) khi có file/module mới')
    .action(() => {
    console.log(chalk_1.default.blue('🔄 Đang chạy đồng bộ tăng dần (Sync)...'));
    const wrapperDir = process.cwd();
    const cxfDir = path_1.default.join(wrapperDir, '.cxf');
    let targetDir = wrapperDir;
    const configPath = path_1.default.join(cxfDir, 'config.json');
    if (fs_1.default.existsSync(configPath)) {
        const config = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
        if (config.targetRepoPath) {
            targetDir = path_1.default.resolve(wrapperDir, config.targetRepoPath);
        }
    }
    const srcDir = path_1.default.join(targetDir, 'src');
    console.log(chalk_1.default.dim(`Quét hệ thống file tại ${srcDir}...`));
    const knowledgeDir = path_1.default.join(cxfDir, 'knowledge');
    if (!fs_1.default.existsSync(srcDir)) {
        console.log(chalk_1.default.yellow('⚠️  Không tìm thấy thư mục src/. Bỏ qua việc quét module.'));
        return;
    }
    if (!fs_1.default.existsSync(knowledgeDir)) {
        fs_1.default.mkdirSync(knowledgeDir, { recursive: true });
    }
    const entries = fs_1.default.readdirSync(srcDir, { withFileTypes: true });
    const modules = entries.filter(e => e.isDirectory()).map(e => e.name);
    if (modules.length > 0) {
        console.log(chalk_1.default.green(`✅ Phát hiện ${modules.length} module: ${modules.join(', ')}`));
        const syncYaml = `id: sync_modules\ntitle: Dynamically Synced Modules\npriority: 700\ntags: [sync, auto]\nmodules:\n${modules.map(m => `  - ${m}`).join('\n')}\n`;
        fs_1.default.writeFileSync(path_1.default.join(knowledgeDir, 'sync_modules.yaml'), syncYaml);
        console.log(chalk_1.default.green('✅ Đã cập nhật sync_modules.yaml vào Knowledge Registry.'));
    }
    else {
        console.log(chalk_1.default.yellow('ℹ️  Không phát hiện thư mục con nào trong src/.'));
    }
    console.log('Hoàn tất quá trình đồng bộ ngữ cảnh.');
});
// cxf roi
program
    .command('roi')
    .description('Tính toán tỷ suất hoàn vốn (Context ROI) của hệ thống ngữ cảnh')
    .action(() => {
    const targetDir = process.cwd();
    const cxfDir = path_1.default.join(targetDir, '.cxf');
    const analyzer = new RoiAnalyzer_1.RoiAnalyzer(cxfDir);
    analyzer.runAnalysis();
});
// cxf learn <domain> <content>
program
    .command('learn <domain> <content>')
    .description('Lưu trữ một bài học hoặc trí nhớ (Learning) vào hệ thống (vd: cxf learn auth "Luôn truyền x-api-key")')
    .action((domain, content) => {
    const targetDir = process.cwd();
    const cxfDir = path_1.default.join(targetDir, '.cxf');
    const manager = new MemoryManager_1.MemoryManager(cxfDir);
    manager.learn(domain, content);
    console.log(chalk_1.default.green(`✅ Đã lưu trí nhớ cho domain [${domain}]: "${content}"`));
});
// cxf skill create <name>
const skillCommand = program
    .command('skill')
    .description('Quản lý hệ thống Kỹ năng (Skills) - Cho phép tạo và tùy chỉnh các kỹ năng AI');
skillCommand
    .command('create <name>')
    .description('Tạo một mẫu kỹ năng (Skill) mới với YAML Frontmatter')
    .action((name) => {
    const targetDir = process.cwd();
    const skillsDir = path_1.default.join(targetDir, '.cxf', 'skills');
    if (!fs_1.default.existsSync(skillsDir)) {
        console.log(chalk_1.default.red('❌ Không tìm thấy thư mục .cxf/skills/. Hãy chạy cxf init trước.'));
        return;
    }
    const filename = name.endsWith('.md') ? name : `${name}.md`;
    const filePath = path_1.default.join(skillsDir, filename);
    if (fs_1.default.existsSync(filePath)) {
        console.log(chalk_1.default.yellow(`⚠️ Kỹ năng ${filename} đã tồn tại.`));
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
    fs_1.default.writeFileSync(filePath, template);
    console.log(chalk_1.default.green(`✅ Đã tạo thành công mẫu kỹ năng tại: .cxf/skills/${filename}`));
});
// cxf daemon
const daemonCommand = program
    .command('daemon')
    .description('Quản lý Máy chủ CXF MCP - Khởi động và quản lý tiến trình nền cho các tính năng Agentic');
daemonCommand
    .command('start')
    .description('Chạy máy chủ CXF trên stdio để kết nối với AI')
    .action(async () => {
    await (0, daemon_1.runDaemon)();
});
// cxf impact
program
    .command('impact <filePath>')
    .description('Phân tích bán kính ảnh hưởng (Blast-Radius) của một file')
    .option('-d, --depth <number>', 'Độ sâu phân tích', '2')
    .action((filePath, options) => {
    const wrapperDir = process.cwd();
    const cxfDir = path_1.default.join(wrapperDir, '.cxf');
    let targetDir = wrapperDir;
    const configPath = path_1.default.join(cxfDir, 'config.json');
    if (fs_1.default.existsSync(configPath)) {
        const config = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
        if (config.targetRepoPath) {
            targetDir = path_1.default.resolve(wrapperDir, config.targetRepoPath);
        }
    }
    const srcDir = path_1.default.join(targetDir, 'src');
    if (!fs_1.default.existsSync(srcDir)) {
        console.log(chalk_1.default.red(`❌ Không tìm thấy thư mục src/ tại ${targetDir}.`));
        return;
    }
    console.log(chalk_1.default.blue(`💥 Đang phân tích Blast-Radius cho: ${chalk_1.default.bold(filePath)}...`));
    const analyzer = new DependencyAnalyzer_1.BlastRadiusAnalyzer(srcDir);
    analyzer.buildGraph();
    const depth = parseInt(options.depth) || 2;
    const impact = analyzer.getImpactRadius(filePath, depth);
    const stats = analyzer.getStats();
    console.log(chalk_1.default.dim(`Đã quét ${stats.filesScanned} files, theo dõi ${stats.uniqueDependenciesTracked} dependencies.`));
    if (impact.tests.length > 0) {
        console.log(chalk_1.default.green.bold(`\n🧪 Tests bị ảnh hưởng (${impact.tests.length}):`));
        impact.tests.forEach(f => console.log(`  - ${f}`));
    }
    if (impact.direct.length > 0) {
        console.log(chalk_1.default.yellow.bold(`\n⚡ Direct Dependents (Gọi trực tiếp) (${impact.direct.length}):`));
        impact.direct.forEach(f => console.log(`  - ${f}`));
    }
    if (impact.indirect.length > 0) {
        console.log(chalk_1.default.yellow(`\n🔗 Indirect Dependents (Bị ảnh hưởng gián tiếp) (${impact.indirect.length}):`));
        impact.indirect.forEach(f => console.log(`  - ${f}`));
    }
    if (impact.tests.length === 0 && impact.direct.length === 0 && impact.indirect.length === 0) {
        console.log(chalk_1.default.green('✅ File này dường như không bị ai phụ thuộc (Safe to change).'));
    }
});
program.parse(process.argv);
