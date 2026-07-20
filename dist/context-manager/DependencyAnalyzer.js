"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlastRadiusAnalyzer = exports.DependencyAnalyzer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DependencyAnalyzer {
    /**
     * Trích xuất danh sách các module/file được import hoặc require trong nội dung code.
     * Sử dụng Regex để quét cú pháp ES6 và CommonJS.
     */
    extractDependencies(content) {
        const dependencies = new Set();
        // Regex quét cú pháp: import { X } from './Y' hoặc import X from "Y"
        const importRegex = /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            if (match[1])
                dependencies.add(this.normalize(match[1]));
        }
        // Regex quét cú pháp: require('./Y')
        const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
        while ((match = requireRegex.exec(content)) !== null) {
            if (match[1])
                dependencies.add(this.normalize(match[1]));
        }
        return Array.from(dependencies);
    }
    normalize(dep) {
        // Lược bỏ tiền tố ./ hoặc ../ để dễ dàng so sánh tên gốc
        let normalized = dep.split('/').pop() || dep;
        // Lược bỏ đuôi mở rộng nếu có để so sánh module name
        normalized = normalized.replace(/\.(ts|js|jsx|tsx)$/, '');
        return normalized;
    }
}
exports.DependencyAnalyzer = DependencyAnalyzer;
class BlastRadiusAnalyzer {
    rootDir;
    dependencyAnalyzer = new DependencyAnalyzer();
    reverseGraph = new Map();
    filesScanned = 0;
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    /** Build the reverse dependency graph */
    buildGraph() {
        this.reverseGraph.clear();
        this.filesScanned = 0;
        this.scanDirectory(this.rootDir);
    }
    scanDirectory(dir) {
        if (!fs_1.default.existsSync(dir))
            return;
        const entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
        const ignoreList = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'vendor', '.cxf']);
        for (const entry of entries) {
            if (ignoreList.has(entry.name))
                continue;
            const fullPath = path_1.default.join(dir, entry.name);
            if (entry.isDirectory()) {
                this.scanDirectory(fullPath);
            }
            else if (entry.isFile() && /\.(ts|js|jsx|tsx)$/.test(entry.name)) {
                this.processFile(fullPath);
            }
        }
    }
    processFile(filePath) {
        this.filesScanned++;
        try {
            const content = fs_1.default.readFileSync(filePath, 'utf-8');
            const deps = this.dependencyAnalyzer.extractDependencies(content);
            for (const dep of deps) {
                if (!this.reverseGraph.has(dep)) {
                    this.reverseGraph.set(dep, new Set());
                }
                this.reverseGraph.get(dep).add(filePath);
            }
        }
        catch (e) {
            // Ignore read errors (e.g., binary files or permissions)
        }
    }
    /**
     * Find files affected by changing a target file.
     * Uses basename to match imports (High Recall heuristic).
     */
    getImpactRadius(targetFileName, depth = 2) {
        const targetBase = this.normalizeName(targetFileName);
        const directDependents = this.getDirectDependents(targetBase);
        const direct = new Set();
        const indirect = new Set();
        const tests = new Set();
        const categorize = (file, isDirect) => {
            const fileBase = this.normalizeName(file).toLowerCase();
            if (fileBase.includes('test') || fileBase.includes('spec')) {
                tests.add(file);
            }
            else {
                if (isDirect)
                    direct.add(file);
                else
                    indirect.add(file);
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
    getDirectDependents(baseName) {
        const dependents = this.reverseGraph.get(baseName);
        return dependents ? Array.from(dependents) : [];
    }
    normalizeName(filePath) {
        let normalized = filePath.split(/[\\/]/).pop() || filePath;
        normalized = normalized.replace(/\.(ts|js|jsx|tsx)$/, '');
        return normalized;
    }
    getStats() {
        return {
            filesScanned: this.filesScanned,
            uniqueDependenciesTracked: this.reverseGraph.size
        };
    }
}
exports.BlastRadiusAnalyzer = BlastRadiusAnalyzer;
