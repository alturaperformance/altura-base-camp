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

  // Only run on initial load / profile change — not on every pathname change.
  // The middleware already blocks unauthenticated users; this guard handles the
  // case where onboarding hasn't been completed yet.
  useEffect(() => {
    if (profile !== undefined && !profile?.onboarding_complete) {
      router.push('/onboarding')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.onboarding_complete])

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
      <BottomNav state={state} />
    </div>
  )
}
