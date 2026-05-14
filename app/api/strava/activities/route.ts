import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface StravaActivity {
  id: number
  name: string
  type: string
  distance: number
  moving_time: number
  total_elevation_gain: number
  start_date: string
  average_heartrate?: number
}

interface TokenRecord {
  access_token: string
  refresh_token: string
  expires_at: string
}

async function refreshStravaToken(refreshToken: string): Promise<{
  access_token: string
  refresh_token: string
  expires_at: number
} | null> {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) return null
  return res.json()
}

// GET /api/strava/activities — return this week's stats + recent activities
export async function GET(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: tokenRecord } = await supabase
    .from('integration_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', user.id)
    .eq('provider', 'strava')
    .single() as { data: TokenRecord | null }

  if (!tokenRecord) {
    return NextResponse.json({ error: 'Strava not connected' }, { status: 404 })
  }

  let accessToken = tokenRecord.access_token

  // Refresh token if expired (with 60s buffer)
  if (new Date(tokenRecord.expires_at).getTime() - 60_000 <= Date.now()) {
    const refreshed = await refreshStravaToken(tokenRecord.refresh_token)
    if (!refreshed) {
      return NextResponse.json({ error: 'Token refresh failed' }, { status: 502 })
    }
    accessToken = refreshed.access_token
    await supabase
      .from('integration_tokens')
      .update({
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
        expires_at: new Date(refreshed.expires_at * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('provider', 'strava')
  }

  // Fetch last 4 weeks of activities from Strava
  const fourWeeksAgo = Math.floor((Date.now() - 28 * 24 * 60 * 60 * 1000) / 1000)
  const activitiesRes = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${fourWeeksAgo}&per_page=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!activitiesRes.ok) {
    console.error('[strava/activities] fetch failed:', activitiesRes.status)
    return NextResponse.json({ error: 'Failed to fetch Strava activities' }, { status: 502 })
  }

  const activities: StravaActivity[] = await activitiesRes.json()

  // This-week stats (Monday → now)
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sun
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - daysFromMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  const thisWeek = activities.filter((a) => new Date(a.start_date) >= startOfWeek)

  const weeklyElevationFt = Math.round(
    thisWeek.reduce((sum, a) => sum + (a.total_elevation_gain ?? 0), 0) * 3.28084
  )

  // Load score: (hours of moving time × 10) + (elevation ft / 100)
  const weeklyLoadScore = Math.round(
    thisWeek.reduce(
      (sum, a) =>
        sum +
        (a.moving_time / 3600) * 10 +
        ((a.total_elevation_gain ?? 0) * 3.28084) / 100,
      0
    )
  )

  // Recent 5 activities
  const recentActivities = activities.slice(0, 5).map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    distance_mi: Math.round(a.distance * 0.000621371 * 10) / 10,
    elevation_ft: Math.round((a.total_elevation_gain ?? 0) * 3.28084),
    moving_time_min: Math.round(a.moving_time / 60),
    start_date: a.start_date,
    days_ago: Math.floor((Date.now() - new Date(a.start_date).getTime()) / 86_400_000),
  }))

  return NextResponse.json({
    weeklyActivityCount: thisWeek.length,
    weeklyElevationFt,
    weeklyLoadScore,
    recentActivities,
  })
}
