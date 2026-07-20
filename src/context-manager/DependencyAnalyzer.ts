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
