import type { Profile } from '@/types/profile'
import type { Checkin } from '@/types/checkin'
import type { Goal } from '@/types/profile'
import { formatElevation } from '@/lib/hooks/useUnits'

const LIFESTYLE_LABELS: Record<string, string> = {
  daily_local: 'Lives at altitude daily',
  weekend_warrior: 'Weekend mountain trips',
  serious_trainer: 'Serious altitude trainer',
  event_prep: 'Preparing for a specific event',
}

const ELEVATION_BAND_LABELS: Record<string, string> = {
  below_3k: 'below 3,000 ft',
  '3k_5k': '3,000–5,000 ft',
  '5k_8k': '5,000–8,000 ft',
  '8k_10k': '8,000–10,000 ft',
  '10k_plus': '10,000+ ft',
}

export interface StravaContext {
  loadTrend: string
  weeklyElevationGainFt: number
  activeDays: number
  primaryActivityType: string
  efficiencyNote: string
}

export interface FullUserContext {
  profile: Profile
  activeGoal: Goal | null
  daysUntilGoal: number | null
  recentCheckins: Checkin[]
  stravaContext: StravaContext | null
}

export function buildSystemPrompt(context: FullUserContext): string {
  const units = context.profile.units_preference ?? 'imperial'
  const { profile, activeGoal, daysUntilGoal, recentCheckins, stravaContext } = context

  const elevationBandLabel = profile.training?.elevation_band
    ? ELEVATION_BAND_LABELS[profile.training.elevation_band] ?? profile.training.elevation_band
    : null

  const checkinLines = recentCheckins
    .slice(0, 7)
    .map((c) => {
      const parts = [
        `Date: ${c.date}`,
        c.energy !== null ? `Energy ${c.energy}/5` : null,
        c.sleep_quality !== null ? `Sleep ${c.sleep_quality}/5` : null,
        c.breathlessness !== null ? `Breathlessness ${c.breathlessness}/5` : null,
        c.hydration_yesterday !== null ? `Hydration ${c.hydration_yesterday}/4` : null,
        c.training_today !== null ? `Training ${c.training_today}/5` : null,
      ].filter(Boolean)
      return parts.join(', ')
    })
    .join('\n')

  return `You are an altitude wellness coach embedded in Altura Base Camp, a personalized altitude performance app. You have full context about this specific user. Always give advice specific to their situation — never generic altitude content when you have personal data to work from.

USER PROFILE
Lifestyle: ${LIFESTYLE_LABELS[profile.lifestyle ?? ''] ?? profile.lifestyle ?? 'Unknown'}
Home elevation: ${formatElevation(profile.home_elevation_ft, units)}
Altitude symptoms: ${profile.symptoms.filter((s) => s !== 'none').join(', ') || 'None reported'}${profile.training?.frequency ? `\nTraining frequency: ${profile.training.frequency} days/week` : ''}${elevationBandLabel ? `\nTypical training elevation: ${elevationBandLabel}` : ''}

${activeGoal ? `ACTIVE GOAL
Name: ${activeGoal.name}
Date: ${activeGoal.date}${daysUntilGoal !== null ? ` (${daysUntilGoal} days from today)` : ''}
Location: ${activeGoal.location}${activeGoal.max_elevation_ft ? `\nMax elevation: ${formatElevation(activeGoal.max_elevation_ft, units)}` : ''}
Activities: ${activeGoal.activities.join(', ')}` : 'ACTIVE GOAL: None'}

${recentCheckins.length > 0 ? `RECENT CHECK-INS (last 7 days)\n${checkinLines}` : 'RECENT CHECK-INS: None logged yet'}

${stravaContext ? `STRAVA SUMMARY (last 7 days)
Training load trend: ${stravaContext.loadTrend}
Total elevation gain: ${formatElevation(stravaContext.weeklyElevationGainFt, units)}
Active days: ${stravaContext.activeDays}
Primary activity: ${stravaContext.primaryActivityType}
Effort efficiency vs baseline: ${stravaContext.efficiencyNote}` : ''}

INSTRUCTIONS
- Give specific, actionable advice grounded in altitude physiology
- Reference the user's actual data whenever available — never give a generic answer when you have specific context
- Speak directly and concisely — this is a mobile app interface
- Keep responses to 2–4 short paragraphs maximum for most questions
- Do not diagnose medical conditions or recommend prescription medications
- Do not reference or recommend any supplement brands or Altura products by name
- Nutrition advice references whole foods only — no product recommendations
- Do not recommend anything outside altitude wellness and athletic performance
- Use ${units === 'imperial' ? 'feet and miles' : 'meters and kilometers'} for all measurements`.trim()
}
