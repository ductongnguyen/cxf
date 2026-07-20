"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextRegistry = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
class ContextRegistry {
    cxfDir;
    objects = [];
    constructor(cxfDir) {
        this.cxfDir = cxfDir;
    }
    loadAll() {
        this.objects = [];
        const dirsToScan = ['rules', 'knowledge', 'extensions', 'skills'];
        for (const dir of dirsToScan) {
            const fullPath = path_1.default.join(this.cxfDir, dir);
            if (fs_1.default.existsSync(fullPath)) {
                this.scanDirectory(fullPath);
            }
        }
    }
    scanDirectory(dir) {
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            const filePath = path_1.default.join(dir, file);
            const stat = fs_1.default.statSync(filePath);
            if (stat.isDirectory()) {
                this.scanDirectory(filePath);
            }
            else if (file.endsWith('.md')) {
                this.parseMarkdownFile(filePath);
            }
            else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
                this.parseYamlFile(filePath);
            }
        }
    }
    parseMarkdownFile(filePath) {
        const content = fs_1.default.readFileSync(filePath, 'utf-8');
        // Tách Frontmatter
        const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        let metadata;
        let actualContent = content;
        if (match) {
            try {
                metadata = yaml_1.default.parse(match[1]);
                actualContent = match[2];
            }
            catch (e) {
                metadata = { id: path_1.default.basename(filePath, '.md') };
            }
        }
        else {
            metadata = { id: path_1.default.basename(filePath, '.md') };
        }
        if (!metadata.token_cost)
            metadata.token_cost = Math.ceil(actualContent.length / 4);
        if (metadata.priority === undefined)
            metadata.priority = 50;
        this.objects.push({ metadata, content: actualContent, sourcePath: filePath });
    }
    parseYamlFile(filePath) {
        const content = fs_1.default.readFileSync(filePath, 'utf-8');
        try {
            const yamlData = yaml_1.default.parse(content);
            // Xây dựng Metadata
            const metadata = {
                id: yamlData.id || path_1.default.basename(filePath, path_1.default.extname(filePath)),
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
        }
        catch (e) {
            // Bỏ qua nếu YAML hỏng
        }
    }
    getAllObjects() {
        return this.objects;
    }
}
exports.ContextRegistry = ContextRegistry;
