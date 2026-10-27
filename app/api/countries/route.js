/**
 * app/api/countries/route.js
 *
 * GET /api/countries
 * Returns a list of all countries supported by Nager.Date.
 *
 * Response: [{ "code": "IN", "name": "India" }, …]
 */

import { NextResponse } from "next/server";
import { getCountries } from "@/lib/nager";

// Always fetch fresh data – never use Next.js's default cache.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const countries = await getCountries();
    return NextResponse.json(countries);
  } catch (err) {
    console.error("[/api/countries]", err.message);
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}
