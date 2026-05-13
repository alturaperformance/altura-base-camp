import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?whoop=error`)
  }

  try {
    // Exchange code for token — store in Supabase integration_tokens in production
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?whoop=connected`)
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?whoop=error`)
  }
}
