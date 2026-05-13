import { NextRequest, NextResponse } from 'next/server'

// GET /api/integrations/strava/callback — handle Strava OAuth callback
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?strava=error`
    )
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) throw new Error('Token exchange failed')

    // In production: store token in Supabase integration_tokens table
    // const tokenData = await tokenRes.json()

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?strava=connected`
    )
  } catch {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?strava=error`
    )
  }
}
