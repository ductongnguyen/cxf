---
id: implement-task
title: Quy trình Làm Task
priority: 950
type: skill
triggers: [implement, build, create, task, feature]
---
# Hướng dẫn Xây dựng Tính năng (Làm Task)
1. Đọc kỹ yêu cầu (Intent).
2. Kiểm tra xem có Knowledge Object nào liên quan đến module cần sửa không.
3. Không bắt đầu viết code ngay. Hãy phác thảo kiến trúc nhỏ (Draft) trước.
4. Viết code tuần tự, đảm bảo chạy linter hoặc test sau mỗi thay đổi lớn.
5. Cập nhật Knowledge Object (chạy `cxf sync`) nếu bạn vừa thêm module hoặc thư viện mới.
