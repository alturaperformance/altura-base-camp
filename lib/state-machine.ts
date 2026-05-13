import type { AppContext } from '@/types/insights'

export type UserState = 1 | 2 | 3 | 4 | 5 | 6 | 7

export function determineState(context: AppContext): UserState {
  const { checkinCount, activeGoal, daysUntilGoal, daysSinceGoal } = context

  // State 7: within 7 days after goal date
  if (daysSinceGoal !== null && daysSinceGoal >= 0 && daysSinceGoal <= 7) {
    return 7
  }

  // Goal states — EC-01: goal overrides baseline even if < 5 check-ins
  if (activeGoal && daysUntilGoal !== null) {
    if (daysUntilGoal <= 7) return 6
    if (daysUntilGoal <= 30) return 5
    return 4
  }

  // No goal states
  if (checkinCount === 0) return 1
  if (checkinCount < 5) return 2
  return 3
}
