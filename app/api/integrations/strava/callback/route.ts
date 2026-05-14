import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/integrations/strava/callback — handle Strava OAuth callback
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const origin = new URL(req.url).origin

  if (error || !code) {
    return NextResponse.redirect(`${origin}/settings?strava=error`)
  }

  try {
    const redirectUri = `${origin}/api/integrations/strava/callback`

    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenRes.ok) {
      console.error('[strava/callback] token exchange failed:', await tokenRes.text())
      throw new Error('Token exchange failed')
    }

    const tokenData = await tokenRes.json()
    // tokenData shape: { access_token, refresh_token, expires_at (unix), athlete: { id, ... } }

    // Get the authenticated Supabase user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${origin}/login`)
    }

    // Upsert token record — one row per user per provider
    const { error: dbError } = await supabase
      .from('integration_tokens')
      .upsert(
        {
          user_id: user.id,
          provider: 'strava',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
          scope: 'read,activity:read_all',
          raw: tokenData.athlete ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' }
      )

    if (dbError) {
      console.error('[strava/callback] DB error:', dbError.message)
      return NextResponse.redirect(`${origin}/settings?strava=error`)
    }

    return NextResponse.redirect(`${origin}/training?strava=connected`)
  } catch (err) {
    console.error('[strava/callback] error:', err)
    return NextResponse.redirect(`${origin}/settings?strava=error`)
  }
}
