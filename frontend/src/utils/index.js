/**
 * Frontend utils contain ONLY display helpers.
 * All business logic (working days, schedule, rules) lives in the backend.
 */

export const dateStr = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric",
  });

export const isWeekend = (date) => {
  const d = new Date(date).getDay();
  return d === 0 || d === 6;
};

// Returns next `count` weekdays from a base date
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
  name?.split(" ").map((n) => n[0]).join("") || "?";

export const batchColor  = (b) => b === 1 ? "#3b82f6" : "#8b5cf6";
export const batchBg     = (b) => b === 1 ? "rgba(59,130,246,0.1)" : "rgba(139,92,246,0.1)";
export const batchBorder = (b) => b === 1 ? "rgba(59,130,246,0.3)" : "rgba(139,92,246,0.3)";
