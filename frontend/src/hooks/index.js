import { useState, useEffect } from "react";
import { getWeekdays, dateStr } from "../utils";

export const useClock = (intervalMs = 30_000) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
};

export const useNotification = (durationMs = 3000) => {
  const [notification, setNotification] = useState(null);
  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), durationMs);
  };
  return { notification, showNotif };
};

export const useDateSelector = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(today);
  const dateOptions = getWeekdays(today, 14);
  return { today, selectedDate, setSelectedDate, dateOptions, dateStr };
};
