import type { Checkin } from '@/types/checkin'
import type { Pattern } from '@/types/insights'

export function detectPatterns(checkins: Checkin[]): Pattern[] {
  if (checkins.length < 5) return []

  const patterns: Pattern[] = []

  // Sleep → energy correlation
  const sleepEnergyPairs = checkins
    .filter(c => c.sleep_quality && c.energy)
    .map(c => ({ sleep: c.sleep_quality!, energy: c.energy! }))

  if (sleepEnergyPairs.length >= 5) {
    const lowSleepLowEnergy = sleepEnergyPairs.filter(
      p => p.sleep <= 2 && p.energy <= 2
    ).length
    const lowSleepTotal = sleepEnergyPairs.filter(p => p.sleep <= 2).length

    if (lowSleepTotal >= 3 && lowSleepLowEnergy / lowSleepTotal >= 0.7) {
      patterns.push({
        type: 'correlation',
        title: 'Energy dips consistently after poor sleep nights',
        body: `Every time you logged sleep below 3, energy was also below 3 the following morning. At your altitude that connection is amplified — low sleep hits harder here than at sea level.`,
        confidence: lowSleepLowEnergy / lowSleepTotal,
        dataPoints: lowSleepTotal,
      })
    }
  }

  // Hydration trend
  const recentHydration = checkins
    .slice(-5)
    .filter(c => c.hydration)
    .map(c => c.hydration!)

  if (recentHydration.length >= 4) {
    const firstHalf = recentHydration.slice(0, 2).reduce((a, b) => a + b, 0) / 2
    const secondHalf = recentHydration.slice(-2).reduce((a, b) => a + b, 0) / 2

    if (secondHalf - firstHalf >= 0.5) {
      patterns.push({
        type: 'trend',
        title: 'Hydration scores improving',
        body: `Your self-reported hydration has trended upward over your last ${recentHydration.length} check-ins. That's the highest-leverage habit at your altitude — keep it up.`,
        confidence: Math.min((secondHalf - firstHalf) / 2, 1),
        dataPoints: recentHydration.length,
      })
    }
  }

  // Breathlessness timing pattern
  const breathPairs = checkins
    .filter(c => c.breathlessness !== null)
    .map(c => c.breathlessness!)

  if (breathPairs.length >= 5) {
    const highBreath = breathPairs.filter(b => b >= 4).length
    if (highBreath / breathPairs.length >= 0.6) {
      patterns.push({
        type: 'timing',
        title: 'Breathlessness flagged consistently',
        body: `You've logged elevated breathlessness in ${highBreath} of your last ${breathPairs.length} check-ins. At your elevation, this pattern often responds well to pacing adjustments and pre-activity hydration.`,
        confidence: highBreath / breathPairs.length,
        dataPoints: breathPairs.length,
      })
    }
  }

  return patterns
}

export function hasDetectablePattern(checkins: Checkin[]): boolean {
  return detectPatterns(checkins).length > 0
}
