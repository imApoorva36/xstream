import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/lib/database'
import { 
  generateToken, 
  validateEthereumSignature, 
  createAuthMessage,
  hashPassword 
} from '@/lib/auth'
import { z } from 'zod'

// Validation schemas
const emailRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(1).max(50).optional()
})

const walletRegisterSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string(),
  message: z.string(),
  nonce: z.string(),
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(1).max(50).optional(),
  ensName: z.string().optional()
})

// POST /api/auth/register - User registration (email or wallet)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (type === 'email') {
      // Email/password registration
      const validatedData = emailRegisterSchema.parse(body)
      
      // Check if user already exists
      const existingUser = await userService.findUser(validatedData.email)
      if (existingUser) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
      }
      
      // Hash password
      const hashedPassword = await hashPassword(validatedData.password)
      
      // Create user
      const user = await userService.createUser({
        email: validatedData.email,
        username: validatedData.username,
        displayName: validatedData.displayName || validatedData.username,
        // Note: Add password field to user schema in production
        // password: hashedPassword
      })
      
      const token = generateToken({
        id: user.id,
        email: user.email || undefined,
        username: user.username || undefined,
        type: 'email'
      })
      
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName
        },
        token
      }, { status: 201 })
      
    } else if (type === 'wallet') {
      // Web3 wallet registration
      const validatedData = walletRegisterSchema.parse(body)
      
      // Validate signature
      if (!validateEthereumSignature(validatedData.message, validatedData.signature, validatedData.walletAddress)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
      
      // Check if message contains the correct nonce and address
      const expectedMessage = createAuthMessage(validatedData.walletAddress, validatedData.nonce)
      if (validatedData.message !== expectedMessage) {
        return NextResponse.json({ error: 'Invalid message format' }, { status: 401 })
      }
      
      // Check if wallet already exists
      const existingUser = await userService.findUser(validatedData.walletAddress)
      if (existingUser) {
        return NextResponse.json({ error: 'Wallet already registered' }, { status: 409 })
      }
      
      // Create user
      const user = await userService.createUser({
        walletAddress: validatedData.walletAddress.toLowerCase(),
        username: validatedData.username,
        displayName: validatedData.displayName || validatedData.username,
        ensName: validatedData.ensName
      })
      
      const token = generateToken({
        id: user.id,
        walletAddress: user.walletAddress || undefined,
        username: user.username || undefined,
        type: 'wallet'
      })
      
      return NextResponse.json({
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          username: user.username,
          displayName: user.displayName,
          ensName: user.ensName
        },
        token
      }, { status: 201 })
      
    } else {
      return NextResponse.json({ error: 'Invalid registration type' }, { status: 400 })
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in POST /api/auth/register:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}