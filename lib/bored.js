/**
 * lib/bored.js
 *
 * Fetches a random activity from the Bored API (https://bored-api.appbrewery.com).
 * No API key needed. Rate limit: 100 requests / 15 minutes.
 *
 * If the API is down or returns 429 (Too Many Requests), we silently
 * fall back to a local list of 15 backup activities so the app never breaks.
 *
 * Exported function:
 *   getActivity(type?)   – type is optional; one of the 7 allowed values
 */

const BASE = "https://bored-api.appbrewery.com";

// ─── Backup list ──────────────────────────────────────────────────────────────
// 15 hardcoded activities, at least 2 per type, so we always have something
// to return even when the live API is unavailable.

const BACKUPS = [
  // education (2)
  { activity: "Read a book on a topic you know nothing about", type: "education", participants: 1 },
  { activity: "Watch a documentary about a different culture", type: "education", participants: 1 },
  // recreational (2)
  { activity: "Go for a nature hike and photograph wildlife", type: "recreational", participants: 1 },
  { activity: "Fly a kite at a local park", type: "recreational", participants: 2 },
  // social (2)
  { activity: "Host a board game night with friends", type: "social", participants: 4 },
  { activity: "Organise a neighbourhood picnic", type: "social", participants: 6 },
  // charity (2)
  { activity: "Volunteer at a local food bank", type: "charity", participants: 1 },
  { activity: "Collect old clothes and donate them to a shelter", type: "charity", participants: 2 },
  // cooking (2)
  { activity: "Bake a traditional bread from scratch", type: "cooking", participants: 1 },
  { activity: "Try cooking a dish from a country you haven't visited", type: "cooking", participants: 2 },
  // relaxation (3)
  { activity: "Do a 20-minute guided meditation", type: "relaxation", participants: 1 },
  { activity: "Take a long bath with candles and soft music", type: "relaxation", participants: 1 },
  { activity: "Spend an hour in a garden or park with no phone", type: "relaxation", participants: 1 },
  // busywork (2)
  { activity: "Organise and label all your digital photos", type: "busywork", participants: 1 },
  { activity: "Deep-clean one room in your home", type: "busywork", participants: 1 },
];

// ─── Helper: pick a random item from an array ─────────────────────────────────

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Helper: shape a raw API response into our 3-field format ─────────────────

function shape(item) {
  return {
    activity: item.activity,
    type: item.type,
    participants: item.participants,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetch one random activity.
 *
 * @param {string|undefined} type  Optional. One of the 7 allowed activity types.
 * @returns {{ activity: string, type: string, participants: number }}
 */
export async function getActivity(type) {
  try {
    let url;

    if (type) {
      // /filter?type=… returns a LIST – we pick one at random.
      url = `${BASE}/filter?type=${encodeURIComponent(type)}`;
    } else {
      // /random returns a SINGLE object.
      url = `${BASE}/random`;
    }

    const res = await fetch(url, { cache: "no-store" });

    // 429 = rate-limited; any other non-OK status is also a failure → use backup.
    if (!res.ok) {
      console.warn(`Bored API returned ${res.status} – using backup list`);
      return shape(pickBackup(type));
    }

    const data = await res.json();

    if (type) {
      // /filter returns an array; it might be empty for unknown types.
      if (!Array.isArray(data) || data.length === 0) {
        return shape(pickBackup(type));
      }
      return shape(randomItem(data));
    }

    // /random returns a plain object.
    return shape(data);
  } catch (err) {
    // Network error, JSON parse error, etc.
    console.warn("Bored API unreachable – using backup list:", err.message);
    return shape(pickBackup(type));
  }
}

// ─── Backup picker ────────────────────────────────────────────────────────────

/**
 * Pick a random backup activity, optionally filtered by type.
 */
function pickBackup(type) {
  const pool = type
    ? BACKUPS.filter((a) => a.type === type)
    : BACKUPS;

  // If somehow the type doesn't match anything (shouldn't happen), use all.
  return randomItem(pool.length > 0 ? pool : BACKUPS);
}
