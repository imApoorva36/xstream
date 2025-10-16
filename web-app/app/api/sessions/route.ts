import { NextRequest, NextResponse } from 'next/server'
import { sessionService, videoService, achievementService } from '@/lib/database'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

// Validation schemas
const createSessionSchema = z.object({
  viewerId: z.string(),
  videoId: z.string(),
  stakedAmount: z.number().min(0),
  qualityWatched: z.string(),
  deviceType: z.string().optional(),
  browserInfo: z.string().optional()
})

const updateSessionSchema = z.object({
  sessionToken: z.string(),
  watchedSeconds: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED']).optional()
})

// GET /api/sessions - Get user sessions or active session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionToken = searchParams.get('sessionToken')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    if (sessionToken) {
      // Get specific session
      const session = await sessionService.getActiveSession(sessionToken)
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      return NextResponse.json({ session })
    }

    if (userId) {
      // Get user session history
      const result = await sessionService.getUserSessions(userId, page, limit)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  } catch (error) {
    console.error('Error in GET /api/sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/sessions - Create new viewing session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Generate unique session token
    const sessionToken = uuidv4()

    const session = await sessionService.createSession({
      ...validatedData,
      sessionToken,
      ipAddress: ip
    })
    
    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in POST /api/sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/sessions - Update session progress
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionToken, watchedSeconds, status } = updateSessionSchema.parse(body)

    // Get current session
    const currentSession = await sessionService.getActiveSession(sessionToken)
    if (!currentSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Calculate billing if watchedSeconds provided
    let updateData: any = { status }
    
    if (watchedSeconds !== undefined) {
      const pricePerSecond = Number(currentSession.video.pricePerSecond)
      const amountCharged = watchedSeconds * pricePerSecond
      
      updateData = {
        ...updateData,
        watchedSeconds,
        amountCharged,
        endTime: status === 'COMPLETED' ? new Date() : undefined
      }

      // Update video analytics
      await videoService.updateVideoStats(currentSession.video.id, {
        watchTimeIncrement: watchedSeconds - currentSession.watchedSeconds,
        earningsIncrement: amountCharged - Number(currentSession.amountCharged)
      })

      // Check achievements for watch time
      if (status === 'COMPLETED') {
        await achievementService.checkWatchTimeAchievements(currentSession.viewerId)
      }
    }

    const updatedSession = await sessionService.updateSession(sessionToken, updateData)
    
    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in PATCH /api/sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}