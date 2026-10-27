// ─────────────────────────────────────────────────────────────
// components/HolidayList.js
// Shows a table of public holidays. Each row has a
// "Plan this!" button that the parent uses to fetch an activity.
// Props:
//   holidays     – array of {date, name, longWeekend}
//   onPlanHoliday – callback(holiday) when user clicks "Plan this!"
//   loading       – true while holidays are being fetched
// Person A owns this file.
// ─────────────────────────────────────────────────────────────

"use client";

export default function HolidayList({ holidays, onPlanHoliday, loading }) {
  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
        <span className="ml-3 text-slate-400">Loading holidays…</span>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────
  if (!holidays || holidays.length === 0) {
    return (
      <p className="py-12 text-center text-slate-500">
        No holidays found. Pick a country and year above ☝️
      </p>
    );
  }

  // ── Format a date string like "Mon, 26 Jan 2026" ────────
  function formatDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // ── Table of holidays ───────────────────────────────────
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Holiday</th>
            <th className="px-5 py-3 text-center">Long Weekend?</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {holidays.map((h) => (
            <tr
              key={h.date + h.name}
              className="transition hover:bg-white/5"
            >
              {/* Date column */}
              <td className="whitespace-nowrap px-5 py-3 text-slate-300">
                {formatDate(h.date)}
              </td>

              {/* Holiday name */}
              <td className="px-5 py-3 font-medium text-white">{h.name}</td>

              {/* Long weekend badge */}
              <td className="px-5 py-3 text-center">
                {h.longWeekend ? (
                  <span className="inline-block rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    Yes 🎉
                  </span>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </td>

              {/* Plan button */}
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => onPlanHoliday(h)}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white
                             shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500
                             active:scale-95"
                >
                  Plan this!
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
