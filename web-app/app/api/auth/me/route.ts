import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

// GET /api/auth/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error in GET /api/auth/me:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/auth/logout - Logout user (clear session)
export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Invalidate the JWT token (add to blacklist)
    // 2. Clear session from Redis/database
    // 3. Clear httpOnly cookies
    
    const response = NextResponse.json({ message: 'Logged out successfully' })
    
    // Clear auth cookie if it exists
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    
    return response
    
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}