'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Goal, Lifestyle, Symptom, Integrations } from '@/types/profile'
import type { Checkin } from '@/types/checkin'

interface AppState {
  profile: Profile | null
  checkins: Checkin[]
  showUnlockInterstitial: boolean

  // Actions
  setProfile: (profile: Profile) => void
  updateProfile: (updates: Partial<Profile>) => void
  addCheckin: (checkin: Omit<Checkin, 'id' | 'created_at'>) => void
  setGoal: (goal: Goal) => void
  completeGoal: (goalId: string) => void
  dismissUnlockInterstitial: () => void
  connectIntegration: (provider: keyof Integrations) => void
  reset: () => void
}

const defaultProfile: Profile = {
  id: 'demo-user',
  first_name: 'Sam',
  last_name: '',
  email: '',
  lifestyle: null,
  training: { frequency: null, elevation_band: null },
  home_elevation_ft: 5280,
  symptoms: [],
  goal: null,
  integrations: { strava: false, whoop: false, oura: false },
  onboarding_complete: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      checkins: [],
      showUnlockInterstitial: false,

      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates, updated_at: new Date().toISOString() }
            : { ...defaultProfile, ...updates, updated_at: new Date().toISOString() },
        })),

      addCheckin: (checkinData) => {
        const checkin: Checkin = {
          ...checkinData,
          id: `checkin-${Date.now()}`,
          created_at: new Date().toISOString(),
        }
        const prevCount = get().checkins.length
        set((state) => ({ checkins: [...state.checkins, checkin] }))
        // Trigger unlock interstitial on 5th check-in
        if (prevCount === 4) {
          set({ showUnlockInterstitial: true })
        }
      },

      setGoal: (goal) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, goal, updated_at: new Date().toISOString() }
            : null,
        })),

      completeGoal: (goalId) =>
        set((state) => {
          if (!state.profile?.goal || state.profile.goal.id !== goalId) return state
          return {
            profile: {
              ...state.profile,
              goal: {
                ...state.profile.goal,
                is_active: false,
                completed_at: new Date().toISOString(),
              },
            },
          }
        }),

      dismissUnlockInterstitial: () => set({ showUnlockInterstitial: false }),

      connectIntegration: (provider) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                integrations: { ...state.profile.integrations, [provider]: true },
              }
            : null,
        })),

      reset: () => set({ profile: null, checkins: [], showUnlockInterstitial: false }),
    }),
    {
      name: 'altura-basecamp-store',
    }
  )
)

// Computed helpers
export function getCheckinToday(checkins: Checkin[]): boolean {
  const today = new Date().toISOString().split('T')[0]
  return checkins.some((c) => c.date === today)
}

export function getDaysUntilGoal(goal: Goal | null): number | null {
  if (!goal || !goal.is_active) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const goalDate = new Date(goal.date)
  goalDate.setHours(0, 0, 0, 0)
  const diff = Math.floor((goalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff : null
}

export function getDaysSinceGoal(goal: Goal | null): number | null {
  if (!goal) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const goalDate = new Date(goal.date)
  goalDate.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - goalDate.getTime()) / (1000 * 60 * 60 * 24))
  return diff >= 0 && diff <= 7 ? diff : null
}

export function formatElevation(ft: number): string {
  return ft.toLocaleString() + ' ft'
}

export function getElevationDelta(homeElevation: number, goalElevation: number | null): string | null {
  if (!goalElevation) return null
  const delta = goalElevation - homeElevation
  if (delta <= 0) return null
  return delta.toLocaleString() + ' ft'
}
