import { NextRequest, NextResponse } from 'next/server'

// POST /api/goal — create a new goal (also fires CRM event)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, type, name, date, location, max_elevation_ft, activities, other_activity } = body

    if (!user_id || !type || !name || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const goal = {
      id: `goal-${Date.now()}`,
      user_id,
      type,
      name,
      date,
      location: location ?? null,
      max_elevation_ft: max_elevation_ft ?? null,
      activities: activities ?? [],
      other_activity: other_activity ?? null,
      is_active: true,
      completed_at: null,
      created_at: new Date().toISOString(),
    }

    // Fire CRM event (goal data: name, date, location)
    if (process.env.CRM_WEBHOOK_URL) {
      await fireCRMEvent({ user_id, goal_name: name, goal_date: date, goal_location: location })
    }

    return NextResponse.json({ goal })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function fireCRMEvent(data: {
  user_id: string
  goal_name: string
  goal_date: string
  goal_location: string | null
}) {
  try {
    await fetch(process.env.CRM_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CRM_API_KEY}`,
      },
      body: JSON.stringify({
        event: 'goal_created',
        ...data,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch {
    // CRM event failure must not block the user flow
  }
}
