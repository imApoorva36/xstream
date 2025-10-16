import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { userService } from './database'

export interface AuthUser {
  id: string
  email?: string
  username?: string
  walletAddress?: string
  type: 'email' | 'wallet'
}

export interface JWTPayload {
  userId: string
  email?: string
  username?: string
  walletAddress?: string
  type: 'email' | 'wallet'
  iat: number
  exp: number
}

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

// Hash password for email-based auth
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password for email-based auth
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    username: user.username,
    walletAddress: user.walletAddress,
    type: user.type
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // 7 days
  })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Extract token from request headers
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check for token in cookies
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie) {
    return tokenCookie.value
  }
  
  return null
}

// Get authenticated user from request
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthUser | null> {
  const token = extractTokenFromRequest(request)
  
  if (!token) {
    return null
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }
  
  // Verify user still exists in database
  const user = await userService.findUser(payload.userId)
  if (!user || !user.isActive) {
    return null
  }
  
  return {
    id: user.id,
    email: user.email || undefined,
    username: user.username || undefined,
    walletAddress: user.walletAddress || undefined,
    type: user.walletAddress ? 'wallet' : 'email'
  }
}

// Middleware to require authentication
export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser } | { error: string; status: number }> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return { error: 'Authentication required', status: 401 }
  }
  
  return { user }
}

// Validate Ethereum signature for Web3 auth
export function validateEthereumSignature(
  message: string, 
  signature: string, 
  address: string
): boolean {
  try {
    // This is a simplified version - in production, use ethers.js or web3.js
    // to properly verify the signature
    
    // For now, we'll do basic validation
    if (!message || !signature || !address) {
      return false
    }
    
    // Check if address is valid Ethereum address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/
    if (!addressRegex.test(address)) {
      return false
    }
    
    // Check if signature is valid format
    const signatureRegex = /^0x[a-fA-F0-9]{130}$/
    if (!signatureRegex.test(signature)) {
      return false
    }
    
    // In production, use proper signature verification:
    // const recoveredAddress = ethers.utils.verifyMessage(message, signature)
    // return recoveredAddress.toLowerCase() === address.toLowerCase()
    
    // For demo purposes, return true if format is correct
    return true
  } catch (error) {
    console.error('Signature validation error:', error)
    return false
  }
}

// Generate nonce for Web3 authentication
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Create auth message for Web3 signing
export function createAuthMessage(address: string, nonce: string): string {
  return `Welcome to xStream!

Click to sign in and accept the xStream Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address:
${address}

Nonce:
${nonce}`
}

// User session management
export interface UserSession {
  userId: string
  username?: string
  walletAddress?: string
  email?: string
  createdAt: Date
  expiresAt: Date
}

// In-memory session store (use Redis in production)
const sessionStore = new Map<string, UserSession>()

// Create user session
export function createSession(user: AuthUser): string {
  const sessionId = generateNonce()
  const session: UserSession = {
    userId: user.id,
    username: user.username,
    walletAddress: user.walletAddress,
    email: user.email,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
  
  sessionStore.set(sessionId, session)
  return sessionId
}

// Get session
export function getSession(sessionId: string): UserSession | null {
  const session = sessionStore.get(sessionId)
  
  if (!session) {
    return null
  }
  
  if (session.expiresAt < new Date()) {
    sessionStore.delete(sessionId)
    return null
  }
  
  return session
}

// Delete session
export function deleteSession(sessionId: string): void {
  sessionStore.delete(sessionId)
}

// Clean expired sessions (run periodically)
export function cleanExpiredSessions(): void {
  const now = new Date()
  for (const [sessionId, session] of sessionStore.entries()) {
    if (session.expiresAt < now) {
      sessionStore.delete(sessionId)
    }
  }
}