import { NextRequest, NextResponse } from 'next/server'
import { videoService } from '@/lib/database'

interface Params {
  id: string
}

// GET /api/videos/[id] - Get specific video with creator info
export async function GET(
  request: NextRequest, 
  { params }: { params: Params }
) {
  try {
    const { id } = params
    
    const video = await videoService.getVideoWithCreator(id)
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Increment view count (basic analytics)
    await videoService.updateVideoStats(id, { viewsIncrement: 1 })
    
    return NextResponse.json({ video })
  } catch (error) {
    console.error('Error in GET /api/videos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}