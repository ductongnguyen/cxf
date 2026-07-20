import { ContextObject } from './ContextObject';
import { TaskIntent } from './IntentAnalyzer';
import { DependencyAnalyzer } from './DependencyAnalyzer';

export class SelectorRanker {
  private depAnalyzer = new DependencyAnalyzer();

  /**
   * Chọn và Xếp hạng các Context Objects dựa trên Intent
   */
  public selectAndRank(objects: ContextObject[], intent: TaskIntent): ContextObject[] {
    const scoredObjects = objects.map(obj => {
      let score = obj.metadata.priority || 50;

      // Cộng điểm nếu khớp Domain
      if (obj.metadata.tags) {
        for (const domain of intent.domains) {
          if (obj.metadata.tags.includes(domain)) {
            score += 30; // Trùng domain thì cộng 30 điểm
          }
        }
      }

      // Cộng điểm nếu đây là file Global/Rules bắt buộc
      if (obj.sourcePath.includes('rules\\global.md') || obj.sourcePath.includes('rules/global.md')) {
        score += 1000; // Global rule luôn phải được nạp
      }

      // Ưu tiên cực cao cho hệ thống Trí nhớ (Learnings)
      if (obj.sourcePath.includes('learnings.yaml')) {
        score += 500;
      }

      return { object: obj, score };
    });

    // Thuật toán lan truyền phụ thuộc (Dependency Spread)
    // Nếu một file có điểm cao, những file mà nó phụ thuộc cũng được cộng điểm.
    for (const item of scoredObjects) {
      if (item.score >= 80) { // Chỉ những file quan trọng mới tạo ra lực hút
        const dependencies = this.depAnalyzer.extractDependencies(item.object.content);
        for (const dep of dependencies) {
          const target = scoredObjects.find(t => t.object.sourcePath.includes(dep));
          if (target) {
            target.score += 20; // Kích điểm cho dependency
          }
        }
      }
    }

    // Lọc bỏ những file có điểm quá thấp (dưới mức cơ sở 50) và không khớp domain
    const selected = scoredObjects.filter(item => item.score >= 50);

    // Xếp hạng từ cao xuống thấp
    selected.sort((a, b) => b.score - a.score);

    return selected.map(item => item.object);
  }
}
