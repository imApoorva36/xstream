import { NextRequest, NextResponse } from 'next/server'
import { videoService } from '@/lib/database'
import { z } from 'zod'

// Validation schemas
const createVideoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  duration: z.number().min(1),
  pricePerSecond: z.number().min(0),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  creatorId: z.string()
})

const getVideosSchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => Math.min(parseInt(val) || 20, 100)).optional(),
  category: z.string().optional(),
  tags: z.string().transform(val => val ? val.split(',') : undefined).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['recent', 'popular', 'earnings']).optional()
})

// GET /api/videos - Get videos with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const validatedParams = getVideosSchema.parse(params)
    
    const result = await videoService.getVideos(validatedParams)
    
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid query parameters', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in GET /api/videos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/videos - Create new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createVideoSchema.parse(body)

    const video = await videoService.createVideo(validatedData)
    
    return NextResponse.json({ video }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in POST /api/videos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}