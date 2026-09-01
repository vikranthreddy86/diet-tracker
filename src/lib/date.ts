export function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function dateStrToDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export function formatDateLabel(dateStr: string): string {
  return dateStrToDate(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateStr(dateStr: string): boolean {
  if (!DATE_RE.test(dateStr)) return false;
  return !Number.isNaN(dateStrToDate(dateStr).getTime());
}

export function addDaysToDateStr(dateStr: string, days: number): string {
  const d = dateStrToDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
