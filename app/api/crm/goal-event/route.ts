import { NextRequest, NextResponse } from 'next/server'

// POST /api/crm/goal-event — fire CRM event on goal creation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, goal_name, goal_date, goal_location } = body

    if (!user_id || !goal_name || !goal_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const webhookUrl = process.env.CRM_WEBHOOK_URL
    const apiKey = process.env.CRM_API_KEY

    if (!webhookUrl) {
      // CRM not configured — log and continue
      console.warn('[CRM] WEBHOOK_URL not set, skipping goal event')
      return NextResponse.json({ success: true, skipped: true })
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        event: 'goal_created',
        user_id,
        goal_name,
        goal_date,
        goal_location: goal_location ?? null,
        fired_at: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      console.error('[CRM] Webhook call failed:', res.status)
      // Non-blocking — don't fail the user flow
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CRM] Error firing goal event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
