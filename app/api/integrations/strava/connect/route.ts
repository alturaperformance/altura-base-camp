import { NextRequest, NextResponse } from 'next/server'

// GET /api/integrations/strava/connect — initiate Strava OAuth
export async function GET(req: NextRequest) {
  const clientId = process.env.STRAVA_CLIENT_ID
  const redirectUri = process.env.STRAVA_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Strava OAuth not configured' }, { status: 500 })
  }

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
