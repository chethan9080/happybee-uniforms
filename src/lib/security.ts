/**
 * Security utilities — sanitization, validation, CSRF, rate-limiting, honeypot
 */

// ── Sanitize ──────────────────────────────────────────────────────────────────
/** Escapes HTML special characters to prevent XSS */
export function sanitizeInput(input: string): string {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(input));
  return div.innerHTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/** Sanitize an entire object of string fields */
export function sanitizeFormData<T extends Record<string, string>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, sanitizeInput(v)])
  ) as T;
}

// ── Validators ────────────────────────────────────────────────────────────────
export const validators = {
  email:   (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone:   (v: string) => /^[+]?[\d\s\-]{10,15}$/.test(v),
  name:    (v: string) => /^[\p{L}\s]{2,50}$/u.test(v),
  pincode: (v: string) => /^[1-9][0-9]{5}$/.test(v),
  text:    (v: string) => v.trim().length >= 2 && v.trim().length <= 500,
};

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // optional field
  return validators.phone(phone);
}

export function validateName(name: string): boolean {
  return validators.name(name.trim());
}

// ── CSRF ──────────────────────────────────────────────────────────────────────
export function generateCsrfToken(): string {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem("csrf_token", token);
  return token;
}

export function verifyCsrfToken(token: string): boolean {
  return token === sessionStorage.getItem("csrf_token");
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
const submitTimestamps: Record<string, number> = {};

/**
 * Returns true if the action is allowed (not rate-limited).
 * @param key    unique key per form/action
 * @param limitMs minimum ms between submissions (default 3000)
 */
export function checkRateLimit(key: string, limitMs = 3000): boolean {
  const now = Date.now();
  const last = submitTimestamps[key] ?? 0;
  if (now - last < limitMs) return false;
  submitTimestamps[key] = now;
  return true;
}

// ── Honeypot ──────────────────────────────────────────────────────────────────
/** Returns true if the honeypot field is empty (i.e. not a bot) */
export function checkHoneypot(value: string): boolean {
  return value === "";
}
