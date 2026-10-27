// ─────────────────────────────────────────────────────────────
// components/YearPicker.js
// A dropdown that lets the user pick a year (current ± 2).
// Props:
//   value    – currently selected year (number)
//   onChange – callback when a new year is picked
//   disabled – true while loading
// Person A owns this file.
// ─────────────────────────────────────────────────────────────

"use client";

export default function YearPicker({ value, onChange, disabled }) {
  // Build an array of 5 years centred on the current year
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    years.push(y);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="year-picker" className="text-sm font-medium text-slate-300">
        Year
      </label>

      <select
        id="year-picker"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white
                   backdrop-blur-sm transition focus:border-indigo-400 focus:outline-none
                   focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-40"
      >
        {years.map((y) => (
          <option key={y} value={y} className="bg-slate-900">
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
