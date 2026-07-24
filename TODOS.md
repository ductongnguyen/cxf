# TODOS

## Telemetry & Context Auto-Tuning

- [ ] **Phase 2 Autonomous Auto-Tuning Context Engine**
  - **Priority:** P2
  - **What:** Feed telemetry statistics from `.cxf/telemetry/events.jsonl` back into CXF Context Selector & Ranker to auto-adjust context object priorities over time.
  - **Context:** Phase 1 (v3.2.0.0) built the Telemetry Engine & Live TUI. Phase 2 will implement feedback-driven priority tuning based on test pass outcomes.
  - **Depends on:** Telemetry Event Engine (v3.2.0.0).

## Completed

- [x] **Real-Time Context Analytics & ROI TUI (`cxf metrics` & `cxf metrics --live`)**
  - **Completed:** v3.2.0.0 (2026-07-24)
