import { NextRequest, NextResponse } from 'next/server'
import { generateNonce, createAuthMessage } from '@/lib/auth'

// GET /api/auth/nonce - Generate nonce for Web3 authentication
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }
    
    // Validate address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/
    if (!addressRegex.test(walletAddress)) {
      return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 })
    }
    
    const nonce = generateNonce()
    const message = createAuthMessage(walletAddress, nonce)
    
    return NextResponse.json({
      nonce,
      message,
      address: walletAddress.toLowerCase()
    })
    
  } catch (error) {
    console.error('Error in GET /api/auth/nonce:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}