export type ActivityType =
  | 'hiking'
  | 'trail_running'
  | 'skiing'
  | 'mountaineering'
  | 'cycling'
  | 'camping'
  | 'other'

export interface GoalFormData {
  type: 'event' | 'trip'
  name: string
  date: string
  location: string
  max_elevation_ft: string
  activities: ActivityType[]
  other_activity: string
}
