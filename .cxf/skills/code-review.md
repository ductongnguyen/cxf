---
id: code-review
title: Quy trình Code Review
priority: 900
type: skill
triggers: [review, audit, pr, check]
---
# Hướng dẫn Code Review
1. Đọc lướt các file bị thay đổi.
2. Kiểm tra các lỗi bảo mật (đảm bảo không hardcode secret).
3. Đánh giá Big-O (độ phức tạp thuật toán) của các vòng lặp.
4. So sánh với Convention trong `architecture.yaml`.
5. Đề xuất refactor (nếu có).
