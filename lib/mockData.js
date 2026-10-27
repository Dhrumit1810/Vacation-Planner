// ─────────────────────────────────────────────────────────────
// lib/mockData.js
// Realistic fake data matching the API contract endpoints.
// Used when USE_MOCK is true so the frontend works smoothly
// before the backend is finished.
// Owned by Person A (Frontend).
// ─────────────────────────────────────────────────────────────

/**
 * 8 sample countries (matches GET /api/countries contract)
 * Includes India ("IN") which will be the default selection.
 */
export const MOCK_COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "JP", name: "Japan" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
];

/**
 * Realistic public holidays for each of the 8 countries in mock mode.
 * Dates are specified as "MM-DD" and combined with the selected year.
 */
export const MOCK_HOLIDAYS_BY_COUNTRY = {
  IN: [
    { date: "01-26", name: "Republic Day", longWeekend: true },
    { date: "03-04", name: "Holi", longWeekend: false },
    { date: "04-03", name: "Good Friday", longWeekend: true },
    { date: "05-01", name: "Labour Day", longWeekend: true },
    { date: "08-15", name: "Independence Day", longWeekend: false },
    { date: "10-02", name: "Mahatma Gandhi Jayanti", longWeekend: true },
    { date: "10-20", name: "Dussehra", longWeekend: false },
    { date: "11-08", name: "Diwali (Festival of Lights)", longWeekend: true },
    { date: "11-24", name: "Guru Nanak Jayanti", longWeekend: false },
    { date: "12-25", name: "Christmas Day", longWeekend: true },
  ],
  US: [
    { date: "01-01", name: "New Year's Day", longWeekend: true },
    { date: "01-19", name: "Martin Luther King Jr. Day", longWeekend: true },
    { date: "02-16", name: "Presidents' Day", longWeekend: true },
    { date: "05-25", name: "Memorial Day", longWeekend: true },
    { date: "06-19", name: "Juneteenth", longWeekend: true },
    { date: "07-04", name: "Independence Day", longWeekend: false },
    { date: "09-07", name: "Labor Day", longWeekend: true },
    { date: "10-12", name: "Columbus Day", longWeekend: true },
    { date: "11-26", name: "Thanksgiving Day", longWeekend: true },
    { date: "12-25", name: "Christmas Day", longWeekend: true },
  ],
  GB: [
    { date: "01-01", name: "New Year's Day", longWeekend: true },
    { date: "04-03", name: "Good Friday", longWeekend: true },
    { date: "04-06", name: "Easter Monday", longWeekend: true },
    { date: "05-04", name: "Early May Bank Holiday", longWeekend: true },
    { date: "05-25", name: "Spring Bank Holiday", longWeekend: true },
    { date: "08-31", name: "Summer Bank Holiday", longWeekend: true },
    { date: "11-30", name: "St Andrew's Day", longWeekend: true },
    { date: "12-25", name: "Christmas Day", longWeekend: true },
    { date: "12-26", name: "Boxing Day", longWeekend: false },
    { date: "12-28", name: "Boxing Day (substitute bank holiday)", longWeekend: true },
  ],
  JP: [
    { date: "01-01", name: "New Year's Day (Gantan)", longWeekend: true },
    { date: "01-12", name: "Coming of Age Day", longWeekend: true },
    { date: "02-11", name: "National Foundation Day", longWeekend: false },
    { date: "03-20", name: "Vernal Equinox Day", longWeekend: true },
    { date: "04-29", name: "Showa Day", longWeekend: false },
    { date: "05-03", name: "Constitution Memorial Day", longWeekend: true },
    { date: "05-05", name: "Children's Day", longWeekend: false },
    { date: "07-20", name: "Marine Day", longWeekend: true },
    { date: "08-11", name: "Mountain Day", longWeekend: false },
    { date: "11-03", name: "Culture Day", longWeekend: false },
  ],
  FR: [
    { date: "01-01", name: "Jour de l'An (New Year)", longWeekend: true },
    { date: "04-06", name: "Lundi de Pâques", longWeekend: true },
    { date: "05-01", name: "Fête du Travail", longWeekend: true },
    { date: "05-08", name: "Victoire 1945", longWeekend: true },
    { date: "05-14", name: "Ascension", longWeekend: false },
    { date: "07-14", name: "Fête Nationale (Bastille Day)", longWeekend: false },
    { date: "08-15", name: "Assomption", longWeekend: false },
    { date: "11-01", name: "La Toussaint", longWeekend: true },
    { date: "11-11", name: "Armistice 1918", longWeekend: false },
    { date: "12-25", name: "Noël", longWeekend: true },
  ],
  DE: [
    { date: "01-01", name: "Neujahr", longWeekend: true },
    { date: "04-03", name: "Karfreitag (Good Friday)", longWeekend: true },
    { date: "04-06", name: "Ostermontag (Easter Monday)", longWeekend: true },
    { date: "05-01", name: "Tag der Arbeit", longWeekend: true },
    { date: "05-14", name: "Christi Himmelfahrt", longWeekend: false },
    { date: "05-25", name: "Pfingstmontag (Whit Monday)", longWeekend: true },
    { date: "10-03", name: "Tag der Deutschen Einheit", longWeekend: true },
    { date: "10-31", name: "Reformationstag", longWeekend: true },
    { date: "12-25", name: "Erster Weihnachtstag", longWeekend: true },
    { date: "12-26", name: "Zweiter Weihnachtstag", longWeekend: false },
  ],
  AU: [
    { date: "01-01", name: "New Year's Day", longWeekend: true },
    { date: "01-26", name: "Australia Day", longWeekend: true },
    { date: "04-03", name: "Good Friday", longWeekend: true },
    { date: "04-06", name: "Easter Monday", longWeekend: true },
    { date: "04-25", name: "Anzac Day", longWeekend: true },
    { date: "06-08", name: "King's Birthday", longWeekend: true },
    { date: "10-05", name: "Labour Day", longWeekend: true },
    { date: "11-03", name: "Melbourne Cup Day", longWeekend: false },
    { date: "12-25", name: "Christmas Day", longWeekend: true },
    { date: "12-26", name: "Boxing Day", longWeekend: false },
  ],
  CA: [
    { date: "01-01", name: "New Year's Day", longWeekend: true },
    { date: "02-16", name: "Family Day", longWeekend: true },
    { date: "04-03", name: "Good Friday", longWeekend: true },
    { date: "05-18", name: "Victoria Day", longWeekend: true },
    { date: "07-01", name: "Canada Day", longWeekend: false },
    { date: "08-03", name: "Civic Holiday", longWeekend: true },
    { date: "09-07", name: "Labour Day", longWeekend: true },
    { date: "09-30", name: "National Day for Truth and Reconciliation", longWeekend: false },
    { date: "10-12", name: "Thanksgiving Day", longWeekend: true },
    { date: "12-25", name: "Christmas Day", longWeekend: true },
  ],
};

/**
 * Base fallback list (India) for backwards compatibility
 */
export const MOCK_HOLIDAYS_BASE = MOCK_HOLIDAYS_BY_COUNTRY.IN;

/**
 * Helper to get 10 mock holidays formatted with the requested country and year
 */
export function getMockHolidaysForCountryAndYear(country = "IN", year = 2026) {
  const code = (country || "IN").toUpperCase();
  const list = MOCK_HOLIDAYS_BY_COUNTRY[code] || MOCK_HOLIDAYS_BY_COUNTRY.IN;

  return list.map((h) => ({
    date: `${year}-${h.date}`,
    name: h.name,
    longWeekend: h.longWeekend,
  }));
}

/** Backward-compatible alias */
export function getMockHolidaysForYear(year = 2026) {
  return getMockHolidaysForCountryAndYear("IN", year);
}


/**
 * 8 activities covering all 7 contract types:
 * education, recreational, social, charity, cooking, relaxation, busywork
 * (matches GET /api/activity contract)
 */
export const MOCK_ACTIVITIES = [
  {
    activity: "Host a festive game night with close friends and family",
    type: "social",
    participants: 4,
  },
  {
    activity: "Go on a scenic sunrise hike and capture landscape photos",
    type: "recreational",
    participants: 2,
  },
  {
    activity: "Bake traditional festive sweets and share with neighbors",
    type: "cooking",
    participants: 1,
  },
  {
    activity: "Spend a quiet afternoon reading a book in a hammock",
    type: "relaxation",
    participants: 1,
  },
  {
    activity: "Learn the basics of calligraphy or a new language phrasebook",
    type: "education",
    participants: 1,
  },
  {
    activity: "Volunteer at a local community kitchen or animal shelter",
    type: "charity",
    participants: 2,
  },
  {
    activity: "Organize and back up your favorite travel photos",
    type: "busywork",
    participants: 1,
  },
  {
    activity: "Explore a nearby historic site or art gallery",
    type: "recreational",
    participants: 2,
  },
];

/**
 * 2 initial saved plans (matches GET /api/plans contract)
 */
export const INITIAL_MOCK_PLANS = [
  {
    id: "plan-1",
    holiday: "Republic Day",
    date: "2026-01-26",
    activity: "Host a festive game night with close friends and family",
    type: "social",
    createdAt: "2026-01-15T10:30:00.000Z",
  },
  {
    id: "plan-2",
    holiday: "Diwali (Festival of Lights)",
    date: "2026-11-08",
    activity: "Bake traditional festive sweets and share with neighbors",
    type: "cooking",
    createdAt: "2026-10-25T14:20:00.000Z",
  },
];
