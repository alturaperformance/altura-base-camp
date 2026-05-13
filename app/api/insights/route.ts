import { NextRequest, NextResponse } from 'next/server'
import { buildCardStack } from '@/lib/priority-engine'
import { getInsightCards } from '@/lib/insights-content'
import { detectPatterns } from '@/lib/pattern-detection'
import type { AppContext } from '@/types/insights'

// GET /api/insights — compute card stack for the current user context
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const context: AppContext = body.context

    if (!context) {
      return NextResponse.json({ error: 'context is required' }, { status: 400 })
    }

    const cardStack = buildCardStack(context)
    const patterns = detectPatterns(context.checkins)
    const { insights, nutrition } = getInsightCards(
      context.profile.symptoms,
      context.checkins.length >= 5 ? 3 : context.checkins.length === 0 ? 1 : 2,
      context.checkins.length
    )

    return NextResponse.json({
      cardStack,
      patterns,
      insights,
      nutrition,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
