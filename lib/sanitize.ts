export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .slice(0, 2000);
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    result[key] = typeof val === "string" ? sanitizeString(val) : val;
  }
  return result as T;
}