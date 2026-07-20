"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
class MemoryManager {
    learningsFile;
    constructor(cxfDir) {
        const knowledgeDir = path_1.default.join(cxfDir, 'knowledge');
        if (!fs_1.default.existsSync(knowledgeDir)) {
            fs_1.default.mkdirSync(knowledgeDir, { recursive: true });
        }
        this.learningsFile = path_1.default.join(knowledgeDir, 'learnings.yaml');
    }
    learn(domain, content) {
        let learnings = [];
        if (fs_1.default.existsSync(this.learningsFile)) {
            try {
                const fileContent = fs_1.default.readFileSync(this.learningsFile, 'utf-8');
                const parsed = yaml_1.default.parse(fileContent);
                if (parsed && Array.isArray(parsed.learnings)) {
                    learnings = parsed.learnings;
                }
            }
            catch (e) {
                // Bỏ qua lỗi parse
            }
        }
        const newLearning = {
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
        fs_1.default.writeFileSync(this.learningsFile, yaml_1.default.stringify(yamlData));
        return newLearning;
    }
}
exports.MemoryManager = MemoryManager;
