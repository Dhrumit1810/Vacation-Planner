// ─────────────────────────────────────────────────────────────
// components/TopControls.js
// Header filter controls for country, year, and activity type.
// Fully mobile-first, responsive with warm festive styling.
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

"use client";

// The 7 allowed types from the API contract + "Any"
export const ACTIVITY_TYPES = [
  { value: "any", label: "Any Type" },
  { value: "education", label: "Education" },
  { value: "recreational", label: "Recreational" },
  { value: "social", label: "Social" },
  { value: "charity", label: "Charity" },
  { value: "cooking", label: "Cooking" },
  { value: "relaxation", label: "Relaxation" },
  { value: "busywork", label: "Busywork" },
];

export default function TopControls({
  countries,
  selectedCountry,
  onCountryChange,
  years,
  selectedYear,
  onYearChange,
  selectedType,
  onTypeChange,
  loadingCountries,
  countryError,
  onRetryCountries,
}) {
  return (
    <section className="mb-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-stone-900/60 to-rose-950/40 p-5 shadow-lg backdrop-blur-md">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* ── 1. Country Dropdown ─────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country-select" className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">
            🌍 Select Country
          </label>

          {loadingCountries ? (
            <div className="flex h-11 items-center rounded-xl border border-amber-500/20 bg-stone-900/80 px-3 text-sm text-stone-400">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mr-2" />
              Loading countries...
            </div>
          ) : countryError ? (
            <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/50 px-3 py-2 text-xs text-rose-300">
              <span className="truncate">{countryError}</span>
              <button
                type="button"
                onClick={onRetryCountries}
                className="ml-2 rounded bg-rose-800 px-2 py-1 font-medium text-white hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <select
              id="country-select"
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="h-11 rounded-xl border border-amber-500/30 bg-stone-900/90 px-3.5 text-sm font-medium text-amber-50 shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code} className="bg-stone-900 text-stone-100">
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ── 2. Year Dropdown (last year, this year, next year) ─ */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="year-select" className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">
            📅 Select Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="h-11 rounded-xl border border-amber-500/30 bg-stone-900/90 px-3.5 text-sm font-medium text-amber-50 shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-stone-900 text-stone-100">
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* ── 3. Activity Type Dropdown ("Any" + 7 types) ─────── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type-select" className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">
            💡 Activity Idea Type
          </label>
          <select
            id="type-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-11 rounded-xl border border-amber-500/30 bg-stone-900/90 px-3.5 text-sm font-medium text-amber-50 shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-stone-900 text-stone-100">
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
