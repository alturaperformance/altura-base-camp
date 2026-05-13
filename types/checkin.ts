export interface Checkin {
  id: string
  user_id: string
  date: string // ISO date string YYYY-MM-DD
  energy: number | null        // 1-5
  sleep_quality: number | null // 1-5
  breathlessness: number | null // 1-5
  mental_clarity: number | null // 1-5
  hydration: number | null     // 1-5
  headache: number | null      // 1-5
  notes: string | null
  created_at: string
}

export type CheckinField = 'energy' | 'sleep_quality' | 'breathlessness' | 'mental_clarity' | 'hydration' | 'headache'

export interface CheckinQuestion {
  field: CheckinField
  label: string
}
