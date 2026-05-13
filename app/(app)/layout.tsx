'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore, getCheckinToday, getDaysUntilGoal, getDaysSinceGoal } from '@/lib/demo-store'
import { determineState } from '@/lib/state-machine'
import { BottomNav } from '@/components/nav/BottomNav'
import type { AppContext } from '@/types/insights'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { profile, checkins, showUnlockInterstitial } = useAppStore()

  useEffect(() => {
    if (!profile?.onboarding_complete && pathname !== '/onboarding') {
      router.push('/onboarding')
    }
  }, [profile, pathname, router])

  if (!profile?.onboarding_complete) {
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
      <BottomNav state={state} goal={activeGoal} lifestyle={profile.lifestyle} />
    </div>
  )
}
