import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const clientId = process.env.OURA_CLIENT_ID
  const redirectUri = process.env.OURA_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Oura OAuth not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'daily sleep readiness',
  })

  return NextResponse.redirect(
    `https://cloud.ouraring.com/oauth/authorize?${params.toString()}`
  )
}
