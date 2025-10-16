import { NextRequest, NextResponse } from 'next/server'
import { sessionService, videoService } from '@/lib/database'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

// Validation schemas
const createSessionSchema = z.object({
  viewerId: z.string(),
  videoId: z.string()
})

const updateSessionSchema = z.object({
  sessionToken: z.string(),
  watchedSeconds: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED']).optional()
})

// GET /api/sessions - Get session by token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionToken = searchParams.get('sessionToken')

    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token is required' }, { status: 400 })
    }

    const session = await sessionService.getSession(sessionToken)
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ session })
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

    // Generate unique session token
    const sessionToken = uuidv4()

    const session = await sessionService.createSession({
      sessionToken,
      viewerId: validatedData.viewerId,
      videoId: validatedData.videoId
    })
    
    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error'
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
    const currentSession = await sessionService.getSession(sessionToken)
    if (!currentSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update session with new data
    const updateData: any = {}
    
    if (watchedSeconds !== undefined) {
      updateData.watchedSeconds = watchedSeconds
      
      // Calculate amount charged based on video price
      const video = await videoService.getVideoById(currentSession.videoId)
      if (video) {
        const pricePerSecond = Number(video.pricePerSecond)
        updateData.amountCharged = watchedSeconds * pricePerSecond
      }
    }
    
    if (status !== undefined) {
      updateData.status = status
      if (status === 'COMPLETED') {
        updateData.endTime = new Date()
      }
    }

    const updatedSession = await sessionService.updateSession(sessionToken, updateData)
    
    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error'
      }, { status: 400 })
    }

    console.error('Error in PATCH /api/sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}