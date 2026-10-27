// ─────────────────────────────────────────────────────────────
// components/HolidayCard.js
// Individual holiday card displaying:
//   - Formatted date ("Mon, 26 Jan 2026")
//   - Holiday name
//   - "Long weekend" badge when longWeekend is true
//   - Countdown label ("in 12 days", "Today", or "Passed")
//   - Past holidays shown dimmed
//   - "Get activity idea" button -> calls getActivity(selectedType)
//   - Activity text and type badge
//   - Button turns to "Try another" for reroll
//   - "Save plan" button appears once an activity exists
//   - Calls savePlan({holiday, date, activity, type})
//   - Small "Saved!" message once saved
//   - Loading states and friendly error messages with Retry buttons
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import {
  getActivity,
  savePlan,
  getDaysUntil,
  getCountdownLabel,
  formatHolidayDate,
} from "@/lib/api";

export default function HolidayCard({ holiday, selectedType }) {
  // Activity state
  const [activity, setActivity] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState("");

  // Saving state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Calculate days until holiday and countdown status
  const days = getDaysUntil(holiday.date);
  const countdownLabel = getCountdownLabel(days);
  const isPast = days < 0;
  const isToday = days === 0;

  // ── Fetch an activity idea ─────────────────────────────────
  async function handleFetchActivity() {
    setLoadingActivity(true);
    setActivityError("");
    setSaved(false); // Reset saved status on re-roll

    try {
      const data = await getActivity(selectedType);
      setActivity(data);
    } catch (err) {
      setActivityError(err.message || "Could not fetch activity idea.");
    } finally {
      setLoadingActivity(false);
    }
  }

  // ── Save the plan ──────────────────────────────────────────
  async function handleSavePlan() {
    if (!activity) return;

    setSaving(true);
    setSaveError("");

    try {
      await savePlan({
        holiday: holiday.name,
        date: holiday.date,
        activity: activity.activity,
        type: activity.type,
      });
      setSaved(true);
    } catch (err) {
      setSaveError(err.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${
        isPast
          ? "border-stone-800/80 bg-stone-900/40 opacity-65 hover:opacity-100"
          : isToday
          ? "border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 to-stone-900/80 shadow-lg shadow-emerald-500/10"
          : "border-amber-500/20 bg-gradient-to-br from-stone-900/90 via-stone-900/70 to-amber-950/20 shadow-md hover:border-amber-500/40 hover:shadow-xl"
      }`}
    >
      {/* ── Top row: Badges (Countdown & Long weekend) ────────── */}
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {/* Formatted date */}
          <span className="text-xs font-semibold text-amber-300/90">
            📅 {formatHolidayDate(holiday.date)}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Long weekend badge */}
            {holiday.longWeekend && (
              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                🎉 Long weekend
              </span>
            )}

            {/* Countdown badge */}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isToday
                  ? "bg-emerald-500/30 text-emerald-300 ring-1 ring-emerald-400/40"
                  : isPast
                  ? "bg-stone-800 text-stone-400"
                  : "bg-amber-500/20 text-amber-200"
              }`}
            >
              {countdownLabel}
            </span>
          </div>
        </div>

        {/* ── Holiday Name ────────────────────────────────────── */}
        <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
          {holiday.name}
        </h3>
      </div>

      {/* ── Activity Idea Section ────────────────────────────── */}
      <div className="mt-4">
        {/* Loading activity state */}
        {loadingActivity && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-stone-900/60 p-3 text-xs text-amber-200">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            Generating activity idea...
          </div>
        )}

        {/* Activity fetch error state with retry */}
        {activityError && !loadingActivity && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
            <div className="flex items-center justify-between gap-2">
              <span>⚠️ {activityError}</span>
              <button
                type="button"
                onClick={handleFetchActivity}
                className="rounded bg-rose-800/80 px-2 py-1 font-semibold text-white transition hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Display fetched activity */}
        {activity && !loadingActivity && (
          <div className="rounded-xl border border-amber-400/25 bg-amber-950/30 p-3.5 shadow-sm backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-relaxed text-amber-50">
                💡 {activity.activity}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                {activity.type}
              </span>
              {activity.participants && (
                <span className="text-[11px] text-stone-400">
                  👥 {activity.participants === 1 ? "Solo" : `${activity.participants} people`}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Save error state */}
        {saveError && !saving && (
          <div className="mt-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2 text-xs text-rose-300 flex items-center justify-between">
            <span>⚠️ {saveError}</span>
            <button
              type="button"
              onClick={handleSavePlan}
              className="rounded bg-rose-800/80 px-2 py-0.5 font-semibold text-white hover:bg-rose-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Buttons Row ─────────────────────────────────────── */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/60">
          {/* Main button: "Get activity idea" / "Try another" */}
          <button
            type="button"
            onClick={handleFetchActivity}
            disabled={loadingActivity || saving}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${
              activity
                ? "border border-amber-500/30 bg-stone-800/80 text-amber-200 hover:bg-stone-700 hover:text-white"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400"
            }`}
          >
            {loadingActivity
              ? "Loading..."
              : activity
              ? "🎲 Try another"
              : "✨ Get activity idea"}
          </button>

          {/* "Save plan" button (appears once an activity exists) */}
          {activity && (
            <button
              type="button"
              onClick={handleSavePlan}
              disabled={saving || saved}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all active:scale-95 disabled:opacity-60 ${
                saved
                  ? "border border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                  : "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
              }`}
            >
              {saving ? "Saving..." : saved ? "✓ Saved!" : "💾 Save plan"}
            </button>
          )}

          {/* Saved notification badge */}
          {saved && (
            <span className="text-xs font-medium text-emerald-400 animate-fade-in">
              Saved to your plans!
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
