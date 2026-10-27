# Holiday Planner 🗓️

A Next.js web app that helps you explore public holidays, get fun activity ideas,
save your plans, and share them as QR codes — all powered by free, keyless APIs.

---

## What the App Does

1. **Pick a country and year** — choose from every country supported by Nager.Date.
2. **See public holidays** — displayed in a clean list, with long weekends highlighted.
3. **Get a random activity idea** — click any holiday to get a suggested activity
   (e.g. "Go hiking", "Bake a traditional bread").
4. **Save a plan** — store holiday + activity combinations to Pantry cloud storage.
5. **View saved plans** — browse all plans on a dedicated page, each with a
   shareable QR code you can download.

---

## Feature List

| Feature | Details |
|---|---|
| Country selector | All countries from Nager.Date |
| Holiday list | Sorted by date, long weekends flagged |
| Activity suggestions | Random, optionally filtered by type |
| Plan storage | Saved to Pantry cloud (free, no account for readers) |
| QR codes | Generated on the fly via goQR, downloadable as PNG |
| Error resilience | Bored API failure falls back to 15 built-in activities |

---

## APIs Used

### 1. Nager.Date — `lib/nager.js`
- **Website:** https://date.nager.at
- **Key needed:** No
- **How we use it:**
  - `GET /api/v3/AvailableCountries` → list of countries for the dropdown
  - `GET /api/v3/PublicHolidays/{year}/{country}` → holidays for the selected year
  - `GET /api/v3/LongWeekend/{year}/{country}` → date ranges used to flag long weekends

### 2. Bored API — `lib/bored.js`
- **Website:** https://bored-api.appbrewery.com
- **Key needed:** No
- **Rate limit:** 100 requests per 15 minutes
- **How we use it:**
  - `GET /random` → one random activity (no type filter)
  - `GET /filter?type={type}` → filtered list; we pick one at random
  - If the API is down or rate-limited (429), we fall back to 15 built-in activities
    covering all 7 types (education, recreational, social, charity, cooking,
    relaxation, busywork)

### 3. Pantry — `lib/pantry.js`
- **Website:** https://getpantry.cloud
- **Key needed:** Yes — a free Pantry ID (see Setup)
- **How we use it:**
  - Stores a single basket called `plans` containing `{ "plans": [...] }`
  - `GET` basket → load all plans
  - `POST` basket → add or remove a plan (Pantry POST replaces the whole basket)

### 4. goQR — `app/api/qr/route.js`
- **Website:** https://goqr.me/api
- **Key needed:** No
- **How we use it:**
  - `GET https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...`
  - We proxy the PNG through `/api/qr` so we can control caching, size limits,
    and the download header

---

## Setup

### Prerequisites
- Node.js 18 or later
- A free [Pantry](https://getpantry.cloud) account

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd holiday-planner

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and replace "your-pantry-id-here" with your real Pantry ID.
# You can find your Pantry ID on the Pantry dashboard after signing up.

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PANTRY_ID` | ✅ Yes | Your Pantry basket ID from https://getpantry.cloud |

> **Never commit `.env.local` to git.** It is already listed in `.gitignore`.

---

## Deployment on Vercel

1. Push your code to GitHub (make sure `.env.local` is **not** committed).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. In the Vercel dashboard, go to **Settings → Environment Variables**.
4. Add `PANTRY_ID` with your real Pantry ID as the value.
5. Click **Deploy**.

Vercel automatically detects Next.js and configures everything for you.

---

## API Reference (quick test URLs)

| Method | URL | Description |
|---|---|---|
| GET | `/api/countries` | All supported countries |
| GET | `/api/holidays?country=IN&year=2026` | India's holidays in 2026 |
| GET | `/api/activity` | Random activity (any type) |
| GET | `/api/activity?type=social` | Random social activity |
| GET | `/api/plans` | All saved plans |
| POST | `/api/plans` | Save a new plan |
| DELETE | `/api/plans?id=abc123` | Delete a plan |
| GET | `/api/qr?data=Hello&size=300` | QR code PNG |
| GET | `/api/qr?data=Hello&download=1` | Download QR code as PNG |

---

## Live Demo

🔗 **https://holiday-planner.vercel.app** *(placeholder — replace after deploying)*

---

## Project Structure

```
app/
  api/
    countries/route.js   ← returns list of countries
    holidays/route.js    ← returns public holidays
    activity/route.js    ← returns a random activity
    plans/route.js       ← CRUD for saved plans
    qr/route.js          ← proxies goQR PNG image
  page.js                ← home page (Person A)
  plans/page.js          ← saved plans page (Person A)
  layout.js              ← root layout (Person A)
  globals.css            ← global styles (Person A)
lib/
  nager.js               ← Nager.Date API helper
  bored.js               ← Bored API helper with fallback
  pantry.js              ← Pantry basket helper
  api.js                 ← frontend fetch helpers (Person A)
  mockData.js            ← mock data for development (Person A)
components/              ← UI components (Person A)
.env.example             ← template for environment variables
```
