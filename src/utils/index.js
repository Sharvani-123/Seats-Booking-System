import { BATCH_SCHEDULE } from "../data";

// Returns 1 or 2 based on even/odd week number of the year
export const getWeekParity = (date) => {
  const d = new Date(date);
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return weekNum % 2 === 0 ? 2 : 1;
};

// JS getDay(): Sun=0, Mon=1 ... Fri=5, Sat=6
export const getJsWeekday = (date) => new Date(date).getDay();

export const isWeekend = (date) => {
  const d = getJsWeekday(date);
  return d === 0 || d === 6;
};

export const isWorkingDay = (batch, date) => {
  const jsDay = getJsWeekday(date);
  if (jsDay === 0 || jsDay === 6) return false;
  const week = getWeekParity(date);
  const schedule = BATCH_SCHEDULE[batch];
  const workDays = week === 1 ? schedule.week1 : schedule.week2;
  return workDays.includes(jsDay);
};

export const dateStr = (date) =>
  new Date(date).toISOString().split("T")[0];

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// Returns next N weekdays starting from a base date
export const getWeekdays = (fromDate, count = 14) => {
  const days = [];
  const d = new Date(fromDate);
  d.setHours(0, 0, 0, 0);
  while (days.length < count) {
    if (!isWeekend(d)) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
};

export const getMemberInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("");

export const batchColor  = (b) => (b === 1 ? "#3b82f6" : "#8b5cf6");
export const batchBg     = (b) => (b === 1 ? "rgba(59,130,246,0.1)" : "rgba(139,92,246,0.1)");
export const batchBorder = (b) => (b === 1 ? "rgba(59,130,246,0.3)" : "rgba(139,92,246,0.3)");
