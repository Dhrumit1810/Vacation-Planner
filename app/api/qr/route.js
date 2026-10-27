/**
 * app/api/qr/route.js
 *
 * GET /api/qr?data=TEXT&size=300
 * GET /api/qr?data=TEXT&size=300&download=1   ← triggers a file download
 *
 * Proxies a PNG image from goQR (https://goqr.me/api/) and returns it
 * directly as image/png. Caches the result for 24 hours (86400 seconds).
 *
 * Query params:
 *   data      (required) – the text to encode, max 500 characters
 *   size      (optional) – pixel dimension of the square image, 100–600, default 300
 *   download  (optional) – set to "1" to download the image as plan-qr.png
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const QR_BASE = "https://api.qrserver.com/v1/create-qr-code/";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data     = searchParams.get("data");
  const sizeStr  = searchParams.get("size") || "300";
  const download = searchParams.get("download");

  // ── Validate 'data' ─────────────────────────────────────────────────────────

  if (!data || !data.trim()) {
    return NextResponse.json(
      { error: "'data' query parameter is required and cannot be empty" },
      { status: 400 }
    );
  }

  if (data.length > 500) {
    return NextResponse.json(
      { error: "'data' must be 500 characters or fewer" },
      { status: 400 }
    );
  }

  // ── Validate 'size' ─────────────────────────────────────────────────────────

  const size = parseInt(sizeStr, 10);

  if (isNaN(size) || size < 100 || size > 600) {
    return NextResponse.json(
      { error: "'size' must be a number between 100 and 600" },
      { status: 400 }
    );
  }

  // ── Fetch the QR code image from goQR ───────────────────────────────────────

  try {
    const qrUrl =
      `${QR_BASE}?size=${size}x${size}&data=${encodeURIComponent(data)}`;

    const qrRes = await fetch(qrUrl, { cache: "no-store" });

    if (!qrRes.ok) {
      throw new Error(`goQR returned ${qrRes.status}`);
    }

    // Read the image as a raw binary buffer.
    const imageBuffer = await qrRes.arrayBuffer();

    // ── Build response headers ────────────────────────────────────────────────

    const headers = new Headers({
      "Content-Type": "image/png",
      // Cache the QR image in the browser for 24 hours to save bandwidth.
      "Cache-Control": "public, max-age=86400",
    });

    // If download=1, tell the browser to save the file instead of displaying it.
    if (download === "1") {
      headers.set("Content-Disposition", 'attachment; filename="plan-qr.png"');
    }

    return new Response(imageBuffer, { status: 200, headers });
  } catch (err) {
    console.error("[/api/qr]", err.message);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
