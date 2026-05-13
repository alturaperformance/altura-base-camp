import { NextRequest, NextResponse } from 'next/server'

// Supabase OAuth callback handler
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    // In production: exchange code for session using Supabase server client
    // const supabase = await createClient()
    // const { error } = await supabase.auth.exchangeCodeForSession(code)
    // if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
