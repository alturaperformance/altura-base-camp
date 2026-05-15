import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt } from '@/lib/chat-context'
import type { FullUserContext } from '@/lib/chat-context'
import type { Goal } from '@/types/profile'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { message, conversationHistory, sessionDate } = await req.json()

  if (!message || !sessionDate) {
    return NextResponse.json({ error: 'message and sessionDate are required' }, { status: 400 })
  }

  // Count today's user messages
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('role', 'user')
    .eq('session_date', sessionDate)

  const todayCount = count ?? 0

  if (todayCount >= 5) {
    return NextResponse.json({ error: 'daily_limit_reached' }, { status: 429 })
  }

  // Build user context from DB
  const [
    { data: dbProfile },
    { data: activeGoals },
    { data: recentCheckins },
    { data: stravaToken },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('goals').select('*').eq('user_id', user.id).eq('is_active', true).limit(1),
    supabase.from('checkins').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(7),
    supabase.from('integration_tokens').select('access_token,refresh_token,expires_at').eq('user_id', user.id).eq('provider', 'strava').maybeSingle(),
  ])

  if (!dbProfile) {
    return NextResponse.json({ error: 'profile not found' }, { status: 404 })
  }

  const activeGoal = (activeGoals?.[0] ?? null) as Goal | null
  const daysUntilGoal = activeGoal
    ? Math.floor((new Date(activeGoal.date).getTime() - Date.now()) / 86_400_000)
    : null

  // Fetch Strava summary if connected
  let stravaContext = null
  if (stravaToken) {
    try {
      let accessToken = stravaToken.access_token
      // Refresh if expired
      if (new Date(stravaToken.expires_at).getTime() - 60_000 <= Date.now()) {
        const refreshRes = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: stravaToken.refresh_token,
          }),
        })
        if (refreshRes.ok) {
          const refreshed = await refreshRes.json()
          accessToken = refreshed.access_token
          await supabase.from('integration_tokens').update({
            access_token: refreshed.access_token,
            refresh_token: refreshed.refresh_token,
            expires_at: new Date(refreshed.expires_at * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('user_id', user.id).eq('provider', 'strava')
        }
      }

      const fourWeeksAgo = Math.floor((Date.now() - 28 * 86_400_000) / 1000)
      const activitiesRes = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${fourWeeksAgo}&per_page=30`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (activitiesRes.ok) {
        const activities = await activitiesRes.json()
        const now = new Date()
        const dayOfWeek = now.getDay()
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - daysFromMonday)
        startOfWeek.setHours(0, 0, 0, 0)
        const startOfPrevWeek = new Date(startOfWeek)
        startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7)

        const thisWeek = activities.filter((a: { start_date: string }) => new Date(a.start_date) >= startOfWeek)
        const prevWeek = activities.filter((a: { start_date: string }) => {
          const d = new Date(a.start_date)
          return d >= startOfPrevWeek && d < startOfWeek
        })

        const thisLoad = thisWeek.reduce((s: number, a: { moving_time: number }) => s + a.moving_time, 0)
        const prevLoad = prevWeek.reduce((s: number, a: { moving_time: number }) => s + a.moving_time, 0)
        const pct = prevLoad > 0 ? ((thisLoad - prevLoad) / prevLoad) * 100 : 0
        const loadTrend = pct > 30 ? 'Overreaching' : pct > 10 ? 'Building' : pct < -10 ? 'Tapering' : 'Maintaining'

        const weeklyElevationFt = Math.round(
          thisWeek.reduce((s: number, a: { total_elevation_gain: number }) => s + (a.total_elevation_gain ?? 0), 0) * 3.28084
        )

        const typeCount: Record<string, number> = {}
        activities.slice(0, 10).forEach((a: { type: string }) => {
          typeCount[a.type] = (typeCount[a.type] ?? 0) + 1
        })
        const primaryType = Object.entries(typeCount).sort((x, y) => y[1] - x[1])[0]?.[0] ?? 'Run'

        stravaContext = {
          loadTrend,
          weeklyElevationGainFt: weeklyElevationFt,
          activeDays: thisWeek.length,
          primaryActivityType: primaryType,
          efficiencyNote: 'Baseline comparison requires 4+ weeks of data',
        }
      }
    } catch {
      // Strava fetch failed — proceed without it
    }
  }

  const fullContext: FullUserContext = {
    profile: {
      id: dbProfile.id,
      first_name: dbProfile.first_name ?? '',
      last_name: dbProfile.last_name ?? '',
      email: dbProfile.email ?? user.email ?? '',
      lifestyle: dbProfile.lifestyle ?? null,
      training: {
        frequency: dbProfile.training_frequency ?? null,
        elevation_band: dbProfile.training_elevation_band ?? null,
      },
      home_elevation_ft: dbProfile.home_elevation_ft ?? 5280,
      symptoms: dbProfile.symptoms ?? [],
      goal: activeGoal,
      integrations: { strava: !!stravaToken, whoop: false, oura: false },
      onboarding_complete: dbProfile.onboarding_complete ?? false,
      units_preference: dbProfile.units_preference ?? 'imperial',
      created_at: dbProfile.created_at,
      updated_at: dbProfile.updated_at,
    },
    activeGoal,
    daysUntilGoal,
    recentCheckins: recentCheckins ?? [],
    stravaContext,
  }

  const systemPrompt = buildSystemPrompt(fullContext)

  // Save user message
  const newIndex = todayCount + 1
  await supabase.from('chat_messages').insert({
    user_id: user.id,
    role: 'user',
    content: message,
    session_date: sessionDate,
    message_index: newIndex,
  })

  // Call Claude API
  const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...(conversationHistory as ChatMessage[]),
        { role: 'user', content: message },
      ],
    }),
  })

  if (!claudeRes.ok) {
    console.error('[chat] Claude API error:', claudeRes.status, await claudeRes.text())
    return NextResponse.json({ error: 'AI response failed' }, { status: 502 })
  }

  const claudeData = await claudeRes.json()
  const assistantMessage: string = claudeData.content[0].text

  // Save assistant response
  await supabase.from('chat_messages').insert({
    user_id: user.id,
    role: 'assistant',
    content: assistantMessage,
    session_date: sessionDate,
    message_index: newIndex + 1,
  })

  return NextResponse.json({
    message: assistantMessage,
    limitReached: newIndex >= 5,
  })
}

// GET — load today's conversation history
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const sessionDate = searchParams.get('date')

  if (!sessionDate) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 })
  }

  const { data: messages } = await supabase
    .from('chat_messages')
    .select('role, content, message_index')
    .eq('user_id', user.id)
    .eq('session_date', sessionDate)
    .order('message_index', { ascending: true })

  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('role', 'user')
    .eq('session_date', sessionDate)

  return NextResponse.json({
    messages: messages ?? [],
    userMessageCount: count ?? 0,
  })
}
