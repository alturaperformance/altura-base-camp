import type { Symptom, Lifestyle } from '@/types/profile'

// ── Priority order ────────────────────────────────────────────────────────────
// Used to rank which symptom leads insight and nutrition cards.
export const SYMPTOM_PRIORITY: Symptom[] = [
  'breathlessness',
  'poor_sleep',
  'fatigue',
  'headache',
  'dizziness',
  'nausea',
  'elevated_hr',
  'brain_fog',
  'appetite_loss',
  'dry_mouth',
  'none',
]

// ── Shared copy interface ─────────────────────────────────────────────────────
export interface InsightCopy {
  icon: string
  title: string
  body: string
  trainerAppend?: string
  weekendWarriorAppend?: string
  localAppend?: string
  eventPrepAppend?: string // tokens: {goalName}, {daysUntilGoal}
}

// ── Symptom insight copy (Fix 02) ─────────────────────────────────────────────
export const symptomInsightCopy: Record<Symptom, InsightCopy> = {
  breathlessness: {
    icon: '🫁',
    title: 'Your breathing at {elevationBand}',
    body: "Reduced oxygen at altitude means your lungs work harder to deliver the same output. At your training elevation, the air holds roughly 25–30% less oxygen than sea level. The fix isn't effort — it's pacing. Drop intensity by 10–15% until your body adapts, usually 5–10 days.",
    trainerAppend:
      'For your training sessions, this means keeping HR in Zone 2 for the first week at a new elevation.',
  },
  poor_sleep: {
    icon: '🌙',
    title: 'Why altitude disrupts your sleep',
    body: "Altitude triggers a breathing pattern called periodic breathing — your body oscillates between breathing faster and slower as it calibrates to lower oxygen. This fragments sleep even when you feel like you slept a full night. It typically resolves within 3–5 days at a stable elevation.",
    eventPrepAppend:
      'With {goalName} {daysUntilGoal} days out, protecting sleep quality now is the highest-leverage prep you can do.',
  },
  fatigue: {
    icon: '⚡',
    title: "Energy at altitude — what's actually happening",
    body: "Your body is working harder at rest than it does at sea level. Altitude increases your basal metabolic rate and reduces oxygen delivery efficiency, which means fatigue isn't a sign of weakness — it's your system adapting. Most people hit their adaptation low point at days 2–3 before energy starts recovering.",
    trainerAppend:
      'Factor in an extra rest day in your first week at elevation — it accelerates the adaptation curve.',
  },
  headache: {
    icon: '💧',
    title: 'Altitude headaches and what drives them',
    body: "Altitude headaches are almost always hydration and acclimatization in combination. Reduced air pressure means faster respiratory water loss — you're losing fluid through breathing even when you don't feel thirsty. Aim for 3–4L of water on your first few days at elevation, even if you're not active.",
    weekendWarriorAppend:
      'For weekend trips, start hydrating aggressively the day before you ascend — not the day you arrive.',
  },
  dizziness: {
    icon: '🌀',
    title: 'Your acclimatization timeline',
    body: 'Dizziness and nausea are early acclimatization signals. Your blood oxygen saturation is adjusting to lower partial pressure — this process takes 24–72 hours at moderate elevations. Ascend slowly, avoid alcohol for the first 24 hours, and let your body do its work.',
    eventPrepAppend:
      "Arriving at {goalName}'s elevation at least 2–3 days before your event gives your body the minimum window to adapt.",
  },
  nausea: {
    icon: '🌿',
    title: 'Your acclimatization timeline',
    body: 'Dizziness and nausea are early acclimatization signals. Your blood oxygen saturation is adjusting to lower partial pressure — this process takes 24–72 hours at moderate elevations. Ascend slowly, avoid alcohol for the first 24 hours, and let your body do its work.',
    eventPrepAppend:
      "Arriving at {goalName}'s elevation at least 2–3 days before your event gives your body the minimum window to adapt.",
  },
  elevated_hr: {
    icon: '❤️',
    title: 'Your heart rate at altitude',
    body: 'An elevated resting HR is one of the first and most measurable signs that your cardiovascular system is responding to altitude. Your heart beats faster to compensate for reduced oxygen in each breath. Expect resting HR to be 10–20% higher than your sea-level baseline for the first 3–7 days.',
    trainerAppend:
      'For training, use perceived effort or power as your target — not HR — until your baseline stabilizes.',
  },
  brain_fog: {
    icon: '🧠',
    title: 'Cognitive load at altitude',
    body: 'Reduced oxygen affects cognitive function before it noticeably affects physical performance. Even at moderate elevations, reaction time, working memory, and decision-making speed can decline 5–10% in the first 24–48 hours. Hydration and sleep are the two fastest levers for restoring clarity.',
    localAppend:
      "As someone living at elevation, sustained mild cognitive load from altitude may be a baseline you've normalized — regular check-ins help track whether hydration habits are keeping this in check.",
  },
  appetite_loss: {
    icon: '🍎',
    title: 'Why altitude suppresses appetite',
    body: "Altitude triggers a release of leptin, a hormone that suppresses hunger signals, even as your caloric needs increase. This creates a deficit that accelerates fatigue and slows recovery — not because you're not hungry, but because your body is actively telling you not to eat. Set meal timing reminders rather than waiting to feel hungry.",
    eventPrepAppend:
      'In the {daysUntilGoal} days before {goalName}, consistent fueling is more important than any single nutrition strategy.',
  },
  dry_mouth: {
    icon: '💧',
    title: 'Altitude dehydration — faster than you think',
    body: "At altitude, you lose water through respiration at roughly twice the rate you do at sea level. Dry mouth is your body's most immediate signal that fluid loss is outpacing intake. Most people underestimate altitude fluid needs by 30–40%.",
    trainerAppend:
      'At your training elevation, plan for at least 0.5L of water per hour of activity, not counting baseline daily intake.',
  },
  none: {
    icon: '✅',
    title: 'Your altitude readiness baseline',
    body: "Not everyone feels altitude the same way — body composition, fitness level, and prior altitude exposure all affect individual response. Your check-in data will help surface any patterns that aren't immediately obvious. Even subtle changes in sleep, energy, and breathing are worth tracking.",
  },
}

// ── Hydration card copy (Fix 03) ──────────────────────────────────────────────
export const hydrationCopy: Record<Symptom | 'default', string> = {
  headache:
    "Based on the symptoms you flagged, hydration is your highest-priority daily habit at altitude. Target 3–4L today. Start before you feel thirsty — thirst lags behind dehydration at elevation.",
  dry_mouth:
    "Based on the symptoms you flagged, hydration is your highest-priority daily habit at altitude. Target 3–4L today. Start before you feel thirsty — thirst lags behind dehydration at elevation.",
  breathlessness:
    "Cardiovascular efficiency at altitude depends heavily on blood volume. Even mild dehydration — 1–2% of body weight — measurably reduces oxygen delivery. Target 3–4L today and add electrolytes if you're sweating.",
  elevated_hr:
    "Cardiovascular efficiency at altitude depends heavily on blood volume. Even mild dehydration — 1–2% of body weight — measurably reduces oxygen delivery. Target 3–4L today and add electrolytes if you're sweating.",
  fatigue:
    "Dehydration at altitude compounds fatigue and disrupts sleep architecture. Even if energy feels okay this morning, consistent hydration prevents the afternoon crash most people experience at elevation. Target 3–4L throughout the day, not in one sitting.",
  poor_sleep:
    "Dehydration at altitude compounds fatigue and disrupts sleep architecture. Even if energy feels okay this morning, consistent hydration prevents the afternoon crash most people experience at elevation. Target 3–4L throughout the day, not in one sitting.",
  nausea:
    'Hydration stabilizes blood pressure during acclimatization. Small, frequent sips outperform large amounts at once when nausea is a factor. Target 250ml every 30–45 minutes rather than larger volumes less frequently.',
  dizziness:
    'Hydration stabilizes blood pressure during acclimatization. Small, frequent sips outperform large amounts at once when nausea is a factor. Target 250ml every 30–45 minutes rather than larger volumes less frequently.',
  brain_fog:
    "Altitude increases baseline fluid loss through respiration. A consistent 3–4L daily habit protects your readiness score even on days you don't feel depleted.",
  appetite_loss:
    "Altitude increases baseline fluid loss through respiration. A consistent 3–4L daily habit protects your readiness score even on days you don't feel depleted.",
  none:
    "Altitude increases baseline fluid loss through respiration. A consistent 3–4L daily habit protects your readiness score even on days you don't feel depleted.",
  default:
    "Altitude increases baseline fluid loss through respiration. A consistent 3–4L daily habit protects your readiness score even on days you don't feel depleted.",
}

export const hydrationLifestyleAppend: Partial<Record<Lifestyle, string>> = {
  serious_trainer: 'Add 500ml per hour of training activity on top of your baseline.',
  weekend_warrior:
    'Start the day before your trip at higher intake — arriving well-hydrated reduces symptom onset at altitude.',
  daily_local:
    "Living at elevation means this isn't a temporary protocol — consistent hydration is a daily baseline habit, not a pre-trip strategy.",
}

// ── Symptom nutrition copy — Card 1 (Fix 03 + Fix 05) ───────────────────────
export const symptomNutritionCopy: Record<Symptom, InsightCopy> = {
  fatigue: {
    icon: '🥩',
    title: 'Energy at altitude — fuel your adaptation',
    body: "Altitude raises your resting metabolic rate by 10–25%. If you're logging fatigue, you may be eating enough for sea level but not enough for where you are. Prioritize iron-rich foods (red meat, lentils, spinach) — iron is the limiting factor for oxygen-carrying capacity.",
  },
  breathlessness: {
    icon: '🌿',
    title: 'Nutrients that support your breathing',
    body: "Your respiratory muscles are working harder than usual. Magnesium supports muscle function and reduces breathlessness intensity for many people at altitude. Good sources: dark chocolate, almonds, pumpkin seeds, leafy greens.",
  },
  poor_sleep: {
    icon: '🌙',
    title: 'Eating for better sleep at altitude',
    body: "Tryptophan-rich foods support melatonin production, which altitude can suppress. Eggs, turkey, and dairy in the evening may help. Avoid heavy meals within 2 hours of sleep — digestion competes with your body's overnight repair process.",
  },
  headache: {
    icon: '🌾',
    title: 'Nutrition for altitude headaches',
    body: "Altitude headaches often have a dehydration component, but also a magnesium component. Many altitude headache sufferers respond to increased magnesium intake. Alongside hydration, prioritize nuts, seeds, and whole grains.",
  },
  nausea: {
    icon: '🍌',
    title: 'Eating when appetite is suppressed',
    body: "When appetite is suppressed, caloric density matters more than volume. Nut butters, avocado, and eggs let you hit caloric targets without large meal sizes. Aim for 3–4 small eating windows instead of 2–3 full meals.",
  },
  appetite_loss: {
    icon: '🍌',
    title: 'Eating when appetite is suppressed',
    body: "When appetite is suppressed, caloric density matters more than volume. Nut butters, avocado, and eggs let you hit caloric targets without large meal sizes. Aim for 3–4 small eating windows instead of 2–3 full meals.",
  },
  brain_fog: {
    icon: '🐟',
    title: 'Nutrition for cognitive clarity at altitude',
    body: "Cognitive function at altitude is particularly sensitive to omega-3 intake. Fatty fish, walnuts, and flaxseed support neurological efficiency. Avoid high-glycemic carbohydrates that cause blood sugar swings — they amplify altitude brain fog.",
  },
  elevated_hr: {
    icon: '🫀',
    title: 'Nutrients for heart rate regulation',
    body: "Potassium and magnesium support cardiac rhythm regulation. Bananas, sweet potatoes, avocado, and dark leafy greens are the most accessible sources. If your HR is consistently elevated, prioritize these in your first meal of the day.",
  },
  dry_mouth: {
    icon: '🧂',
    title: 'Electrolyte balance at altitude',
    body: "Electrolyte balance is as important as total fluid volume at altitude. Sodium helps your body retain the fluid you're taking in. Don't go to zero-sodium foods or drinks while you're acclimatizing — a pinch of salt in water or electrolyte-containing foods help retention.",
  },
  dizziness: {
    icon: '🧂',
    title: 'Electrolyte balance at altitude',
    body: "Electrolyte balance is as important as total fluid volume at altitude. Sodium helps your body retain the fluid you're taking in. Don't go to zero-sodium foods or drinks while you're acclimatizing — a pinch of salt in water or electrolyte-containing foods help retention.",
  },
  none: {
    icon: '🌾',
    title: 'Altitude nutrition baseline',
    body: "Altitude increases your need for B vitamins, particularly B12 and folate, which support red blood cell production. Your body will naturally begin producing more red blood cells over the next 1–2 weeks — whole grains, legumes, and leafy greens support that process.",
  },
}

// ── Lifestyle nutrition copy — Card 2 (Fix 03 + Fix 05) ─────────────────────
export const lifestyleNutritionCopy: Record<Lifestyle, InsightCopy> = {
  serious_trainer: {
    icon: '🏋️',
    title: 'Carbohydrate timing for training at altitude',
    body: "For training at altitude, carbohydrate timing matters more than total intake. Aim for 30–60g of carbohydrates within 30 minutes of completing a session. Your glycogen replenishment rate is slower at elevation — don't wait until your next meal.",
  },
  weekend_warrior: {
    icon: '🏔️',
    title: 'Fueling for mountain days',
    body: "For mountain days, front-load your calories. Eat a substantial meal before ascending and pack more than you think you need. At altitude, your body burns carbohydrates faster and appetite often suppresses before your energy deficit registers.",
  },
  daily_local: {
    icon: '🥗',
    title: 'Year-round nutrition at elevation',
    body: "Living at elevation means your nutritional needs are slightly elevated as a baseline year-round. The biggest leverage point is iron — altitude living gradually increases your red blood cell production demand. Regular iron-rich meals support sustained energy at your elevation.",
  },
  event_prep: {
    icon: '🏆',
    title: 'Nutrition in the lead-up to {goalName}',
    body: "With {goalName} {daysUntilGoal} days out, the window to build altitude-adapted nutrition habits is now. The adaptations that matter most — improved oxygen efficiency, red blood cell production, glycogen storage — take 2–3 weeks to establish. The food choices you make this week matter more than what you eat the week before the event.",
  },
}

// ── Nutrition tab: timing guide — lifestyle-driven (Fix 05) ─────────────────
export const lifestyleTimingCopy: Record<
  Lifestyle,
  { icon: string; title: string; items: string[] }
> = {
  serious_trainer: {
    icon: '⏱️',
    title: 'Training nutrition timing',
    items: [
      'Pre-training (1–2 hrs before): Complex carbs + protein. Oats, eggs, whole grain toast. Avoid high-fat meals.',
      'During (60+ min sessions): 30–60g carbs per hour. Real food or gels both work.',
      'Post-training (within 30 min): 3:1 carb-to-protein ratio. Prioritize within the 30-minute window at altitude — your glycogen window closes faster.',
    ],
  },
  weekend_warrior: {
    icon: '🏔️',
    title: 'Mountain day timing',
    items: [
      "Day before a trip: Front-load carbohydrates. Pasta, rice, potatoes. Your muscles store glycogen more efficiently the day before sustained effort.",
      "Day of ascent: Eat before you start moving, not after you arrive at altitude.",
      "During: Snack every 45–60 minutes even if you don't feel hungry — appetite suppression is real.",
      "After: Protein + carbs within 2 hours of finishing, regardless of appetite.",
    ],
  },
  daily_local: {
    icon: '🗓️',
    title: 'Daily meal timing at elevation',
    items: [
      'Morning: Protein-first breakfast protects against afternoon altitude energy dips.',
      'Midday: Avoid the heavy carb-only lunch — blood sugar swings hit harder at elevation.',
      'Evening: Lighter meal, earlier if sleep is a concern. Digestion competes with overnight recovery.',
    ],
  },
  event_prep: {
    icon: '📅',
    title: 'Pre-event nutrition timing',
    items: [
      "2–3 weeks out: Build your nutrition habits now, not race week. Practice your race-day fueling on long training days — don't experiment at {goalName}.",
      'Race week: Increase carbohydrate intake by 20–30%. No new foods. Eat familiar meals.',
      'Race morning: 2–3 hours before start, 500–800 calories of familiar food.',
    ],
  },
}

// ── Symptom notes — one-liner for Nutrition tab Section 5 (Fix 05) ──────────
export const symptomNutritionNote: Record<Symptom, string> = {
  fatigue: 'Fatigue → prioritize iron and consistent caloric intake',
  headache: 'Headaches → hydration first, then magnesium-rich foods',
  breathlessness: 'Breathlessness → magnesium and iron support respiratory efficiency',
  poor_sleep: 'Poor sleep → tryptophan-rich evening meals, avoid heavy late meals',
  nausea: 'Nausea / appetite loss → small, calorie-dense meals every 3–4 hours',
  appetite_loss: 'Nausea / appetite loss → small, calorie-dense meals every 3–4 hours',
  brain_fog: 'Brain fog → omega-3s and low-glycemic carbohydrates',
  elevated_hr: 'Elevated HR → potassium and magnesium priority',
  dry_mouth: 'Dry mouth / dizziness → electrolyte balance alongside fluid intake',
  dizziness: 'Dry mouth / dizziness → electrolyte balance alongside fluid intake',
  none: 'No symptoms → focus on B vitamins and iron as altitude baselines',
}

// ── Display labels ────────────────────────────────────────────────────────────
export const elevationBandLabel: Record<string, string> = {
  below_3k: 'below 3,000 ft',
  '3k_5k': '3,000–5,000 ft',
  '5k_8k': '5,000–8,000 ft',
  '8k_10k': '8,000–10,000 ft',
  '10k_plus': '10,000+ ft',
}

export const lifestyleLabel: Record<Lifestyle, string> = {
  daily_local: 'Daily local',
  weekend_warrior: 'Weekend warrior',
  serious_trainer: 'Serious trainer',
  event_prep: 'Event prep',
}

export const symptomLabel: Record<Symptom, string> = {
  fatigue: 'fatigue',
  headache: 'headaches',
  breathlessness: 'breathlessness',
  poor_sleep: 'poor sleep',
  nausea: 'nausea',
  dizziness: 'dizziness',
  appetite_loss: 'appetite loss',
  brain_fog: 'brain fog',
  elevated_hr: 'elevated heart rate',
  dry_mouth: 'dry mouth',
  none: 'no symptoms',
}

// ── Utilities ─────────────────────────────────────────────────────────────────

/** Replace {token} placeholders in a string. */
export function resolveTokens(
  text: string,
  tokens: Record<string, string | number>
): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(tokens[key] ?? ''))
}

/** Sort symptoms by the canonical priority order. */
export function sortSymptomsByPriority(symptoms: Symptom[]): Symptom[] {
  return [...symptoms].sort(
    (a, b) => SYMPTOM_PRIORITY.indexOf(a) - SYMPTOM_PRIORITY.indexOf(b)
  )
}

/** Return the hydration copy key for the user's top symptom. */
export function getPrimaryHydrationKey(symptoms: Symptom[]): Symptom | 'default' {
  const sorted = sortSymptomsByPriority(symptoms.filter((s) => s !== 'none'))
  for (const s of sorted) {
    if (s in hydrationCopy) return s
  }
  return 'default'
}

/** Build the lifestyle append string for a given insight copy entry. */
export function buildLifestyleAppend(
  copy: InsightCopy,
  lifestyle: string | null,
  tokens: Record<string, string | number>
): string {
  let append = ''
  if (lifestyle === 'serious_trainer' && copy.trainerAppend) {
    append = copy.trainerAppend
  } else if (lifestyle === 'weekend_warrior' && copy.weekendWarriorAppend) {
    append = copy.weekendWarriorAppend
  } else if (lifestyle === 'daily_local' && copy.localAppend) {
    append = copy.localAppend
  } else if (
    (lifestyle === 'event_prep' || lifestyle === 'serious_trainer' || lifestyle === 'weekend_warrior') &&
    copy.eventPrepAppend
  ) {
    append = resolveTokens(copy.eventPrepAppend, tokens)
  }
  return append ? ` ${append}` : ''
}
