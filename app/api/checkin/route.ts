import { NextRequest, NextResponse } from 'next/server'

// POST /api/checkin — log a daily check-in
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, date, energy, sleep_quality, breathlessness, mental_clarity, hydration, headache, notes } = body

    if (!user_id || !date) {
      return NextResponse.json({ error: 'user_id and date are required' }, { status: 400 })
    }

    // In a real implementation, this would write to Supabase
    // For now, client-side state handles persistence via zustand/persist

    return NextResponse.json({
      id: `checkin-${Date.now()}`,
      user_id,
      date,
      energy: energy ?? null,
      sleep_quality: sleep_quality ?? null,
      breathlessness: breathlessness ?? null,
      mental_clarity: mental_clarity ?? null,
      hydration: hydration ?? null,
      headache: headache ?? null,
      notes: notes ?? null,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/checkin?user_id=xxx — retrieve check-in history
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  // In production, query Supabase here
  return NextResponse.json({ checkins: [] })
}
