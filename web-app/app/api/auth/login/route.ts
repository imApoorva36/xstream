import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/lib/database'
import { 
  generateToken, 
  validateEthereumSignature, 
  generateNonce, 
  createAuthMessage,
  hashPassword,
  verifyPassword 
} from '@/lib/auth'
import { z } from 'zod'

// Validation schemas
const emailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const walletLoginSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string(),
  message: z.string(),
  nonce: z.string()
})

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

// POST /api/auth/login - User login (email or wallet)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (type === 'email') {
      // Email/password login
      const { email, password } = emailLoginSchema.parse(body)
      
      const user = await userService.findUser(email)
      if (!user || !user.email) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      // Note: In real implementation, you'd store password hash in user table
      // For demo purposes, we'll assume password verification
      const isValidPassword = await verifyPassword(password, user.password || 'hashed_password')
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      // Update last login
      await userService.updateProfile(user.id, { lastLoginAt: new Date() })
      
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username || undefined,
        type: 'email'
      })
      
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          profileImage: user.profileImage
        },
        token
      })
      
    } else if (type === 'wallet') {
      // Web3 wallet login
      const { walletAddress, signature, message, nonce } = walletLoginSchema.parse(body)
      
      // Validate signature
      if (!validateEthereumSignature(message, signature, walletAddress)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
      
      // Check if message contains the correct nonce and address
      const expectedMessage = createAuthMessage(walletAddress, nonce)
      if (message !== expectedMessage) {
        return NextResponse.json({ error: 'Invalid message format' }, { status: 401 })
      }
      
      // Find or create user
      let user = await userService.findUser(walletAddress)
      if (!user) {
        return NextResponse.json({ error: 'User not found. Please register first.' }, { status: 404 })
      }
      
      // Update last login
      await userService.updateProfile(user.id, { lastLoginAt: new Date() })
      
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
          profileImage: user.profileImage,
          ensName: user.ensName
        },
        token
      })
      
    } else {
      return NextResponse.json({ error: 'Invalid login type' }, { status: 400 })
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Error in POST /api/auth/login:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}