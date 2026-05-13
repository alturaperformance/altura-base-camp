import { NextRequest, NextResponse } from 'next/server'

// GET /api/profile — get user profile
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  // In production, query Supabase profiles table
  return NextResponse.json({ profile: null })
}

// PUT /api/profile — update user profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    // In production, update Supabase profiles table
    return NextResponse.json({ success: true, profile: body })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
