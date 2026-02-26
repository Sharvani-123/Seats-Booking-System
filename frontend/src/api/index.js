const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("wissen_token");

const request = async (method, path, body) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiLogin = (employeeId, password) =>
  request("POST", "/auth/login", { employeeId, password });

export const apiGetMe = () =>
  request("GET", "/auth/me");

// ── Bookings ──────────────────────────────────────────────────────────────────
export const apiGetBookingsByDate = (date) =>
  request("GET", `/bookings?date=${date}`);

export const apiGetMyBooking = (date) =>
  request("GET", `/bookings/my?date=${date}`);

export const apiBookDesignated = (date) =>
  request("POST", "/bookings/designated", { date });

export const apiReleaseDesignated = (date) =>
  request("DELETE", "/bookings/designated", { date });

export const apiBookFloater = (floaterSeatId) =>
  request("POST", "/bookings/floater", { floaterSeatId });

// ── Seats ─────────────────────────────────────────────────────────────────────
export const apiGetFloorPlan = (date) =>
  request("GET", `/seats/floorplan?date=${date}`);

export const apiGetFloaterSeats = (date) =>
  request("GET", `/seats/floaters?date=${date}`);

// ── Members ───────────────────────────────────────────────────────────────────
export const apiGetMembers = (date) =>
  request("GET", `/members?date=${date}`);
