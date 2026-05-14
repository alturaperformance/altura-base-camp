'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore, getCheckinToday, getDaysUntilGoal, getDaysSinceGoal } from '@/lib/demo-store'
import { createClient } from '@/lib/supabase/client'
import { determineState } from '@/lib/state-machine'
import { BottomNav } from '@/components/nav/BottomNav'
import type { AppContext } from '@/types/insights'
import type { Profile } from '@/types/profile'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profile, setProfile, checkins, showUnlockInterstitial } = useAppStore()
  const [hydrating, setHydrating] = useState(true)

  useEffect(() => {
    async function hydrateProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // If the store already has this user's profile loaded, skip the fetch
      if (profile?.id === user.id) {
        setHydrating(false)
        return
      }

      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (dbProfile) {
        const hydrated: Profile = {
          id: dbProfile.id,
          first_name: dbProfile.first_name ?? '',
          last_name: dbProfile.last_name ?? '',
          email: dbProfile.email ?? user.email ?? '',
          lifestyle: dbProfile.lifestyle ?? null,
          training: dbProfile.training ?? { frequency: null, elevation_band: null },
          home_elevation_ft: dbProfile.home_elevation_ft ?? 5280,
          symptoms: dbProfile.symptoms ?? [],
          goal: dbProfile.goal ?? null,
          integrations: dbProfile.integrations ?? { strava: false, whoop: false, oura: false },
          onboarding_complete: dbProfile.onboarding_complete ?? false,
          created_at: dbProfile.created_at ?? new Date().toISOString(),
          updated_at: dbProfile.updated_at ?? new Date().toISOString(),
        }
        setProfile(hydrated)
      }

      setHydrating(false)
    }

    hydrateProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Guard: redirect to onboarding only after hydration confirms it's needed
  useEffect(() => {
    if (!hydrating && !profile?.onboarding_complete) {
      router.push('/onboarding')
    }
  }, [hydrating, profile?.onboarding_complete, router])

  if (hydrating || !profile?.onboarding_complete) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading…</div>
      </div>
    )
  }

  const activeGoal = profile.goal?.is_active ? profile.goal : null
  const daysUntilGoal = getDaysUntilGoal(activeGoal)
  const daysSinceGoal = getDaysSinceGoal(profile.goal)

  const context: AppContext = {
    profile,
    checkins,
    checkinToday: getCheckinToday(checkins),
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

  return (
    <div className="min-h-screen bg-navy-900">
      <main className="pb-24">
        {children}
      </main>
      <BottomNav state={state} />
    </div>
  )
}
