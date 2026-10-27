// ─────────────────────────────────────────────────────────────
// components/ShareSiteCard.js
// Header section on the My Plans page.
// Shows a 250px QR code of the current site origin so users
// can share the app easily.
// Note: "Works for other phones once the site is deployed."
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { qrUrl } from "@/lib/api";

export default function ShareSiteCard() {
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.origin);
    }
  }, []);

  return (
    <section className="mb-8 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-stone-900/80 to-stone-900/90 p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            📲 Share Holiday Planner
          </span>
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Share this site with friends & family
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">
            Scan this QR code with any smartphone camera to open Holiday Planner instantly.
          </p>
          <p className="mt-2 text-xs font-medium text-amber-400/90">
            ℹ️ Works for other phones once the site is deployed.
          </p>

          {siteUrl && (
            <p className="mt-3 truncate rounded-lg bg-stone-950/60 px-3 py-1.5 font-mono text-xs text-amber-200 border border-stone-800">
              {siteUrl}
            </p>
          )}
        </div>

        {/* 250px QR Code using plain <img> tag */}
        <div className="flex flex-col items-center shrink-0">
          <div className="rounded-2xl border-2 border-amber-500/30 bg-white p-2.5 shadow-xl">
            {siteUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={qrUrl(siteUrl, 250)}
                alt="Share site QR Code"
                width={250}
                height={250}
                className="block h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] items-center justify-center text-xs text-stone-400">
                Generating QR...
              </div>
            )}
          </div>
          {siteUrl && (
            <a
              href={qrUrl(siteUrl, 500, true)}
              download="holiday-planner-qr.png"
              className="mt-2 text-xs font-semibold text-amber-300 transition hover:text-amber-200"
            >
              ⬇ Download Site QR
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
