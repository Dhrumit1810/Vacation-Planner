// ─────────────────────────────────────────────────────────────
// components/NextHolidayBanner.js
// Highlighted banner showing the next upcoming holiday and countdown.
// Computes N days in the browser by parsing "YYYY-MM-DD" as a
// local date by splitting the string (never new Date("YYYY-MM-DD")).
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

"use client";

import { getDaysUntil, formatHolidayDate } from "@/lib/api";

export default function NextHolidayBanner({ holidays }) {
  if (!holidays || holidays.length === 0) {
    return null;
  }

  // Find the first holiday whose date is today or in the future
  let nextHoliday = null;
  let nextDays = null;

  for (const h of holidays) {
    const days = getDaysUntil(h.date);
    if (days >= 0) {
      nextHoliday = h;
      nextDays = days;
      break;
    }
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 p-5 shadow-xl backdrop-blur-md">
      {/* Decorative festive corner glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />

      {nextHoliday ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl shadow-inner">
              ✨
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Upcoming Highlight
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Next holiday: <span className="text-amber-200">{nextHoliday.name}</span>{" "}
                {nextDays === 0 ? (
                  <span className="inline-block rounded-full bg-emerald-500/30 px-3 py-0.5 text-sm font-extrabold text-emerald-300">
                    Today 🎉
                  </span>
                ) : (
                  <span className="text-amber-300 font-extrabold">
                    in {nextDays === 1 ? "1 day" : `${nextDays} days`}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="mt-2 sm:mt-0 flex items-center gap-2 self-start sm:self-auto">
            <span className="rounded-xl border border-amber-400/20 bg-stone-900/60 px-3 py-1.5 text-xs font-medium text-amber-100">
              📅 {formatHolidayDate(nextHoliday.date)}
            </span>
            {nextHoliday.longWeekend && (
              <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1.5 text-xs font-semibold text-emerald-300">
                🎉 Long Weekend
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-xl">
            🏖️
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-100">
              All holidays for this year have already passed!
            </p>
            <p className="text-xs text-amber-200/70">
              Select next year in the dropdown above to plan ahead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
