// ─────────────────────────────────────────────────────────────
// app/page.js
// Home Page for Holiday Planner.
// Features:
//   - Country selector (defaults to India "IN" if present, else first)
//   - Year selector (last year, this year, next year)
//   - Activity type dropdown ("Any" + 7 contract types)
//   - Highlighted Next Holiday banner with timezone-safe countdown
//   - Grid of Holiday cards with activity idea generator & plan saving
//   - Full loading states and error retry handlers
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import TopControls from "@/components/TopControls";
import NextHolidayBanner from "@/components/NextHolidayBanner";
import HolidayCard from "@/components/HolidayCard";
import { getCountries, getHolidays } from "@/lib/api";

function HomePageContent() {
  // Calendar year state (defaults to 2026, synchronized on mount)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [years, setYears] = useState([2025, 2026, 2027]);

  // Sync current year after mount in the browser
  useEffect(() => {
    const y = new Date().getFullYear();
    setSelectedYear(y);
    setYears([y - 1, y, y + 1]);
  }, []);

  // ── States ──────────────────────────────────────────────────
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedType, setSelectedType] = useState("any");

  // Loading & error states for countries
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countryError, setCountryError] = useState("");

  // Loading & error states for holidays
  const [holidays, setHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [holidayError, setHolidayError] = useState("");

  // ── 1. Fetch Countries on Mount ─────────────────────────────
  const loadCountries = useCallback(async () => {
    setLoadingCountries(true);
    setCountryError("");

    try {
      const data = await getCountries();
      setCountries(data);

      if (data && data.length > 0) {
        // Contract requirement: default India "IN" if present, otherwise the first item
        const hasIndia = data.find((c) => c.code.toUpperCase() === "IN");
        if (hasIndia) {
          setSelectedCountry("IN");
        } else {
          setSelectedCountry(data[0].code);
        }
      }
    } catch (err) {
      setCountryError(err.message || "Failed to load countries list.");
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  // ── 2. Fetch Holidays when country or year changes ──────────
  const loadHolidays = useCallback(async () => {
    if (!selectedCountry) return;

    setLoadingHolidays(true);
    setHolidayError("");

    try {
      const data = await getHolidays(selectedCountry, selectedYear);
      setHolidays(data || []);
    } catch (err) {
      setHolidayError(err.message || "Failed to load holidays for this country/year.");
    } finally {
      setLoadingHolidays(false);
    }
  }, [selectedCountry, selectedYear]);

  useEffect(() => {
    if (selectedCountry) {
      loadHolidays();
    }
  }, [selectedCountry, selectedYear, loadHolidays]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          🌴 Plan Your Next Holiday
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-300">
          Pick a destination and year to discover public holidays, get creative activity ideas, and save plans with QR codes.
        </p>
      </div>

      {/* ── Top Controls (Country, Year, Activity Type) ────── */}
      <TopControls
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        loadingCountries={loadingCountries}
        countryError={countryError}
        onRetryCountries={loadCountries}
      />

      {/* ── Next Holiday Highlight Banner ──────────────────── */}
      {!loadingHolidays && !holidayError && holidays.length > 0 && (
        <NextHolidayBanner holidays={holidays} />
      )}

      {/* ── Holiday List Section ───────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Public Holidays ({holidays.length})
          </h2>
          {selectedCountry && (
            <span className="text-xs font-semibold text-amber-300">
              Year {selectedYear}
            </span>
          )}
        </div>

        {/* ── Loading State ─────────────────────────────────── */}
        {loadingHolidays && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-stone-900/40 py-16 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-amber-200">
              Fetching public holidays...
            </p>
          </div>
        )}

        {/* ── Error State with Retry Button ─────────────────── */}
        {holidayError && !loadingHolidays && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-6 text-center shadow-lg backdrop-blur-md">
            <p className="text-2xl mb-1">⚠️</p>
            <h3 className="text-base font-bold text-rose-200">
              Unable to load holidays
            </h3>
            <p className="mt-1 text-xs text-rose-300/90">{holidayError}</p>
            <button
              type="button"
              onClick={loadHolidays}
              className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-rose-600 active:scale-95"
            >
              🔄 Retry Fetching Holidays
            </button>
          </div>
        )}

        {/* ── Empty State ───────────────────────────────────── */}
        {!loadingHolidays && !holidayError && holidays.length === 0 && (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-12 text-center backdrop-blur-sm">
            <p className="text-4xl mb-2">🏖️</p>
            <p className="text-base font-semibold text-stone-200">
              No holidays found
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Try picking a different country or year above.
            </p>
          </div>
        )}

        {/* ── Holiday Cards Grid ────────────────────────────── */}
        {!loadingHolidays && !holidayError && holidays.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {holidays.map((holiday) => (
              <HolidayCard
                key={`${holiday.date}-${holiday.name}`}
                holiday={holiday}
                selectedType={selectedType}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-4 py-16 text-center text-amber-200">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-3" />
          <p className="text-sm">Loading Holiday Planner...</p>
        </main>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

