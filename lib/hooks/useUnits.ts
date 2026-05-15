'use client'

import { useAppStore } from '@/lib/demo-store'
import { formatElevation, formatDistance, formatPace } from '@/lib/units'
export type { Units } from '@/lib/units'
export { formatElevation, formatDistance, formatPace } from '@/lib/units'

export function useUnits() {
  const profile = useAppStore((state) => state.profile)
  const units = (profile?.units_preference ?? 'imperial') as import('@/lib/units').Units

  return {
    units,
    formatElevation: (ft: number) => formatElevation(ft, units),
    formatDistance: (miles: number) => formatDistance(miles, units),
    formatPace: (secPerMile: number) => formatPace(secPerMile, units),
  }
}
