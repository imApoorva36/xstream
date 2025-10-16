import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/lib/database'
import { z } from 'zod'

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(1).max(50).optional(),
  walletAddress: z.string().optional(),
  ensName: z.string().optional()
}).refine(data => data.email || data.walletAddress, {
  message: "Either email or walletAddress is required"
})

const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  profileImage: z.string().url().optional()
})

// GET /api/users - Get user profile or search users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('identifier')
    const userId = searchParams.get('userId')

    if (userId) {
      // Get user with stats
      const user = await userService.getUserWithStats(userId)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ user })
    }

    if (identifier) {
      // Find user by email/wallet/username
      const user = await userService.findUser(identifier)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ user })
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  } catch (error) {
    console.error('Error in GET /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Check if user already exists
    if (validatedData.email) {
      const existingUser = await userService.findUser(validatedData.email)
      if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
      }
    }

    if (validatedData.walletAddress) {
      const existingUser = await userService.findUser(validatedData.walletAddress)
      if (existingUser) {
        return NextResponse.json({ error: 'User with this wallet already exists' }, { status: 409 })
      }
    }

    // Create user
    const user = await userService.createUser(validatedData)
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in POST /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/users - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updateData } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const validatedData = updateUserSchema.parse(updateData)

    // Check if username is taken (if being updated)
    if (validatedData.username) {
      const existingUser = await userService.findUser(validatedData.username)
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
      }
    }

    const updatedUser = await userService.updateProfile(userId, validatedData)
    
    return NextResponse.json({ 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
        updatedAt: updatedUser.updatedAt
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in PATCH /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}