import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 })
    }

    const userData = await userService.getUserWithStats(address)

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error in GET /api/users/[address]/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
