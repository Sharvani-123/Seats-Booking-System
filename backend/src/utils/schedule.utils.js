
const BATCH_SCHEDULE = {
  1: { week1: [1, 2, 3], week2: [4, 5] },
  2: { week1: [4, 5],    week2: [1, 2, 3] },
};

export const BUFFER_SEAT_COUNT = 10;

const parseLocalDate = (isoDateStr) => {
  const [year, month, day] = String(isoDateStr).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getIsoWeekNumber = (date) => {
  const tmp = new Date(date);
  const day = (tmp.getDay() + 6) % 7; // Mon=0 ... Sun=6
  tmp.setDate(tmp.getDate() - day + 3); // nearest Thursday
  const firstThursday = new Date(tmp.getFullYear(), 0, 4);
  const firstDay = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDay + 3);
  return 1 + Math.round((tmp - firstThursday) / 604_800_000);
};

/**
 * Returns 1 or 2 based on even/odd ISO week number.
 * Determines which sub-schedule applies this week.
 */
export const getWeekParity = (dateStr) => {
  const date = parseLocalDate(dateStr);
  const weekNum = getIsoWeekNumber(date);
  return weekNum % 2 === 0 ? 2 : 1;
};

/**
 * Returns JS weekday: Sun=0, Mon=1 ... Fri=5, Sat=6
 */
export const getJsWeekday = (dateStr) => parseLocalDate(dateStr).getDay();

/**
 * True if the given batch has a scheduled working day on the given date.
 */
export const isWorkingDay = (batch, dateStr) => {
  const jsDay = getJsWeekday(dateStr);
  if (jsDay === 0 || jsDay === 6) return false; // weekends never work
  const week = getWeekParity(dateStr);
  const workDays = week === 1
    ? BATCH_SCHEDULE[batch].week1
    : BATCH_SCHEDULE[batch].week2;
  return workDays.includes(jsDay);
};

/**
 * Returns the current date as YYYY-MM-DD (server timezone).
 */
export const todayStr = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * True if current server time is at or after 3:00 PM.
 */
export const isAfter3PM = () => new Date().getHours() >= 15;
