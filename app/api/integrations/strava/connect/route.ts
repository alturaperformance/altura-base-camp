import { NextRequest, NextResponse } from 'next/server'

// GET /api/integrations/strava/connect — initiate Strava OAuth
export async function GET(req: NextRequest) {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Strava OAuth not configured' }, { status: 500 })
  }

  // Derive redirect URI from the incoming request so this works on any env
  const origin = new URL(req.url).origin
  const redirectUri = `${origin}/api/integrations/strava/callback`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read_all',
  })

  return NextResponse.redirect(
    `https://www.strava.com/oauth/authorize?${params.toString()}`
  )
}
