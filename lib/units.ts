export type Units = 'imperial' | 'metric'

export function formatElevation(ft: number, units: Units): string {
  if (units === 'metric') {
    return `${Math.round(ft * 0.3048).toLocaleString()} m`
  }
  return `${ft.toLocaleString()} ft`
}

export function formatDistance(miles: number, units: Units): string {
  if (units === 'metric') {
    return `${(miles * 1.60934).toFixed(1)} km`
  }
  return `${miles.toFixed(1)} mi`
}

export function formatPace(secPerMile: number, units: Units): string {
  const targetSec = units === 'metric' ? secPerMile / 1.60934 : secPerMile
  const min = Math.floor(targetSec / 60)
  const sec = Math.round(targetSec % 60)
  const unit = units === 'metric' ? '/km' : '/mi'
  return `${min}:${sec.toString().padStart(2, '0')}${unit}`
}
