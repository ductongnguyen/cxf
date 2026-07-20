export class SecurityGuard {
  /**
   * Redact sensitive information (API Keys, JWTs, Passwords) before sending to LLM.
   */
  public redact(content: string): string {
    let safeContent = content;

    // 1. Redact API Keys (e.g., sk-123456...)
    // Thường dài ít nhất 32 ký tự alphanumeric
    const apiKeyRegex = /sk-[a-zA-Z0-9]{32,}/g;
    safeContent = safeContent.replace(apiKeyRegex, '[REDACTED_API_KEY]');

    // 2. Redact JWT Tokens
    // Cấu trúc: header.payload.signature (base64url)
    const jwtRegex = /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;
    safeContent = safeContent.replace(jwtRegex, '[REDACTED_JWT_TOKEN]');

    // 3. Redact Passwords in code (e.g., password: "secret")
    const passwordRegex = /(password|secret|passwd)\s*[:=]\s*['"]([^'"]+)['"]/gi;
    safeContent = safeContent.replace(passwordRegex, '$1: "[REDACTED_PASSWORD]"');

    return safeContent;
  }
}
