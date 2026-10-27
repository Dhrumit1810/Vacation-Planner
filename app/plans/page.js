// ─────────────────────────────────────────────────────────────
// app/plans/page.js
// My Plans Page for Holiday Planner.
// Features:
//   - "Share this site" section at top with 250px QR code of origin
//   - Grid of saved plan cards with holiday, date, activity, type badge
//   - Plain 200px <img> QR code with text = "<holiday> on <date>: <activity>"
//   - Download QR link to qrUrl(text, 400, true) with download attribute
//   - Delete button calling deletePlan to remove card
//   - Empty state when no plans exist with link back to Home
//   - Full loading states and error retry handlers
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import PlanCard from "@/components/PlanCard";
import ShareSiteCard from "@/components/ShareSiteCard";
import { getPlans, deletePlan } from "@/lib/api";

function PlansPageContent() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch Saved Plans ──────────────────────────────────────
  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPlans();
      setPlans(data || []);
    } catch (err) {
      setError(err.message || "Failed to load saved plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // ── Delete a plan ──────────────────────────────────────────
  async function handleDelete(planId) {
    await deletePlan(planId);
    // Optimistically remove from state
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Top Share Section ───────────────────────────────── */}
      <ShareSiteCard />

      {/* ── Plans Section Header ────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            📋 My Saved Plans ({plans.length})
          </h1>
          <p className="mt-1 text-sm text-stone-300">
            View your upcoming holiday ideas with ready-to-scan QR codes.
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto rounded-xl border border-amber-500/30 bg-stone-900/80 px-4 py-2 text-xs font-bold text-amber-300 shadow-md transition hover:bg-stone-800 hover:text-white active:scale-95"
        >
          ➕ Plan Another Holiday
        </Link>
      </div>

      {/* ── Loading State ───────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-stone-900/40 py-16 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-amber-200">
            Loading your saved plans...
          </p>
        </div>
      )}

      {/* ── Error State with Retry ──────────────────────────── */}
      {error && !loading && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-6 text-center shadow-lg backdrop-blur-md">
          <p className="text-2xl mb-1">⚠️</p>
          <h3 className="text-base font-bold text-rose-200">
            Unable to load plans
          </h3>
          <p className="mt-1 text-xs text-rose-300/90">{error}</p>
          <button
            type="button"
            onClick={loadPlans}
            className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-rose-600 active:scale-95"
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────────── */}
      {!loading && !error && plans.length === 0 && (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-12 text-center backdrop-blur-md">
          <span className="text-5xl">🏖️</span>
          <h2 className="mt-4 text-xl font-bold text-white">
            No saved plans yet!
          </h2>
          <p className="mt-2 text-sm text-stone-400 max-w-md mx-auto">
            You haven&apos;t saved any holiday plans yet. Browse public holidays and generate creative activity ideas to get started.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400 active:scale-95"
            >
              🌴 Discover Holidays & Activities
            </Link>
          </div>
        </div>
      )}

        {/* ── Plans Grid ──────────────────────────────────────── */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    );
  }

  export default function PlansPage() {
    return (
      <Suspense
        fallback={
          <main className="mx-auto max-w-5xl px-4 py-16 text-center text-amber-200">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-3" />
            <p className="text-sm">Loading My Plans...</p>
          </main>
        }
      >
        <PlansPageContent />
      </Suspense>
    );
  }

