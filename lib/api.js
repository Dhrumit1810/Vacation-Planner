// ─────────────────────────────────────────────────────────────
// lib/api.js
// Client API layer for Holiday Planner.
// All UI components call these helper functions and never
// call fetch directly.
//
// When USE_MOCK is true:
//   Simulates API responses with mock data and a 300ms delay.
//   savePlan and deletePlan update an in-memory list.
//
// When USE_MOCK is false:
//   Calls the real backend endpoints and throws an Error with
//   the server's error message on failure.
//
// qrUrl builds the /api/qr string with encodeURIComponent and
// never makes a network request.
//
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

import {
  MOCK_COUNTRIES,
  getMockHolidaysForCountryAndYear,
  MOCK_ACTIVITIES,
  INITIAL_MOCK_PLANS,
} from "./mockData";

// Set to false to use the real backend API routes (backend is now merged in).
export const USE_MOCK = false;

// In-memory list for plans when running in mock mode.
let inMemoryPlans = [...INITIAL_MOCK_PLANS];

// Helper to simulate a realistic network delay (300ms)
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to call the real backend endpoints and handle error responses.
 * Throws an Error containing the server's error message when res.ok is false.
 */
async function fetchWithContract(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const data = await res.json();
      if (data && data.error) {
        errorMsg = data.error;
      }
    } catch {
      // If response body is not JSON, use the status text
      if (res.statusText) {
        errorMsg = res.statusText;
      }
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

/**
 * 1. GET /api/countries -> [{code: "IN", name: "India"}, ...]
 */
export async function getCountries() {
  if (USE_MOCK) {
    await delay(300);
    return [...MOCK_COUNTRIES];
  }

  return fetchWithContract("/api/countries");
}

/**
 * 2. GET /api/holidays?country=IN&year=2026
 * -> [{date: "2026-01-26", name: "Republic Day", longWeekend: true}, ...]
 */
export async function getHolidays(country, year) {
  if (USE_MOCK) {
    await delay(300);
    return getMockHolidaysForCountryAndYear(country, Number(year) || 2026);
  }

  const query = `?country=${encodeURIComponent(country)}&year=${encodeURIComponent(year)}`;
  return fetchWithContract(`/api/holidays${query}`);
}

/**
 * 3. GET /api/activity?type=social
 * -> {activity: "...", type: "social", participants: 1}
 * Parameter `type` is optional.
 */
export async function getActivity(type) {
  if (USE_MOCK) {
    await delay(300);

    // If a specific type is provided and not "any", find matching activities
    const filterType = type && type.toLowerCase() !== "any" ? type.toLowerCase() : null;
    let pool = MOCK_ACTIVITIES;

    if (filterType) {
      const matches = MOCK_ACTIVITIES.filter((a) => a.type.toLowerCase() === filterType);
      if (matches.length > 0) {
        pool = matches;
      }
    }

    // Pick a random activity from the pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    return {
      activity: chosen.activity,
      type: chosen.type,
      participants: chosen.participants || 1,
    };
  }

  const query = type && type.toLowerCase() !== "any"
    ? `?type=${encodeURIComponent(type.toLowerCase())}`
    : "";

  return fetchWithContract(`/api/activity${query}`);
}

/**
 * 4. GET /api/plans
 * -> [{id, holiday, date, activity, type, createdAt}, ...]
 */
export async function getPlans() {
  if (USE_MOCK) {
    await delay(300);
    return [...inMemoryPlans];
  }

  return fetchWithContract("/api/plans");
}

/**
 * 5. POST /api/plans
 * JSON body: {holiday, date, activity, type}
 * Returns the saved plan object including id and createdAt.
 */
export async function savePlan(plan) {
  if (USE_MOCK) {
    await delay(300);

    const savedPlan = {
      id: "plan-" + Math.random().toString(36).substring(2, 9),
      holiday: plan.holiday,
      date: plan.date,
      activity: plan.activity,
      type: plan.type,
      createdAt: new Date().toISOString(),
    };

    // Add to top of the in-memory list
    inMemoryPlans = [savedPlan, ...inMemoryPlans];
    return savedPlan;
  }

  return fetchWithContract("/api/plans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });
}

/**
 * 6. DELETE /api/plans?id=abc123
 * -> {ok: true}
 */
export async function deletePlan(id) {
  if (USE_MOCK) {
    await delay(300);
    inMemoryPlans = inMemoryPlans.filter((p) => p.id !== id);
    return { ok: true };
  }

  return fetchWithContract(`/api/plans?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

/**
 * 7. QR Code URL Builder
 * Generates string: /api/qr?data=...&size=...(&download=1)
 * Never calls the network.
 *
 * @param {string} text - text or URL to encode
 * @param {number} size - pixel size (e.g. 200 or 250)
 * @param {boolean} download - if true, appends &download=1
 * @returns {string} url string
 */
export function qrUrl(text, size = 200, download = false) {
  const safeData = encodeURIComponent(text || "");
  let url = `/api/qr?data=${safeData}&size=${size || 200}`;
  if (download) {
    url += "&download=1";
  }
  return url;
}

// ── Date Helpers (avoiding timezone shift) ───────────────────

/**
 * Safely parse a "YYYY-MM-DD" string into a local Date object.
 * Does NOT use `new Date("YYYY-MM-DD")` which shifts timezones in UTC.
 * Instead, splits by "-" and creates a local date.
 *
 * @param {string} dateString - format "YYYY-MM-DD"
 * @returns {Date} local Date object at midnight
 */
export function parseLocalDate(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return new Date();
  }
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed month
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

/**
 * Calculates number of days from today (local midnight) to the holiday date.
 *
 * @param {string} dateString - format "YYYY-MM-DD"
 * @returns {number} positive for future, 0 for today, negative for past
 */
export function getDaysUntil(dateString) {
  const target = parseLocalDate(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats a days difference into a countdown label:
 * - 0 => "Today"
 * - 1 => "in 1 day"
 * - > 1 => "in X days"
 * - < 0 => "Passed"
 *
 * @param {number} days
 * @returns {string}
 */
export function getCountdownLabel(days) {
  if (days === 0) return "Today";
  if (days === 1) return "in 1 day";
  if (days > 1) return `in ${days} days`;
  return "Passed";
}

/**
 * Formats a "YYYY-MM-DD" string into a friendly format like "Mon, 26 Jan 2026"
 * using the local date.
 *
 * @param {string} dateString
 * @returns {string}
 */
export function formatHolidayDate(dateString) {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

