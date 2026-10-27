/**
 * app/api/plans/route.js
 *
 * Handles all three plan operations on the same path:
 *
 *   GET    /api/plans              – list all saved plans
 *   POST   /api/plans              – save a new plan
 *   DELETE /api/plans?id=abc123    – delete a plan by id
 *
 * POST body (JSON):
 *   { "holiday": "Republic Day", "date": "2026-01-26",
 *     "activity": "Go hiking",   "type": "recreational" }
 *
 * All responses are JSON. Errors return { "error": "..." } with the
 * appropriate HTTP status code.
 */

import { NextResponse } from "next/server";
import { getPlans, addPlan, removePlan } from "@/lib/pantry";

export const dynamic = "force-dynamic";

// ─── GET /api/plans ───────────────────────────────────────────────────────────

export async function GET() {
  try {
    const plans = await getPlans();
    return NextResponse.json(plans);
  } catch (err) {
    console.error("[GET /api/plans]", err.message);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }
}

// ─── POST /api/plans ──────────────────────────────────────────────────────────

export async function POST(request) {
  let body;

  // Try to parse the request body as JSON.
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const { holiday, date, activity, type } = body || {};

  // All four fields are required and must be non-empty strings.
  const missing = [];
  if (!holiday || typeof holiday !== "string" || !holiday.trim()) missing.push("holiday");
  if (!date    || typeof date    !== "string" || !date.trim())    missing.push("date");
  if (!activity|| typeof activity!== "string" || !activity.trim())missing.push("activity");
  if (!type    || typeof type    !== "string" || !type.trim())    missing.push("type");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing or empty required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const newPlan = await addPlan({ holiday, date, activity, type });
    return NextResponse.json(newPlan, { status: 201 });
  } catch (err) {
    console.error("[POST /api/plans]", err.message);
    return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
  }
}

// ─── DELETE /api/plans?id=abc123 ─────────────────────────────────────────────

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !id.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'id' is required" },
      { status: 400 }
    );
  }

  try {
    await removePlan(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/plans]", err.message);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
