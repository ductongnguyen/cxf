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
    
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.cxf') continue;
      
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
