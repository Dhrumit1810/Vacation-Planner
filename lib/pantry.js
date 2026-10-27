/**
 * lib/pantry.js
 *
 * Stores and retrieves plans using Pantry (https://getpantry.cloud).
 * Pantry lets you save a JSON "basket" on their servers for free.
 * No SDK needed – we just call their REST API with fetch.
 *
 * Required environment variable: PANTRY_ID  (set in .env.local)
 *
 * Basket shape stored on Pantry:
 *   { "plans": [ { id, holiday, date, activity, type, createdAt }, … ] }
 *
 * Exported functions:
 *   getPlans()          – return all saved plans (empty list if basket missing)
 *   addPlan(plan)       – add a plan; returns the new plan object with id + createdAt
 *   removePlan(id)      – remove the plan with that id; returns nothing
 */

// Build the basket URL once so we don't repeat ourselves.
function basketUrl() {
  const id = process.env.PANTRY_ID;

  // Fail fast if the developer forgot to set the environment variable.
  if (!id) {
    throw new Error(
      "PANTRY_ID is missing. Add it to .env.local (see .env.example)."
    );
  }

  return `https://getpantry.cloud/apiv1/pantry/${id}/basket/plans`;
}

// Cache the last known plans in memory as a fallback if Pantry is temporarily rate-limited (429).
let lastKnownPlans = null;

// Retry helper with backoff for Pantry's per-second rate limits.
async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options);
    if (res.status === 429 && attempt < retries) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      continue;
    }
    return res;
  }
}

// ─── getPlans ─────────────────────────────────────────────────────────────────

/**
 * Fetch all plans from the Pantry basket.
 * If the basket doesn't exist yet (404/400), return an empty list instead of crashing.
 * If Pantry is rate-limited (429), retries automatically, then falls back to memory.
 */
export async function getPlans() {
  const res = await fetchWithRetry(basketUrl(), { cache: "no-store" });

  // 404 or 400 with "does not exist" means the basket hasn't been created yet – return empty.
  if (res.status === 404) {
    lastKnownPlans = [];
    return [];
  }
  if (res.status === 400) {
    const text = await res.text();
    if (text.includes("does not exist")) {
      lastKnownPlans = [];
      return [];
    }
    throw new Error(`Pantry GET failed: 400 - ${text}`);
  }

  // If rate-limited after retries, return last known plans if available
  if (res.status === 429 && lastKnownPlans !== null) {
    console.warn("[lib/pantry] 429 rate limit encountered; serving last known plans fallback");
    return lastKnownPlans;
  }

  if (!res.ok) {
    throw new Error(`Pantry GET failed: ${res.status}`);
  }

  const data = await res.json();
  const plans = Array.isArray(data.plans) ? data.plans : [];
  lastKnownPlans = plans;
  return plans;
}

// ─── addPlan ──────────────────────────────────────────────────────────────────

/**
 * Add a new plan to the basket.
 *
 * @param {{ holiday: string, date: string, activity: string, type: string }} plan
 * @returns {object}  The full plan object including the new id and createdAt.
 */
export async function addPlan(plan) {
  // Read the current list first.
  const plans = await getPlans();

  // Build the new plan with a unique id and a timestamp.
  const newPlan = {
    id: crypto.randomUUID(), // built-in – no extra package needed
    holiday: plan.holiday,
    date: plan.date,
    activity: plan.activity,
    type: plan.type,
    createdAt: new Date().toISOString(),
  };

  plans.push(newPlan);

  // POST the entire updated list back (Pantry POST replaces the whole basket).
  await savePlans(plans);

  return newPlan;
}

// ─── removePlan ───────────────────────────────────────────────────────────────

/**
 * Remove the plan with the given id from the basket.
 *
 * @param {string} id  The plan's id.
 */
export async function removePlan(id) {
  const plans = await getPlans();

  // Keep every plan except the one being deleted.
  const updated = plans.filter((p) => p.id !== id);

  await savePlans(updated);
}

// ─── savePlans (private helper) ───────────────────────────────────────────────

/**
 * Write the whole plans list back to the Pantry basket.
 * Pantry uses POST to replace (not PATCH to merge).
 */
async function savePlans(plans) {
  const res = await fetchWithRetry(basketUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plans }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Pantry POST failed: ${res.status}`);
  }

  lastKnownPlans = plans;
}
