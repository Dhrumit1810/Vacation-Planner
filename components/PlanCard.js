// ─────────────────────────────────────────────────────────────
// components/PlanCard.js
// Displays one saved plan on the My Plans page.
// Features:
//   - Holiday name, formatted date, activity, and type badge
//   - Plain <img> tag showing QR code: qrUrl(text, 200)
//     where text = "<holiday> on <date>: <activity>"
//   - "Download QR" link pointing to qrUrl(text, 400, true)
//     with the download attribute
//   - "Delete" button that calls deletePlan and removes card
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { qrUrl, formatHolidayDate } from "@/lib/api";

export default function PlanCard({ plan, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // The contract-specified QR text: "<holiday> on <date>: <activity>"
  const qrText = `${plan.holiday} on ${plan.date}: ${plan.activity}`;

  // Formatted date for display
  const displayDate = formatHolidayDate(plan.date);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete(plan.id);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete plan.");
      setDeleting(false);
    }
  }

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/20 bg-stone-900/80 p-5 shadow-lg backdrop-blur-md transition hover:border-amber-500/40">
      {/* ── Top Section: Plan Information ───────────────────── */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-amber-300">
            📅 {displayDate}
          </span>
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            {plan.type}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white sm:text-xl">
          {plan.holiday}
        </h3>

        <div className="mt-3 rounded-xl border border-amber-500/15 bg-amber-950/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/80 mb-1">
            Planned Activity
          </p>
          <p className="text-sm font-medium leading-relaxed text-amber-50">
            💡 {plan.activity}
          </p>
        </div>
      </div>

      {/* ── QR Code Section ─────────────────────────────────── */}
      <div className="mt-5 pt-4 border-t border-stone-800/80 flex flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
          Scan to share plan
        </p>

        {/* Contract requirement: Use a plain <img> tag, not next/image */}
        <div className="rounded-xl border border-amber-500/30 bg-white p-2 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl(qrText, 200)}
            alt={`QR code for ${plan.holiday}`}
            width={200}
            height={200}
            className="block h-[200px] w-[200px] rounded-lg object-contain"
            loading="lazy"
          />
        </div>

        {/* ── Action Links / Buttons ─────────────────────────── */}
        <div className="mt-4 flex w-full items-center justify-between gap-3">
          {/* Contract requirement: download link to qrUrl(text, 400, true) with download attribute */}
          <a
            href={qrUrl(qrText, 400, true)}
            download="plan-qr.png"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 px-3.5 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-900/50 hover:text-white"
          >
            ⬇ Download QR
          </a>

          {/* Delete button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-900/60 hover:text-white disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "🗑 Delete"}
          </button>
        </div>

        {/* Delete Error notice */}
        {deleteError && (
          <p className="mt-2 text-xs text-rose-400">
            ⚠️ {deleteError}
          </p>
        )}
      </div>
    </article>
  );
}
