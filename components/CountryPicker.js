// ─────────────────────────────────────────────────────────────
// components/CountryPicker.js
// A dropdown that lets the user pick a country.
// Props:
//   countries  – array of {code, name}
//   value      – currently selected country code
//   onChange   – callback when a new country is picked
//   disabled   – true while loading
// Person A owns this file.
// ─────────────────────────────────────────────────────────────

"use client";

export default function CountryPicker({ countries, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label for accessibility */}
      <label htmlFor="country-picker" className="text-sm font-medium text-slate-300">
        Country
      </label>

      <select
        id="country-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white
                   backdrop-blur-sm transition focus:border-indigo-400 focus:outline-none
                   focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-40"
      >
        {/* Default prompt */}
        <option value="" className="bg-slate-900">
          Select a country…
        </option>

        {/* One option per country */}
        {countries.map((c) => (
          <option key={c.code} value={c.code} className="bg-slate-900">
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
