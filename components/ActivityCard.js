// ─────────────────────────────────────────────────────────────
// components/ActivityCard.js
// Shows a randomly fetched activity idea for a holiday.
// The user can re-roll for another idea or save the plan.
// Props:
//   holiday   – {date, name} the chosen holiday
//   activity  – {activity, type, participants} or null
//   loading   – true while fetching a new activity
//   onReroll  – callback to fetch another random activity
//   onSave    – callback to save this holiday + activity as a plan
//   saving    – true while save is in progress
// Person A owns this file.
// ─────────────────────────────────────────────────────────────

"use client";

export default function ActivityCard({
  holiday,
  activity,
  loading,
  onReroll,
  onSave,
  saving,
}) {
  // Don't render anything until a holiday is picked
  if (!holiday) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                    p-6 shadow-xl backdrop-blur-md">
      {/* Header: which holiday are we planning? */}
      <h3 className="mb-1 text-lg font-bold text-white">
        🎯 Plan for {holiday.name}
      </h3>
      <p className="mb-5 text-sm text-slate-400">{holiday.date}</p>

      {/* ── Loading spinner ─────────────────────────────── */}
      {loading && (
        <div className="flex items-center gap-2 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          <span className="text-slate-400">Finding an activity…</span>
        </div>
      )}

      {/* ── Activity details ────────────────────────────── */}
      {!loading && activity && (
        <div className="mb-5 space-y-2">
          <p className="text-xl font-semibold text-white">
            💡 {activity.activity}
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Type badge */}
            <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-xs font-medium text-purple-300">
              {activity.type}
            </span>
            {/* Participants badge */}
            <span className="rounded-full bg-sky-500/20 px-3 py-0.5 text-xs font-medium text-sky-300">
              {activity.participants === 1
                ? "Solo"
                : `${activity.participants} people`}
            </span>
          </div>
        </div>
      )}

      {/* ── Buttons ─────────────────────────────────────── */}
      {!loading && activity && (
        <div className="flex gap-3">
          {/* Re-roll for a different activity */}
          <button
            onClick={onReroll}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm
                       font-medium text-white transition hover:bg-white/10 active:scale-95"
          >
            🎲 Different idea
          </button>

          {/* Save this plan */}
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white
                       shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-500
                       active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving…" : "✅ Save plan"}
          </button>
        </div>
      )}
    </div>
  );
}
