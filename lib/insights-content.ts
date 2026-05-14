import type { Profile, Symptom } from '@/types/profile'
import type { InsightCard } from '@/types/insights'
import type { UserState } from './state-machine'
import {
  sortSymptomsByPriority,
  getPrimaryHydrationKey,
  buildLifestyleAppend,
  resolveTokens,
  symptomInsightCopy,
  symptomNutritionCopy,
  lifestyleNutritionCopy,
  hydrationCopy,
  hydrationLifestyleAppend,
  elevationBandLabel,
} from './insights-copy'

// Educational fallback cards (shown before 5 check-ins when no symptom leads)
const EDUCATIONAL_INSIGHTS: InsightCard[] = [
  {
    id: 'edu_sleep',
    icon: '🌙',
    title: 'Sleep is your fastest adaptation tool',
    body: "Most of your body's altitude adaptation happens during sleep — erythropoietin production, red blood cell generation, and respiratory muscle repair. Prioritizing 8+ hours accelerates the process.",
  },
  {
    id: 'edu_hydration',
    icon: '💧',
    title: 'Hydration at altitude works differently',
    body: "Dry air at altitude accelerates fluid loss through respiration — you lose water just by breathing faster. Aim to drink before you feel thirsty; thirst lags actual dehydration at elevation.",
  },
  {
    id: 'edu_nutrition',
    icon: '🍎',
    title: 'Carbohydrates burn more efficiently at altitude',
    body: 'At elevation, carbohydrates require less oxygen to metabolize than fats. Leaning toward carb-forward meals — especially before and during activity — helps maintain energy output.',
  },
]

export function getInsightCards(
  profile: Profile,
  state: UserState,
  checkinCount: number,
  daysUntilGoal: number | null
): { insights: InsightCard[]; nutrition: InsightCard[] } {
  const { symptoms, lifestyle, goal, training } = profile
  const goalName = goal?.name ?? ''
  const elevationBand = training?.elevation_band
    ? elevationBandLabel[training.elevation_band] ?? training.elevation_band
    : ''

  const tokens: Record<string, string | number> = {
    goalName,
    daysUntilGoal: daysUntilGoal ?? '',
    elevationBand,
  }

  // ── Insights stack ──────────────────────────────────────────────────────────
  const insights: InsightCard[] = []
  const hasRealSymptoms = symptoms.length > 0 && !symptoms.includes('none')

  if (checkinCount >= 5 && hasRealSymptoms) {
    // Pattern-driven tier: top 3 symptoms in priority order
    const sorted = sortSymptomsByPriority(symptoms)
    for (const symptom of sorted.slice(0, 3)) {
      const copy = symptomInsightCopy[symptom]
      const bodyWithAppend =
        resolveTokens(copy.body, tokens) + buildLifestyleAppend(copy, lifestyle, tokens)
      insights.push({
        id: `insight_${symptom}`,
        icon: copy.icon,
        title: resolveTokens(copy.title, tokens),
        body: bodyWithAppend,
      })
    }
  } else if (hasRealSymptoms) {
    // Profile-data tier: lead with primary symptom, fill with educational
    const sorted = sortSymptomsByPriority(symptoms)
    const primary = sorted[0]
    const copy = symptomInsightCopy[primary]
    insights.push({
      id: `insight_${primary}`,
      icon: copy.icon,
      title: resolveTokens(copy.title, tokens),
      body: resolveTokens(copy.body, tokens) + buildLifestyleAppend(copy, lifestyle, tokens),
    })
    // Fill remaining slots with educational content
    const edCount = Math.min(2, EDUCATIONAL_INSIGHTS.length)
    insights.push(...EDUCATIONAL_INSIGHTS.slice(0, edCount))
  } else {
    // No symptoms (or 'none'): educational fallback
    const pick = state <= 2 ? 2 : 3
    insights.push(...EDUCATIONAL_INSIGHTS.slice(0, pick))
  }

  // Positive reinforcement always last (only when ≥ 2 insights shown)
  if (insights.length >= 2) {
    insights.push({
      id: 'positive_reinforcement',
      icon: '🎯',
      title: 'Consistent check-ins strengthen every insight',
      body: 'The more you check in, the more precisely we can identify what altitude patterns are specific to you — not just general altitude physiology.',
    })
  }

  // ── Nutrition cards ─────────────────────────────────────────────────────────
  const nutrition: InsightCard[] = []

  // Hydration card
  const hydrationKey = getPrimaryHydrationKey(symptoms)
  const hydrationBase = hydrationCopy[hydrationKey]
  const hydrationAppend = lifestyle ? (hydrationLifestyleAppend[lifestyle] ?? '') : ''
  nutrition.push({
    id: 'nutrition_hydration',
    icon: '💧',
    title: 'Hydration at altitude',
    body: hydrationBase + (hydrationAppend ? ` ${hydrationAppend}` : ''),
  })

  // Card 1: symptom-driven nutrition
  const primaryForNutrition: Symptom = hasRealSymptoms
    ? sortSymptomsByPriority(symptoms)[0]
    : 'none'
  const nutriCopy = symptomNutritionCopy[primaryForNutrition]
  nutrition.push({
    id: `nutrition_symptom_${primaryForNutrition}`,
    icon: nutriCopy.icon,
    title: nutriCopy.title,
    body: nutriCopy.body,
  })

  // Card 2: lifestyle-driven nutrition
  if (lifestyle && lifestyle in lifestyleNutritionCopy) {
    const lsCopy = lifestyleNutritionCopy[lifestyle as keyof typeof lifestyleNutritionCopy]
    nutrition.push({
      id: `nutrition_lifestyle_${lifestyle}`,
      icon: lsCopy.icon,
      title: resolveTokens(lsCopy.title, tokens),
      body: resolveTokens(lsCopy.body, tokens),
    })
  }

  return {
    insights: insights.slice(0, 4),
    nutrition: nutrition.slice(0, 3),
  }
}
