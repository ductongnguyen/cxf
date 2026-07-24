# Changelog

Tất cả các thay đổi đáng chú ý đối với dự án này sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), và dự án tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.2.0.0] - 2026-07-24

### Added
- **Real-Time Context Analytics & ROI TUI (`cxf metrics` & `cxf metrics --live`)**: Visual debugging of token budget allocation, Context ROI scores, attention noise leakage, and context stability Jaccard index.
- **Telemetry Event Engine (`TelemetryManager.ts`)**: Async non-blocking log append to `.cxf/telemetry/events.jsonl` with rolling cap of 1,000 events.
- **TUI Dashboard & Non-TTY Fallback (`TuiDashboard.ts`)**: Terminal progress bar rendering, non-TTY JSON fallback, and signal traps (`SIGINT`/`SIGTERM`) for cursor restoration.
- **MCP Event Stream (`cxf_get_metrics`)**: Extended MCP tool response schema with live telemetry summary and ROI breakdown.
- **Automated Telemetry Test Suite (`tests/telemetry.test.ts`)**: Unit test coverage for Jaccard index, telemetry event append, and metrics aggregation.

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
