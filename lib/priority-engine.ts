import type { AppContext, CardId } from '@/types/insights'
import { determineState } from './state-machine'

export function buildCardStack(context: AppContext): CardId[] {
  const {
    checkinToday,
    readinessScore,
    checkinCount,
    activeGoal,
    daysUntilGoal,
    daysSinceGoal,
    integrations,
  } = context

  const stack: CardId[] = []

  // ── Lead card ────────────────────────────────────────────────────────────
  // EC-04: check-in always leads if not done today. No exceptions.
  if (!checkinToday) {
    stack.push(checkinCount === 0 ? 'checkin_new' : 'checkin_streak')
  }

  // State 7: post-goal (0–7 days after goal date)
  else if (daysSinceGoal !== null && daysSinceGoal >= 0 && daysSinceGoal <= 7) {
    stack.push('completion')
  }

  // EC-06: readiness override — score < 60 bumps recovery to lead
  else if (readinessScore !== null && readinessScore < 60) {
    stack.push('readiness')
  }

  // Goal states — lead varies by proximity
  else if (activeGoal && daysUntilGoal !== null) {
    if (daysUntilGoal <= 7) stack.push('goal_urgency')
    else if (daysUntilGoal <= 30) stack.push('goal_countdown')
    else stack.push('goal_distant')
  }

  // State 3: pattern-driven lead (5+ check-ins, no goal)
  else if (checkinCount >= 5) {
    stack.push('pattern_lead')
  }

  // State 1/2 fallback: educational altitude card
  else {
    stack.push(checkinCount === 0 ? 'altitude_intro' : 'altitude_educational')
  }

  // ── EC-07: unlock interstitial (shown once on 5th check-in) ─────────────
  if (checkinCount === 5 && context.showUnlockInterstitial) {
    stack.push('unlock_interstitial')
  }

  // ── Goal card in position 2 (if readiness overrode it) ──────────────────
  if (
    activeGoal &&
    !stack.includes('goal_countdown') &&
    !stack.includes('goal_urgency') &&
    !stack.includes('goal_distant') &&
    daysSinceGoal === null &&
    daysUntilGoal !== null
  ) {
    if (daysUntilGoal <= 7) stack.push('goal_urgency')
    else if (daysUntilGoal <= 30) stack.push('goal_countdown')
    else stack.push('goal_distant')
  }

  // ── Stats row (integrations only) ───────────────────────────────────────
  if (integrations.strava && checkinToday) {
    stack.push('stats_row')
  }

  // ── Insights ─────────────────────────────────────────────────────────────
  stack.push('insights')

  // ── Final checklist (State 6 only) ──────────────────────────────────────
  if (daysUntilGoal !== null && daysUntilGoal <= 7) {
    stack.push('checklist_final')
  }

  // ── State 7 specific cards ───────────────────────────────────────────────
  if (daysSinceGoal !== null && daysSinceGoal >= 0 && daysSinceGoal <= 7) {
    stack.push('recovery_deep')
    stack.push('reflection')
    stack.push('new_goal_nudge')
  }

  // ── Streak card ──────────────────────────────────────────────────────────
  if (!activeGoal && daysSinceGoal === null) {
    stack.push(checkinCount >= 5 ? 'streak_active' : 'streak_building')
  }

  // ── Nutrition ────────────────────────────────────────────────────────────
  stack.push('nutrition')

  // ── Integrations (always last) ───────────────────────────────────────────
  stack.push('integrations')

  return stack
}

export { determineState }
