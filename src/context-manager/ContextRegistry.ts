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
