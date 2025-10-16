import { NextRequest, NextResponse } from 'next/server'
import { achievementService } from '@/lib/database'

// GET /api/achievements - Get achievements for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const achievements = await achievementService.getAchievementsForUser(userId)
    
    return NextResponse.json({ achievements })
  } catch (error) {
    console.error('Error in GET /api/achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/achievements/check - Manually trigger achievement checks
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check watch time achievements
    const totalWatchTime = await achievementService.checkWatchTimeAchievements(userId)
    
    return NextResponse.json({ 
      message: 'Achievements checked',
      totalWatchTime 
    })
  } catch (error) {
    console.error('Error in POST /api/achievements/check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}