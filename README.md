# CXF CLI (Context eXchange Framework)

CXF CLI là một hệ thống **Context Engine** được thiết kế để giải quyết điểm yếu cốt lõi của RAG (Retrieval-Augmented Generation) trong các tác vụ AI Agentic Coding. Nó đóng vai trò như một "máy chủ MCP (Model Context Protocol)" cung cấp ngữ cảnh cực kỳ chính xác, tiết kiệm token và bảo mật cho các AI Agents (Cursor, Claude Code, Gemini).

---

## Tại sao chọn CXF?

- **Real Init (Dynamic Detection)**: Không xài dữ liệu giả. `cxf init` tự động quét sâu vào mã nguồn (`package.json`, `src/`) để nhận diện chính xác 100% Framework (Next.js, NestJS, Go...) và danh sách Module hiện có.
- **Dynamic Guardrails**: Tự động sinh file `rules/global.md` chứa các Best Practices (VD: `"use client"` cho Next.js, cấm `any` cho TypeScript) khớp hoàn toàn với stack công nghệ của dự án.
- **Agent Directives**: Tự động tiêm các Mệnh lệnh (Skill) bắt buộc AI phải gọi MCP Tools (`cxf_get_optimized_context`, `cxf_learn_context`) để đảm bảo AI vận hành theo đúng quy trình.
- **Token Efficiency**: Thuật toán đa lớp (Minify, Strip Comments, Markdown Collapsing) giúp nén lượng token xuống mức tối thiểu mà không mất đi tính logic.
- **Dependency Spread (Level 2 Context)**: Hệ thống đọc hiểu `import`/`require` trong code để "lan truyền" điểm phụ thuộc, đảm bảo LLM không bao giờ bị thiếu thư viện khi code.
- **Autonomous Memory**: LLM tự động rút ra bài học sau mỗi task khó và ghi vào `learnings.yaml`. Kinh nghiệm này sẽ được cộng điểm ưu tiên cao nhất cho các lần gọi sau.
- **Security Guardrails**: Tường lửa Regex chặn đứng và mã hóa (`[REDACTED]`) các API Key, JWT, Password trước khi dữ liệu được gửi đến LLM bên thứ 3.
- **Observability**: Hệ thống liên tục ghi nhận dữ liệu vào `metrics.json` và chấm điểm ROI (Return on Investment) để theo dõi hiệu quả sử dụng token.

---

## Cài đặt

```bash
npm install -g cxf-cli
```
*Lưu ý: CXF CLI hiện tại đang ở bản 3.0.0. Yêu cầu Node.js >= 18.*

---

## Hướng dẫn sử dụng CLI

### 1. Khởi tạo Dự án
Di chuyển vào thư mục code của bạn và chạy:
```bash
cxf init -y
```
Lệnh này sẽ tạo ra thư mục `.cxf/` chứa các cấu hình về `knowledge` (kiến thức) và `skills` (hành vi).

### 2. Đồng bộ Hệ thống (Sync)
```bash
cxf sync
```
Quét đệ quy toàn bộ thư mục `src/` (hoặc thư mục mã nguồn) và tạo index siêu dữ liệu (metadata) lưu vào `sync_modules.yaml`.

### 3. Lưu Trí nhớ (Learnings)
```bash
cxf learn "auth" "Khi gọi API login phải truyền header x-api-key"
```
Trí nhớ này sẽ được tự động ghim với độ ưu tiên +500 điểm khi Agent tương tác với domain `auth`.

### 4. Phân tích Hiệu quả (ROI)
```bash
cxf roi
```
Truy xuất file `metrics.json` và phân tích xem Context Engine đang chi tiêu token hiệu quả ra sao so với tỷ lệ giải quyết lỗi thành công.

---

## Khởi chạy MCP Daemon (AI Agent Mode)

CXF CLI được tích hợp sẵn một máy chủ MCP (Model Context Protocol) chạy qua luồng `stdio`.

```bash
cxf daemon
```

Khi được kết nối vào IDE (như Cursor) hoặc một AI CLI, daemon này cung cấp 3 siêu công cụ (Tools) cho LLM sử dụng tự động:
1. `cxf_get_optimized_context`: Bơm ngữ cảnh động, thu gọn, đã lọc bảo mật.
2. `cxf_learn_context`: Để AI tự động ghi chép lại kinh nghiệm.
3. `cxf_get_metrics`: Để AI đọc và tự đánh giá chỉ số tiêu thụ token (ROI).

---

## Cấu trúc thư mục `.cxf`

```text
.cxf/
├── .cache/
│   └── metrics.json          # Lưu trữ lịch sử nạp context và ROI
├── knowledge/
│   ├── learnings.yaml        # Trí nhớ dài hạn của dự án
│   └── sync_modules.yaml     # Metadata tự sinh từ mã nguồn
└── skills/
    └── rules.md              # Các quy tắc đặc thù của dự án (Guardrails, styleguide)
```

---

## Kiến trúc Hoạt động (The 8-step Pipeline)

Mỗi khi có yêu cầu cấp phát ngữ cảnh, CXF chạy qua 8 bước:
1. **Intent Analysis**: Phân tích câu lệnh để dò tìm Domain (Vd: `auth`, `database`).
2. **Registry Load**: Tải toàn bộ Knowledge, Skills, Learnings từ `.cxf/`.
3. **Dependency Spread**: Đọc AST/Regex để kéo các file liên quan.
4. **Rank & Score**: Chấm điểm dựa trên Tag Matching và Priority (+1000 cho rules, +500 cho learnings).
5. **Budget Allocation**: Bắt đầu nhồi file vào ngân sách Token (Budget).
6. **Token Compression**: Nếu tràn Budget, kích hoạt máy nén đa lớp (Bỏ Comments, Minify, Gập Markdown).
7. **Prompt Build**: Ghép các file đã chọn thành một Prompt duy nhất.
8. **Security Redaction**: Chặn và mã hóa API Keys / Mật khẩu. Xuất log đo lường ROI ra `metrics.json`.

---

**CXF CLI - Định hình kỷ nguyên Context Engineering cho AI Agentic Coding.**
