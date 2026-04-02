// Ottawa timezone = America/Toronto (EST/EDT)
export const TIMEZONE = "America/Toronto";
export const WORK_START = 9;  // 9am
export const WORK_END   = 21; // 9pm
export const SLOT_DURATION = 60; // minutes

export function getAvailableSlots(dateStr: string): string[] {
  const slots: string[] = [];
  for (let h = WORK_START; h < WORK_END; h++) {
    const hour = h < 10 ? `0${h}` : `${h}`;
    slots.push(`${hour}:00`);
    if (h < WORK_END - 1) slots.push(`${hour}:30`);
  }
  return slots;
}

export function isWithinWorkingHours(time: string): boolean {
  const [h] = time.split(":").map(Number);
  return h >= WORK_START && h < WORK_END;
}

export function isWeekday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const day = d.getUTCDay();
  return day >= 1 && day <= 6; // Mon–Sat
}

export function isValidFutureDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return d >= now && isWeekday(dateStr);
}