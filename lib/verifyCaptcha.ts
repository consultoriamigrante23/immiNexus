export async function verifyCaptcha(token: string): Promise<boolean> {
  // Bypass captcha in development
  if (process.env.NODE_ENV === "development") return true;
  if (!token) return false;
  try {
    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `response=${token}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}