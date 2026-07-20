"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetManager = void 0;
const TokenCompressor_1 = require("./TokenCompressor");
class BudgetManager {
    compressor = new TokenCompressor_1.TokenCompressor();
    /**
     * Cắt gọt danh sách Context Objects để vừa với budget token.
     * Danh sách truyền vào đã được xếp hạng (Ranked) từ quan trọng nhất đến ít quan trọng nhất.
     */
    allocate(rankedObjects, maxBudget) {
        let currentTokens = 0;
        const finalSelection = [];
        for (const obj of rankedObjects) {
            const cost = obj.metadata.token_cost || 0;
            if (currentTokens + cost <= maxBudget) {
                finalSelection.push(obj);
                currentTokens += cost;
            }
            else {
                // Nén (Compress) đa lớp nếu được phép để nhét vừa
                if (obj.metadata.compression_allowed) {
                    let sourceType = 'markdown';
                    if (obj.sourcePath.endsWith('.ts') || obj.sourcePath.endsWith('.js'))
                        sourceType = 'code';
                    else if (obj.sourcePath.endsWith('.yaml') || obj.sourcePath.endsWith('.yml'))
                        sourceType = 'yaml';
                    const compressedContent = this.compressor.compress(obj.content, sourceType);
                    const compressedCost = Math.ceil(compressedContent.length / 4);
                    if (currentTokens + compressedCost <= maxBudget) {
                        finalSelection.push({
                            ...obj,
                            content: compressedContent,
                            metadata: { ...obj.metadata, token_cost: compressedCost }
                        });
                        currentTokens += compressedCost;
                    }
                }
                // Nếu vẫn không vừa sau khi nén, đành phải bỏ qua Object này (Isolation)
            }
        }
        return finalSelection;
    }
}
exports.BudgetManager = BudgetManager;
