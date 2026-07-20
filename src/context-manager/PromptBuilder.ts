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
