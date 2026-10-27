/**
 * app/api/holidays/route.js
 *
 * GET /api/holidays?country=IN&year=2026
 *
 * Query params (both required):
 *   country  – 2-letter country code, e.g. "IN"
 *   year     – 4-digit year, e.g. "2026"
 *
 * Response: [{ "date": "2026-01-26", "name": "Republic Day", "longWeekend": true }, …]
 *           sorted by date ascending.
 */

import { NextResponse } from "next/server";
import { getHolidays } from "@/lib/nager";

// Always fetch fresh data.
export const dynamic = "force-dynamic";

export async function GET(request) {
  // Pull query params from the URL.
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const year = searchParams.get("year");

  // ── Input validation ────────────────────────────────────────────────────────

  if (!country || !year) {
    return NextResponse.json(
      { error: "Both 'country' and 'year' query parameters are required" },
      { status: 400 }
    );
  }

  // Country codes are exactly 2 uppercase letters.
  if (!/^[A-Za-z]{2}$/.test(country)) {
    return NextResponse.json(
      { error: "'country' must be a 2-letter code, e.g. IN" },
      { status: 400 }
    );
  }

  // Year must be a 4-digit number.
  const yearNum = parseInt(year, 10);
  if (!/^\d{4}$/.test(year) || yearNum < 1900 || yearNum > 2100) {
    return NextResponse.json(
      { error: "'year' must be a 4-digit year, e.g. 2026" },
      { status: 400 }
    );
  }

  // ── Fetch & return ──────────────────────────────────────────────────────────

  try {
    // getHolidays already handles sorting and long-weekend detection.
    const holidays = await getHolidays(country.toUpperCase(), year);
    return NextResponse.json(holidays);
  } catch (err) {
    console.error("[/api/holidays]", err.message);
    return NextResponse.json({ error: "Failed to fetch holidays" }, { status: 500 });
  }
}
