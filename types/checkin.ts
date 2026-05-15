export interface Checkin {
  id: string
  user_id: string
  date: string // ISO date string YYYY-MM-DD
  energy: number | null           // 1-5
  sleep_quality: number | null    // 1-5
  breathlessness: number | null   // 1-5
  hydration_yesterday: number | null // 1-4 (new fixed question)
  training_today: number | null   // 1-5 (new fixed question)
  // Legacy fields — kept for backward compatibility
  mental_clarity: number | null
  hydration: number | null
  headache: number | null
  notes: string | null
  created_at: string
}

export type CheckinField = 'energy' | 'sleep_quality' | 'breathlessness' | 'hydration_yesterday' | 'training_today'

export interface CheckinQuestion {
  field: CheckinField
  label: string
}
