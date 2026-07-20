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
