// ─────────────────────────────────────────────────────────────
// app/layout.js
// Root layout for Holiday Planner.
// Server Component containing:
//   - HTML shell with metadata
//   - Responsive navbar with app name and navigation links
//   - Warm festive background styling with subtle amber accents
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Holiday Planner - Festive Public Holidays & Activities",
  description:
    "Pick a country and year, explore public holidays, get creative activity ideas, and save your plans with scannable QR codes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-stone-950 font-sans text-stone-100 antialiased selection:bg-amber-500/30 selection:text-amber-200"
      >
        {/* ── Background Festive Ambient Glow ───────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-amber-600/10 via-orange-600/5 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-rose-600/5 blur-3xl" />
        </div>

        {/* ── Navigation Bar ─────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-stone-950/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            {/* App Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 group transition"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-lg shadow-md shadow-amber-500/20 transition group-hover:scale-105">
                🌴
              </span>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white group-hover:text-amber-300 transition">
                  Holiday Planner
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80 -mt-0.5">
                  Celebrate & Plan
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-300 transition hover:bg-stone-900 hover:text-amber-300 active:scale-95"
              >
                🏠 Home
              </Link>
              <Link
                href="/plans"
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-200 transition hover:bg-amber-900/40 hover:text-white active:scale-95 shadow-sm"
              >
                <span>📋</span>
                <span>My Plans</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Main Content ───────────────────────────────────── */}
        <div className="pb-16">{children}</div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-500">
          <p>Holiday Planner • Built with Next.js & Tailwind CSS</p>
        </footer>
      </body>
    </html>
  );
}
