# Changelog

Tất cả các thay đổi đáng chú ý đối với dự án này sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Thêm cờ `--yes` (`-y`) cho lệnh `init` để tự động duyệt.

## [3.1.0] - 2026-07-18

### Added
- **Smart Init (7 Phases)**: Khởi tạo ngữ cảnh động (`cxf init`).
- **Incremental Sync**: Đồng bộ hóa kiến thức dự án (`cxf sync`).
- **Skill Manager**: Hỗ trợ tạo và tùy chỉnh các kỹ năng AI (`cxf skill create`).
- **Daemon Mode**: Máy chủ MCP chạy dưới dạng tiến trình nền (`cxf daemon`).

### Changed
- Cập nhật Commander.js để cải thiện thông báo lỗi và tự động gợi ý (`showHelpAfterError`, `showSuggestionAfterError`).
- Bổ sung `README.md` giúp người mới tiếp cận nhanh (TTHW < 1 phút).
