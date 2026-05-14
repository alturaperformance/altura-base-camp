'use client'

import { useRouter } from 'next/navigation'
import { useAppStore, getCheckinToday, getDaysUntilGoal, getDaysSinceGoal } from '@/lib/demo-store'
import { buildCardStack } from '@/lib/priority-engine'
import { determineState } from '@/lib/state-machine'
import { detectPatterns } from '@/lib/pattern-detection'
import { getCheckinQuestions } from '@/lib/checkin-questions'
import { getInsightCards } from '@/lib/insights-content'
import { formatHeaderDate, getGreeting, todayISO } from '@/lib/date-utils'

import { CheckInCard } from '@/components/cards/CheckInCard'
import { AltitudeContextCard } from '@/components/cards/AltitudeContextCard'
import { InsightsStack } from '@/components/cards/InsightsStack'
import { NutritionCards } from '@/components/cards/NutritionCards'
import { IntegrationsNudge } from '@/components/cards/IntegrationsNudge'
import { GoalCountdownCard } from '@/components/cards/GoalCountdownCard'
import { PatternCard } from '@/components/cards/PatternCard'
import { StreakCard } from '@/components/cards/StreakCard'
import { StatRow } from '@/components/cards/StatRow'
import { UnlockInterstitial } from '@/components/cards/UnlockInterstitial'
import { CompletionCard } from '@/components/cards/CompletionCard'
import { RecoveryCard } from '@/components/cards/RecoveryCard'
import { ReflectionCard } from '@/components/cards/ReflectionCard'
import { NewGoalCard } from '@/components/cards/NewGoalCard'
import { FinalChecklistCard } from '@/components/cards/FinalChecklistCard'
import { ReadinessCard } from '@/components/cards/ReadinessCard'

import type { AppContext } from '@/types/insights'

const ALTITUDE_EDUCATIONAL = [
  {
    title: 'Low energy at altitude is real — even here',
    body: "At your elevation, your body runs on roughly 17% less oxygen than at sea level. On days when sleep or hydration slips, that gap becomes very noticeable as fatigue and brain fog.",
  },
  {
    title: 'Hydration at altitude works differently',
    body: "Dry air at altitude accelerates fluid loss through respiration — you lose water just by breathing faster. Aim to drink before you feel thirsty; thirst lags actual dehydration at elevation.",
  },
  {
    title: 'Sleep is your fastest altitude adaptation tool',
    body: "Most of your body's altitude adaptation happens during sleep — erythropoietin production, red blood cell generation, and respiratory muscle repair. Prioritizing 8+ hours accelerates the process.",
  },
]

function getEducationalContent(checkinCount: number) {
  return ALTITUDE_EDUCATIONAL[checkinCount % ALTITUDE_EDUCATIONAL.length]
}

export default function HomePage() {
  const router = useRouter()
  const { profile, checkins, showUnlockInterstitial, addCheckin, dismissUnlockInterstitial } = useAppStore()

  if (!profile) return null

  const activeGoal = profile.goal?.is_active ? profile.goal : null
  const daysUntilGoal = getDaysUntilGoal(activeGoal)
  const daysSinceGoal = getDaysSinceGoal(profile.goal)
  const checkinToday = getCheckinToday(checkins)

  const context: AppContext = {
    profile,
    checkins,
    checkinToday,
    readinessScore: null,
    checkinCount: checkins.length,
    activeGoal,
    secondaryGoal: null,
    daysUntilGoal,
    daysSinceGoal,
    showUnlockInterstitial,
    integrations: profile.integrations,
  }

  const state = determineState(context)
  const cardStack = buildCardStack(context)
  const patterns = detectPatterns(checkins)
  const educational = getEducationalContent(checkins.length)
  const questions = getCheckinQuestions(profile.lifestyle, profile.symptoms)
  const { insights, nutrition } = getInsightCards(profile.symptoms, state, checkins.length)

  const greeting = daysSinceGoal !== null && daysSinceGoal >= 0
    ? `You did it, ${profile.first_name}`
    : `${getGreeting()}, ${profile.first_name}`

  function handleCheckinSubmit(values: Record<string, number>) {
    addCheckin({
      user_id: profile!.id,
      date: todayISO(),
      energy: values.energy ?? null,
      sleep_quality: values.sleep_quality ?? null,
      breathlessness: values.breathlessness ?? null,
      mental_clarity: values.mental_clarity ?? null,
      hydration: values.hydration ?? null,
      headache: values.headache ?? null,
      notes: null,
    })
  }

  const streakCount = checkins.length

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1E3A5F] to-navy-900 px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              {formatHeaderDate()} · {profile.home_elevation_ft.toLocaleString()} ft · Your daily altitude
            </p>
            <h1 className="text-2xl font-bold text-white">{greeting}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {profile.first_name[0].toUpperCase()}{profile.last_name?.[0]?.toUpperCase() ?? ''}
          </div>
        </div>

        {/* Altitude badge */}
        <div className="inline-flex items-center gap-2 bg-navy-700/80 border border-slate-700/50 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-xs text-slate-300">
            {profile.home_elevation_ft.toLocaleString()} ft · Dry air ·{' '}
            {Math.round((1 - Math.pow(1 - profile.home_elevation_ft * 0.0000068756, 5.2561)) * 100)}% less O₂ than sea level
          </span>
        </div>
      </div>

      {/* Card stack */}
      <div className="px-4 space-y-6 pb-6">

        {/* Check-in section */}
        {cardStack.includes('checkin_new') || cardStack.includes('checkin_streak') ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              How are you feeling today?
            </p>
            <CheckInCard
              questions={questions}
              streakCount={streakCount}
              onSubmit={handleCheckinSubmit}
            />
          </div>
        ) : null}

        {/* Unlock interstitial */}
        {cardStack.includes('unlock_interstitial') && (
          <UnlockInterstitial onDismiss={dismissUnlockInterstitial} />
        )}

        {/* State 7: Completion */}
        {cardStack.includes('completion') && profile.goal && daysSinceGoal !== null && (
          <CompletionCard goal={profile.goal} daysSince={daysSinceGoal} />
        )}

        {/* Altitude context (educational states) */}
        {(cardStack.includes('altitude_intro') || cardStack.includes('altitude_educational')) && (
          <AltitudeContextCard
            homeElevationFt={profile.home_elevation_ft}
            title={educational.title}
            body={educational.body}
          />
        )}

        {/* Pattern lead */}
        {cardStack.includes('pattern_lead') && patterns.length > 0 && (
          <PatternCard pattern={patterns[0]} isFirst={checkins.length === 5} />
        )}

        {/* Goal cards */}
        {(cardStack.includes('goal_countdown') ||
          cardStack.includes('goal_urgency') ||
          cardStack.includes('goal_distant')) &&
          activeGoal &&
          daysUntilGoal !== null && (
            <GoalCountdownCard
              goal={activeGoal}
              homeElevationFt={profile.home_elevation_ft}
              daysUntil={daysUntilGoal}
            />
          )}

        {/* Stats row */}
        {cardStack.includes('stats_row') && <StatRow />}

        {/* Insights stack */}
        {cardStack.includes('insights') && insights.length > 0 && (
          <InsightsStack insights={insights} />
        )}

        {/* Final checklist */}
        {cardStack.includes('checklist_final') && activeGoal && daysUntilGoal !== null && (
          <FinalChecklistCard goal={activeGoal} daysUntil={daysUntilGoal} />
        )}

        {/* State 7: Recovery */}
        {cardStack.includes('recovery_deep') && daysSinceGoal !== null && (
          <RecoveryCard daysSince={daysSinceGoal} homeElevationFt={profile.home_elevation_ft} />
        )}

        {/* State 7: Reflection */}
        {cardStack.includes('reflection') && <ReflectionCard />}

        {/* State 7: New goal */}
        {cardStack.includes('new_goal_nudge') && <NewGoalCard />}

        {/* Streak card */}
        {(cardStack.includes('streak_building') || cardStack.includes('streak_active')) && (
          <StreakCard checkinCount={checkins.length} patternsActive={checkins.length >= 5} />
        )}

        {/* Nutrition */}
        {cardStack.includes('nutrition') && nutrition.length > 0 && (
          <NutritionCards cards={nutrition} />
        )}

        {/* Integrations */}
        {cardStack.includes('integrations') && (
          <IntegrationsNudge integrations={profile.integrations} />
        )}
      </div>
    </div>
  )
}
