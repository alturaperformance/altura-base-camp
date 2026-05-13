export type Lifestyle = 'daily_local' | 'weekend_warrior' | 'serious_trainer' | 'event_prep'

export type TrainingFrequency = '1-2' | '3-4' | '5+'

export type ElevationBand = 'below_3k' | '3k_5k' | '5k_8k' | '8k_10k' | '10k_plus'

export type Symptom =
  | 'fatigue'
  | 'headache'
  | 'breathlessness'
  | 'poor_sleep'
  | 'nausea'
  | 'dizziness'
  | 'appetite_loss'
  | 'brain_fog'
  | 'elevated_hr'
  | 'dry_mouth'
  | 'none'

export interface Integrations {
  strava: boolean
  whoop: boolean
  oura: boolean
}

export interface Profile {
  id: string
  first_name: string
  lifestyle: Lifestyle | null
  training: {
    frequency: TrainingFrequency | null
    elevation_band: ElevationBand | null
  }
  home_elevation_ft: number
  symptoms: Symptom[]
  goal: Goal | null
  integrations: Integrations
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  type: 'event' | 'trip'
  name: string
  date: string // ISO date string
  location: string
  max_elevation_ft: number | null
  activities: string[]
  other_activity: string | null
  is_active: boolean
  completed_at: string | null
  created_at: string
}
