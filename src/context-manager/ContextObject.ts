export interface ContextMetadata {
  id: string;
  title?: string;
  tags?: string[];
  priority?: number;
  token_cost?: number;
  summary?: string;
  dependencies?: string[];
  ttl?: number;
  version?: string;
  last_used?: string;
  success_rate?: number;
  compression_allowed?: boolean;
}

export interface ContextObject {
  metadata: ContextMetadata;
  content: string;     // The actual markdown content
  sourcePath: string;  // Where this object came from (e.g., .cxf/rules/auth.md)
}
