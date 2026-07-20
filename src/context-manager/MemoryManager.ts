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
