'use client'

import { useAppStore, getDaysUntilGoal } from '@/lib/demo-store'
import { Card } from '@/components/ui/Card'
import {
  sortSymptomsByPriority,
  resolveTokens,
  symptomNutritionCopy,
  lifestyleNutritionCopy,
  lifestyleTimingCopy,
  symptomNutritionNote,
  hydrationCopy,
  hydrationLifestyleAppend,
  getPrimaryHydrationKey,
  elevationBandLabel,
  lifestyleLabel,
  symptomLabel,
} from '@/lib/insights-copy'
import type { Symptom, Lifestyle } from '@/types/profile'

export default function NutritionPage() {
  const { profile } = useAppStore()

  if (!profile) return null

  const { symptoms, lifestyle, goal, training, home_elevation_ft } = profile
  const activeGoal = goal?.is_active ? goal : null
  const daysUntilGoal = getDaysUntilGoal(activeGoal)
  const hasRealSymptoms = symptoms.length > 0 && !symptoms.includes('none')
  const sortedSymptoms = hasRealSymptoms ? sortSymptomsByPriority(symptoms) : (['none'] as Symptom[])

  const goalName = activeGoal?.name ?? ''
  const elevBand = training?.elevation_band
    ? elevationBandLabel[training.elevation_band] ?? training.elevation_band
    : `${home_elevation_ft.toLocaleString()} ft`

  const tokens: Record<string, string | number> = {
    goalName,
    daysUntilGoal: daysUntilGoal ?? '',
    elevationBand: elevBand,
    goalMaxElevation: activeGoal?.max_elevation_ft?.toLocaleString() ?? '',
    elevationDelta: activeGoal?.max_elevation_ft
      ? (activeGoal.max_elevation_ft - home_elevation_ft).toLocaleString()
      : '',
  }

  // ── Section 1: Priority nutrient cards (top 2-3 symptoms) ─────────────────
  const nutrientSymptoms = sortedSymptoms.slice(0, 3)

  // ── Section 2: Hydration target copy ──────────────────────────────────────
  const hydrationKey = getPrimaryHydrationKey(symptoms)
  const hydrationBase = hydrationCopy[hydrationKey]
  const hydrationAppend = lifestyle ? (hydrationLifestyleAppend[lifestyle as Lifestyle] ?? '') : ''
  const hydrationFull = hydrationBase + (hydrationAppend ? ` ${hydrationAppend}` : '')

  const caloricNote =
    lifestyle === 'serious_trainer'
      ? 'Altitude raises your resting metabolic rate. Most people need 200–300 additional calories per day in their first week at a new elevation. With your training load, add 400–500 calories on active days on top of your altitude baseline.'
      : 'Altitude raises your resting metabolic rate. Most people need 200–300 additional calories per day in their first week at a new elevation.'

  // ── Section 3: Timing guide ────────────────────────────────────────────────
  const timingGuide = lifestyle && lifestyle in lifestyleTimingCopy
    ? lifestyleTimingCopy[lifestyle as Lifestyle]
    : null

  // ── Section 4: Goal context ────────────────────────────────────────────────
  const showGoalSection =
    activeGoal &&
    daysUntilGoal !== null &&
    daysUntilGoal > 0 &&
    (activeGoal.type === 'event' || activeGoal.type === 'trip')

  function getGoalContextItems(): string[] {
    if (!daysUntilGoal) return []
    if (daysUntilGoal >= 31) {
      return activeGoal?.type === 'event'
        ? [
            'Build habits now: consistent iron intake, daily hydration target, carb periodization',
            'Practice fueling on long training days — establish what works for your body',
            'This is the window where nutritional adaptations actually compound',
          ]
        : [
            'Build your hydration and iron habits starting now — not the week before',
            'Establish your daily caloric targets at elevation before the trip',
            'Practice eating at altitude on training days so your stomach is adapted',
          ]
    }
    if (daysUntilGoal >= 8) {
      return activeGoal?.type === 'event'
        ? [
            'Increase carbohydrate intake by 15–20% this week',
            'Eliminate new foods — stick to what your body knows',
            'Dial in your race-day fueling on your final long sessions',
          ]
        : [
            'Increase carbohydrate intake in the week before your trip',
            'Front-load your calories the day before you ascend',
            'Pack more food than you think you need — appetite suppresses at altitude',
          ]
    }
    return activeGoal?.type === 'event'
      ? [
          'Familiar foods only — no experiments this week',
          'Increase carbohydrates by 20–30%, prioritize hydration',
          'No alcohol for at least 48 hours before your event',
        ]
      : [
          'Eat familiar foods — no new experiments before your trip',
          'Hydration surge: 4–5L the day before you ascend',
          'No alcohol for 24 hours before ascending',
        ]
  }

  const lifestyleName = lifestyle ? lifestyleLabel[lifestyle as Lifestyle] : null

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Your nutrition at altitude</h1>
        <p className="text-sm text-slate-400 mt-1">
          Personalized for {lifestyleName ?? 'you'} · {elevBand}
        </p>
      </div>

      <div className="space-y-8">

        {/* Section 1 — Priority nutrients */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Your priority nutrients
          </p>
          <p className="text-xs text-blue-400 mb-3">
            Based on what you shared:{' '}
            {sortedSymptoms.map((s) => symptomLabel[s]).join(', ')}
          </p>
          <div className="space-y-3">
            {nutrientSymptoms.map((symptom) => {
              const copy = symptomNutritionCopy[symptom]
              return (
                <Card key={symptom}>
                  <div className="flex gap-3">
                    <span className="text-xl mt-0.5 shrink-0">{copy.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">{copy.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{copy.body}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Section 2 — Daily targets */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Daily targets
          </p>
          <div className="space-y-3">
            <Card>
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">💧</span>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Hydration target</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{hydrationFull}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">🔥</span>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Caloric adjustment</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{caloricNote}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Section 3 — Timing guide */}
        {timingGuide && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Timing guide
            </p>
            <Card>
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">{timingGuide.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-2">{timingGuide.title}</h4>
                  <ul className="space-y-2">
                    {timingGuide.items.map((item, i) => (
                      <li key={i} className="text-xs text-slate-400 leading-relaxed flex gap-2">
                        <span className="text-slate-600 shrink-0 mt-0.5">·</span>
                        <span>{resolveTokens(item, tokens)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Section 4 — Goal context (conditional) */}
        {showGoalSection && activeGoal && daysUntilGoal !== null && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Goal context
            </p>
            <Card>
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">🏁</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {activeGoal.name} — {daysUntilGoal} day{daysUntilGoal !== 1 ? 's' : ''} out
                  </h4>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    {activeGoal.type === 'trip' && activeGoal.max_elevation_ft
                      ? `You're planning to reach ${activeGoal.max_elevation_ft.toLocaleString()} ft — ${(activeGoal.max_elevation_ft - home_elevation_ft).toLocaleString()} ft above your current elevation. Here's what matters most from a nutrition standpoint:`
                      : "Here's what matters most in your final days from a nutrition standpoint:"}
                  </p>
                  <ul className="space-y-1.5">
                    {getGoalContextItems().map((item, i) => (
                      <li key={i} className="text-xs text-slate-400 flex gap-2">
                        <span className="text-blue-500 shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Section 5 — Symptom notes */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Your symptom notes
          </p>
          <p className="text-xs text-slate-500 mb-3">What you flagged in setup:</p>
          <Card>
            <ul className="space-y-2">
              {sortedSymptoms.map((symptom) => (
                <li key={symptom} className="text-xs text-slate-400 flex gap-2">
                  <span className="text-blue-500 shrink-0">·</span>
                  <span>{symptomNutritionNote[symptom]}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Lifestyle-driven nutrition card (Card 2) */}
        {lifestyle && lifestyle in lifestyleNutritionCopy && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              For your lifestyle
            </p>
            {(() => {
              const lsCopy = lifestyleNutritionCopy[lifestyle as Lifestyle]
              return (
                <Card>
                  <div className="flex gap-3">
                    <span className="text-xl mt-0.5 shrink-0">{lsCopy.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {resolveTokens(lsCopy.title, tokens)}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {resolveTokens(lsCopy.body, tokens)}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })()}
          </div>
        )}

      </div>
    </div>
  )
}
