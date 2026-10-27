/**
 * lib/nager.js
 *
 * Talks to the free Nager.Date API (https://date.nager.at).
 * No API key is needed. Three functions are exported:
 *   - getCountries()
 *   - getLongWeekends(country, year)
 *   - getHolidays(country, year)
 */

const BASE = "https://date.nager.at/api/v3";

// ─── Safe JSON parse ──────────────────────────────────────────────────────────

/**
 * Parse a Response as JSON safely.
 * Returns null if the body is empty (e.g. HTTP 204 No Content) so we
 * never throw "Unexpected end of JSON input".
 */
async function safeJson(res) {
  const text = await res.text();
  if (!text || !text.trim()) return null;
  return JSON.parse(text);
}

// ─── Countries ────────────────────────────────────────────────────────────────

/**
 * Fetch every country that Nager.Date supports.
 * Returns an array like: [{ code: "IN", name: "India" }, …]
 */
export async function getCountries() {
  const res = await fetch(`${BASE}/AvailableCountries`, {
    // Always get fresh data (no browser/server cache)
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Nager countries error: ${res.status}`);
  }

  const data = await safeJson(res);

  // The API returns { countryCode, name, … } – we only need code + name.
  // Guard against null/empty response.
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    code: item.countryCode,
    name: item.name,
  }));
}

// ─── Long weekends ────────────────────────────────────────────────────────────

/**
 * Fetch long-weekend ranges for a given country + year.
 * Returns an array of { startDate, endDate } strings (ISO 8601 dates).
 * If the request fails for any reason we return an empty array so the
 * caller can degrade gracefully instead of crashing.
 */
export async function getLongWeekends(country, year) {
  try {
    const res = await fetch(`${BASE}/LongWeekend/${year}/${country}`, {
      cache: "no-store",
    });

    // Some countries/years have no long weekends – 204 or empty array are OK.
    if (!res.ok) return [];

    const data = await safeJson(res);
    // Guard: null means 204 No Content (no long weekends for this country).
    if (!Array.isArray(data)) return [];
    // Each item has at least { startDate, endDate }
    return data.map((item) => ({
      startDate: item.startDate, // e.g. "2026-01-24"
      endDate: item.endDate,     // e.g. "2026-01-26"
    }));
  } catch {
    // Network error, JSON parse error, etc. – just return empty list.
    return [];
  }
}

// ─── Holidays ─────────────────────────────────────────────────────────────────

/**
 * Fetch public holidays for a country + year, then mark each one as
 * longWeekend:true if its date falls inside any long-weekend range.
 *
 * Returns an array sorted by date:
 *   [{ date: "2026-01-26", name: "Republic Day", longWeekend: true }, …]
 */
export async function getHolidays(country, year) {
  const res = await fetch(`${BASE}/PublicHolidays/${year}/${country}`, {
    cache: "no-store",
  });

  // 204 = country not in Nager's database; return empty list gracefully.
  if (res.status === 204) return [];

  if (!res.ok) {
    throw new Error(`Nager holidays error: ${res.status}`);
  }

  const data = await safeJson(res);
  // Guard against empty or non-array body.
  if (!Array.isArray(data)) return [];

  // Fetch long weekends in parallel. If it fails we still have holidays.
  const longWeekends = await getLongWeekends(country, year);

  // Helper: is a date string inside any long-weekend range?
  function isLongWeekend(dateStr) {
    return longWeekends.some(
      (lw) => dateStr >= lw.startDate && dateStr <= lw.endDate
    );
  }

  // Convert, mark long weekends, sort by date.
  const holidays = data
    .map((item) => ({
      date: item.date,
      name: item.localName || item.name, // prefer the local name
      longWeekend: isLongWeekend(item.date),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return holidays;
}
