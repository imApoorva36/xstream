import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/lib/database'
import { z } from 'zod'

// Validation schema - wallet-only auth (Web3)
const createUserSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(1).max(50).optional(),
  profileImage: z.string().url().optional()
})

// GET /api/users - Get user by wallet address
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const user = await userService.findByWallet(walletAddress)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error in GET /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/users - Create or update user (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Upsert user (create if doesn't exist, update if exists)
    const user = await userService.upsertUser(
      validatedData.walletAddress,
      {
        username: validatedData.username,
        displayName: validatedData.displayName,
        profileImage: validatedData.profileImage
      }
    )
    
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error'
      }, { status: 400 })
    }

    console.error('Error in POST /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
