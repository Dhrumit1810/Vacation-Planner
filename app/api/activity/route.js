/**
 * app/api/activity/route.js
 *
 * GET /api/activity          – get a completely random activity
 * GET /api/activity?type=social – get a random activity of that type
 *
 * Allowed types: education, recreational, social, charity, cooking,
 *                relaxation, busywork
 *
 * Response: { "activity": "...", "type": "social", "participants": 2 }
 */

import { NextResponse } from "next/server";
import { getActivity } from "@/lib/bored";

export const dynamic = "force-dynamic";

// The 7 types the Bored API accepts (and our backup list covers).
const ALLOWED_TYPES = [
  "education",
  "recreational",
  "social",
  "charity",
  "cooking",
  "relaxation",
  "busywork",
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // may be null (that's OK)

  // ── Validate type if provided ───────────────────────────────────────────────

  if (type !== null && !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json(
      {
        error: `Invalid type. Allowed values: ${ALLOWED_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // ── Fetch & return ──────────────────────────────────────────────────────────

  try {
    // getActivity falls back to the local list if the API is down.
    const activity = await getActivity(type || undefined);
    return NextResponse.json(activity);
  } catch (err) {
    console.error("[/api/activity]", err.message);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
