export interface InsightCard {
  id: string
  icon: string // emoji or icon name
  title: string
  body: string
  tag?: string
  elevation?: number
}

export interface Pattern {
  type: 'correlation' | 'trend' | 'timing'
  title: string
  body: string
  confidence: number
  dataPoints: number
}

export type UserState = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type CardId =
  | 'checkin_new'
  | 'checkin_streak'
  | 'checkin_done'
  | 'readiness'
  | 'altitude_intro'
  | 'altitude_educational'
  | 'pattern_lead'
  | 'goal_distant'
  | 'goal_countdown'
  | 'goal_urgency'
  | 'completion'
  | 'stats_row'
  | 'streak_building'
  | 'streak_active'
  | 'insights'
  | 'checklist_final'
  | 'recovery_deep'
  | 'reflection'
  | 'new_goal_nudge'
  | 'nutrition'
  | 'integrations'
  | 'unlock_interstitial'

export interface AppContext {
  profile: import('./profile').Profile
  checkins: import('./checkin').Checkin[]
  checkinToday: boolean
  readinessScore: number | null
  checkinCount: number
  activeGoal: import('./profile').Goal | null
  secondaryGoal: import('./profile').Goal | null
  daysUntilGoal: number | null
  daysSinceGoal: number | null
  showUnlockInterstitial: boolean
  integrations: import('./profile').Integrations
}
