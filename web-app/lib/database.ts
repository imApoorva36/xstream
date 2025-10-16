// Database utility functions for xStream platform - Simplified MVP

import { prisma } from './prisma'

// User Operations
export const userService = {
  // Create or get user by wallet address
  async upsertUser(walletAddress: string, data?: {
    username?: string
    displayName?: string
    profileImage?: string
  }) {
    return await prisma.user.upsert({
      where: { walletAddress: walletAddress.toLowerCase() },
      create: {
        walletAddress: walletAddress.toLowerCase(),
        ...data
      },
      update: data || {}
    })
  },

  // Find user by wallet
  async findByWallet(walletAddress: string) {
    return await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })
  },

  // Get user with stats
  async getUserWithStats(walletAddress: string) {
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        videos: {
          select: {
            id: true,
            title: true,
            totalViews: true,
            totalEarnings: true,
            totalWatchTime: true,
            publishedAt: true
          }
        },
        viewSessions: {
          select: {
            watchedSeconds: true,
            amountCharged: true
          }
        },
        earnings: {
          where: { status: 'PAID' },
          select: { amount: true, paidAt: true }
        }
      }
    })

    if (!user) return null

    // Calculate stats
    const totalEarned = user.earnings.reduce((sum: number, e: any) => sum + Number(e.amount), 0)
    const totalVideos = user.videos.length
    const totalViews = user.videos.reduce((sum: number, v: any) => sum + v.totalViews, 0)
    const totalWatchTime = user.viewSessions.reduce((sum: number, s: any) => sum + s.watchedSeconds, 0)
    const totalSpent = user.viewSessions.reduce((sum: number, s: any) => sum + Number(s.amountCharged), 0)

    return {
      ...user,
      stats: {
        totalEarned,
        totalVideos,
        totalViews,
        totalWatchTime,
        totalSpent
      }
    }
  }
}

// Video Operations
export const videoService = {
  // Create new video
  async createVideo(data: {
    title: string
    description?: string
    videoUrl: string
    thumbnailUrl: string
    duration: number
    pricePerSecond: number
    category?: string
    tags?: string[]
    creatorId: string
  }) {
    return await prisma.video.create({
      data: {
        ...data,
        pricePerSecond: data.pricePerSecond.toString()
      }
    })
  },

  // Get videos with filters
  async getVideos(params?: {
    page?: number
    limit?: number
    category?: string
    tags?: string[]
    search?: string
    sortBy?: 'recent' | 'popular' | 'earnings'
  }) {
    const page = params?.page || 1
    const limit = params?.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (params?.category) {
      where.category = params.category
    }
    
    if (params?.tags && params.tags.length > 0) {
      where.tags = {
        hasSome: params.tags
      }
    }
    
    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ]
    }

    let orderBy: any = { publishedAt: 'desc' }
    if (params?.sortBy === 'popular') orderBy = { totalViews: 'desc' }
    if (params?.sortBy === 'earnings') orderBy = { totalEarnings: 'desc' }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
              displayName: true,
              profileImage: true
            }
          }
        }
      }),
      prisma.video.count({ where })
    ])

    return {
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  // Get video by ID
  async getVideoById(id: string) {
    return await prisma.video.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            walletAddress: true,
            username: true,
            displayName: true,
            profileImage: true
          }
        }
      }
    })
  },

  // Update video stats
  async updateStats(id: string, data: {
    totalViews?: number
    totalWatchTime?: number
    totalEarnings?: number
  }) {
    return await prisma.video.update({
      where: { id },
      data: {
        totalViews: data.totalViews !== undefined ? { increment: 1 } : undefined,
        totalWatchTime: data.totalWatchTime !== undefined ? { increment: data.totalWatchTime } : undefined,
        totalEarnings: data.totalEarnings !== undefined ? { increment: data.totalEarnings } : undefined
      }
    })
  }
}

// View Session Operations
export const sessionService = {
  // Create new session
  async createSession(data: {
    sessionToken: string
    viewerId: string
    videoId: string
  }) {
    return await prisma.viewSession.create({
      data
    })
  },

  // Get session
  async getSession(sessionToken: string) {
    return await prisma.viewSession.findUnique({
      where: { sessionToken },
      include: {
        video: true,
        viewer: true
      }
    })
  },

  // Update session (watched time, charged amount)
  async updateSession(sessionToken: string, data: {
    watchedSeconds?: number
    amountCharged?: number
    status?: string
    endTime?: Date
  }) {
    return await prisma.viewSession.update({
      where: { sessionToken },
      data: {
        watchedSeconds: data.watchedSeconds,
        amountCharged: data.amountCharged?.toString(),
        status: data.status,
        endTime: data.endTime
      }
    })
  },

  // Complete session
  async completeSession(sessionToken: string) {
    return await prisma.viewSession.update({
      where: { sessionToken },
      data: {
        status: 'COMPLETED',
        endTime: new Date()
      }
    })
  }
}

// Creator Earnings Operations
export const earningService = {
  // Create earning record
  async createEarning(data: {
    amount: number
    creatorId: string
    videoId?: string
    sessionId?: string
    txHash?: string
  }) {
    return await prisma.creatorEarning.create({
      data: {
        ...data,
        amount: data.amount.toString()
      }
    })
  },

  // Get creator earnings
  async getCreatorEarnings(creatorId: string, params?: {
    status?: string
    page?: number
    limit?: number
  }) {
    const page = params?.page || 1
    const limit = params?.limit || 20
    const skip = (page - 1) * limit

    const where: any = { creatorId }
    if (params?.status) where.status = params.status

    const [earnings, total] = await Promise.all([
      prisma.creatorEarning.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.creatorEarning.count({ where })
    ])

    return {
      earnings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  // Mark earning as paid
  async markAsPaid(id: string, txHash: string) {
    return await prisma.creatorEarning.update({
      where: { id },
      data: {
        status: 'PAID',
        txHash,
        paidAt: new Date()
      }
    })
  }
}
