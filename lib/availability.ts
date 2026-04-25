// All times in GMT-5 (Central Standard Time — used year-round for consistency)

export function getNowGMT5(): Date {
  const now = new Date();
  // Convert to GMT-5
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 3600000);
}

export function isValidFutureDate(dateStr: string): boolean {
  if (!dateStr) return false;

  const [year, month, day] = dateStr.split("-").map(Number);
  // Create date at midnight GMT-5
  const chosenDate = new Date(year, month - 1, day, 0, 0, 0);

  // Day of week — 0=Sun, 6=Sat
  const dow = chosenDate.getDay();

  // No Sundays
  if (dow === 0) return false;

  // Must be Mon–Sat
  if (dow < 1 || dow > 6) return false;

  // 48h rule — compare against current GMT-5 time
  const nowGMT5 = getNowGMT5();
  const diff = chosenDate.getTime() - nowGMT5.getTime();
  if (diff < 48 * 3600000) return false;

  return true;
}

export function getDateValidationMessage(dateStr: string): string {
  if (!dateStr) return "Please select a date.";

  const [year, month, day] = dateStr.split("-").map(Number);
  const chosenDate = new Date(year, month - 1, day, 0, 0, 0);
  const dow = chosenDate.getDay();

  if (dow === 0) return "Sundays are not available. Please choose Monday to Saturday.";
  if (dow < 1 || dow > 6) return "Please choose a weekday (Monday to Saturday).";

  const nowGMT5 = getNowGMT5();
  const diff = chosenDate.getTime() - nowGMT5.getTime();
  if (diff < 48 * 3600000) return "Please book at least 48 hours in advance.";

  return "";
}

export function getAvailableSlots(dateStr: string): string[] {
  if (!isValidFutureDate(dateStr)) return [];

  // 9AM to 9PM GMT-5, 30-min slots
  const slots: string[] = [];
  for (let h = 9; h <= 20; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    if (h < 21) slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  // Add 21:00 as last slot
  slots.push("21:00");
  return slots;
}

export function formatTimeGMT5(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m === 0 ? "00" : m} ${ampm} GMT-5`;
}