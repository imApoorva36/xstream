import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/database'
import { z } from 'zod'

const getDashboardSchema = z.object({
  days: z.string().transform(val => Math.min(parseInt(val) || 30, 365)).optional()
})

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const { days } = getDashboardSchema.parse(params)
    
    const analytics = await analyticsService.getDashboardData(days)
    
    // Calculate summary stats
    const summary = analytics.reduce((acc, day) => ({
      totalUsers: Math.max(acc.totalUsers, day.totalUsers),
      totalVideos: Math.max(acc.totalVideos, day.totalVideos),
      totalRevenue: acc.totalRevenue + Number(day.totalRevenue),
      totalWatchTime: acc.totalWatchTime + day.totalWatchTime,
      totalSessions: acc.totalSessions + day.totalSessions
    }), {
      totalUsers: 0,
      totalVideos: 0,
      totalRevenue: 0,
      totalWatchTime: 0,
      totalSessions: 0
    })
    
    return NextResponse.json({ 
      analytics, 
      summary,
      period: { days: days || 30 }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid query parameters', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in GET /api/analytics/dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/analytics/record - Record daily analytics (internal use)
export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json()
    const analyticsDate = date ? new Date(date) : new Date()
    
    const result = await analyticsService.recordDailyAnalytics(analyticsDate)
    
    return NextResponse.json({ 
      message: 'Analytics recorded',
      data: result 
    })
  } catch (error) {
    console.error('Error in POST /api/analytics/record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}