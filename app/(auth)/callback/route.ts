import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[callback] exchangeCodeForSession error:', error?.message)
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const user = data.user
  const meta = user.user_metadata ?? {}

  // Google provides given_name / family_name; fall back to splitting full name
  const firstName: string =
    meta.given_name ?? meta.full_name?.split(' ')[0] ?? meta.name?.split(' ')[0] ?? ''
  const lastName: string =
    meta.family_name ?? meta.full_name?.split(' ').slice(1).join(' ') ?? meta.name?.split(' ').slice(1).join(' ') ?? ''
  const email: string = user.email ?? meta.email ?? ''

  // Upsert profile — insert on first login, no-op on subsequent logins
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 = row not found — that's expected for new users
    console.error('[callback] profile fetch error:', fetchError.message)
  }

  if (!existingProfile) {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      onboarding_complete: false,
    })
    if (insertError) {
      console.error('[callback] profile insert error:', insertError.message)
    }
  }

  const destination = existingProfile?.onboarding_complete ? '/home' : '/onboarding'
  return NextResponse.redirect(`${origin}${destination}`)
}
