import type { Symptom } from '@/types/profile'
import type { InsightCard } from '@/types/insights'
import type { UserState } from './state-machine'

// Symptom-aware insight cards
const SYMPTOM_INSIGHTS: Record<Symptom, InsightCard> = {
  fatigue: {
    id: 'fatigue_insight',
    icon: '🧠',
    title: 'Low energy at altitude is real — even here',
    body: 'At your elevation, your body runs on roughly 17% less oxygen than at sea level. On days when sleep or hydration slips, that gap becomes very noticeable as fatigue and brain fog.',
  },
  headache: {
    id: 'headache_insight',
    icon: '💧',
    title: 'Headache pattern: check your hydration',
    body: "You've logged headaches regularly. At altitude, dry air accelerates fluid loss even at rest. Headaches are often the first sign of mild dehydration before thirst registers.",
  },
  breathlessness: {
    id: 'breathlessness_insight',
    icon: '🫁',
    title: 'Breathlessness at altitude is physiological',
    body: 'Your lungs are working harder to pull the same oxygen your body needs. Pacing yourself in the first 15 minutes of activity gives your cardiovascular system time to adjust.',
  },
  poor_sleep: {
    id: 'poor_sleep_insight',
    icon: '🌙',
    title: 'Altitude disrupts sleep architecture',
    body: 'Reduced oxygen at altitude can cause periodic breathing during sleep, which fragments your sleep cycles. Staying well-hydrated before bed helps reduce this effect.',
  },
  nausea: {
    id: 'nausea_insight',
    icon: '🌿',
    title: 'Nausea at altitude responds to food timing',
    body: 'Altitude-related nausea often worsens on an empty stomach. Small, frequent meals with easy-to-digest carbohydrates can help stabilize your system.',
  },
  dizziness: {
    id: 'dizziness_insight',
    icon: '⚡',
    title: 'Dizziness is often a hydration signal',
    body: 'At altitude, your blood thickens slightly as your body compensates for lower oxygen. Adequate hydration keeps circulation efficient and reduces dizziness.',
  },
  appetite_loss: {
    id: 'appetite_loss_insight',
    icon: '🍎',
    title: 'Appetite suppression at altitude is common',
    body: "Altitude suppresses appetite-regulating hormones. Even if you're not hungry, eating enough carbohydrates maintains energy and supports your body's acclimatization response.",
  },
  brain_fog: {
    id: 'brain_fog_insight',
    icon: '🧠',
    title: 'Concentration dips at altitude',
    body: 'Reduced oxygen at your elevation affects cognitive performance more than most people realize — especially in the afternoon when blood sugar and hydration both dip.',
  },
  elevated_hr: {
    id: 'elevated_hr_insight',
    icon: '❤️',
    title: 'Elevated resting HR is normal at altitude',
    body: 'Your heart beats faster at altitude to compensate for lower oxygen per breath. This typically normalizes within 1–2 weeks of consistent exposure.',
  },
  dry_mouth: {
    id: 'dry_mouth_insight',
    icon: '💧',
    title: 'Fatigue pattern: check your hydration',
    body: "You've logged low energy 3 of the last 5 days. The most common driver at your altitude is chronic mild dehydration — dry air accelerates fluid loss even at rest.",
  },
  none: {
    id: 'none_insight',
    icon: '✅',
    title: 'Strong altitude adaptation',
    body: 'You report minimal symptoms at altitude. Continue maintaining your hydration and sleep habits — these are the primary levers that keep adaptation strong over time.',
  },
}

const EDUCATIONAL_INSIGHTS: InsightCard[] = [
  {
    id: 'edu_oxygen',
    icon: '🌬️',
    title: 'Why altitude changes everything',
    body: 'At 5,280 ft, each breath delivers roughly 17% less oxygen than at sea level. Your body compensates by increasing breathing rate, heart rate, and red blood cell production over time.',
  },
  {
    id: 'edu_hydration',
    icon: '💧',
    title: 'Hydration at altitude works differently',
    body: 'Dry air at altitude accelerates fluid loss through respiration — you lose water just by breathing faster. Aim to drink before you feel thirsty; thirst lags actual dehydration at elevation.',
  },
  {
    id: 'edu_sleep',
    icon: '🌙',
    title: 'Sleep is your fastest adaptation tool',
    body: "Most of your body's altitude adaptation happens during sleep — erythropoietin production, red blood cell generation, and respiratory muscle repair. Prioritizing 8+ hours accelerates the process.",
  },
  {
    id: 'edu_nutrition',
    icon: '🍎',
    title: 'Carbohydrates burn more efficiently at altitude',
    body: 'At elevation, carbohydrates require less oxygen to metabolize than fats. Leaning toward carb-forward meals — especially before and during activity — helps maintain energy output.',
  },
]

const NUTRITION_INSIGHTS: InsightCard[] = [
  {
    id: 'nutrition_hydration',
    icon: '💧',
    title: 'Hydration baseline at altitude',
    body: "Aim for at least 3–4 liters of water per day at elevation. Dry air accelerates fluid loss even at rest — don't wait for thirst as your signal.",
  },
  {
    id: 'nutrition_electrolytes',
    icon: '⚡',
    title: 'Electrolytes matter more at elevation',
    body: 'Increased respiration and urination at altitude deplete sodium, potassium, and magnesium faster. Including electrolyte-rich foods — or a balanced electrolyte mix — helps maintain fluid balance.',
  },
  {
    id: 'nutrition_carbs',
    icon: '🌾',
    title: 'Carbohydrates as your altitude fuel',
    body: 'Carbohydrates require less oxygen to convert to energy than fat. At altitude, prioritizing complex carbs at meals supports sustained energy when your oxygen supply is reduced.',
  },
  {
    id: 'nutrition_iron',
    icon: '🥩',
    title: 'Iron supports altitude adaptation',
    body: 'Your body needs iron to produce new red blood cells for altitude adaptation. Foods like lean meat, legumes, and leafy greens help support this process — especially in the first 2–4 weeks.',
  },
]

export function getInsightCards(
  symptoms: Symptom[],
  state: UserState,
  checkinCount: number
): { insights: InsightCard[]; nutrition: InsightCard[] } {
  const insights: InsightCard[] = []

  if (checkinCount >= 5 && symptoms.length > 0 && !symptoms.includes('none')) {
    // Pattern-driven: primary symptom first
    const primary = symptoms[0]
    if (SYMPTOM_INSIGHTS[primary]) {
      insights.push(SYMPTOM_INSIGHTS[primary])
    }
    // Add second symptom if available
    if (symptoms[1] && SYMPTOM_INSIGHTS[symptoms[1]] && symptoms[1] !== primary) {
      insights.push(SYMPTOM_INSIGHTS[symptoms[1]])
    }
  } else {
    // Educational fallback
    const pick = EDUCATIONAL_INSIGHTS.slice(0, state <= 2 ? 2 : 3)
    insights.push(...pick)
  }

  // Positive reinforcement always last
  if (insights.length >= 2) {
    insights.push({
      id: 'positive_reinforcement',
      icon: '🎯',
      title: 'Consistent check-ins strengthen every insight',
      body: 'The more you check in, the more precisely we can identify what altitude patterns are specific to you — not just general altitude physiology.',
    })
  }

  return {
    insights: insights.slice(0, 3),
    nutrition: NUTRITION_INSIGHTS.slice(0, 3),
  }
}
