// Database utility functions for xStream platform

import { prisma } from './prisma'
import type { User, Video, ViewSession, Achievement } from '@prisma/client'

// User Operations
export const userService = {
  // Create user with Web3 wallet or email
  async createUser(data: {
    email?: string
    username?: string
    displayName?: string
    walletAddress?: string
    ensName?: string
  }) {
    return await prisma.user.create({
      data
    })
  },

  // Find user by wallet or email
  async findUser(identifier: string) {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { walletAddress: identifier.toLowerCase() },
          { username: identifier }
        ]
      }
    })
  },

  // Update user profile
  async updateProfile(userId: string, data: Partial<User>) {
    return await prisma.user.update({
      where: { id: userId },
      data
    })
  },

  // Get user with stats
  async getUserWithStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        videos: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            totalViews: true,
            totalEarnings: true,
            createdAt: true
          }
        },
        stakes: {
          where: { status: 'ACTIVE' },
          select: { amount: true }
        },
        achievements: {
          where: { isEarned: true },
          include: { achievement: true }
        },
        earnings: {
          where: { status: 'PAID' },
          select: { amount: true, source: true, createdAt: true }
        }
      }
    })

    if (!user) return null

    // Calculate derived stats
    const totalStaked = user.stakes.reduce((sum, stake) => sum + Number(stake.amount), 0)
    const totalEarned = user.earnings.reduce((sum, earning) => sum + Number(earning.amount), 0)
    const totalVideos = user.videos.length
    const totalViews = user.videos.reduce((sum, video) => sum + video.totalViews, 0)

    return {
      ...user,
      stats: {
        totalStaked,
        totalEarned,
        totalVideos,
        totalViews,
        achievementsEarned: user.achievements.length
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

  // Get video with creator info
  async getVideoWithCreator(videoId: string) {
    return await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImage: true
          }
        },
        qualities: true
      }
    })
  },

  // Get videos with pagination and filters
  async getVideos(options: {
    page?: number
    limit?: number
    category?: string
    tags?: string[]
    search?: string
    sortBy?: 'recent' | 'popular' | 'earnings'
  }) {
    const { page = 1, limit = 20, category, tags, search, sortBy = 'recent' } = options
    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED',
      isActive: true
    }

    if (category) where.category = category
    if (tags?.length) where.tags = { hasSome: tags }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const orderBy: any = {}
    switch (sortBy) {
      case 'popular':
        orderBy.totalViews = 'desc'
        break
      case 'earnings':
        orderBy.totalEarnings = 'desc'
        break
      default:
        orderBy.publishedAt = 'desc'
    }

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
        pages: Math.ceil(total / limit)
      }
    }
  },

  // Update video analytics
  async updateVideoStats(videoId: string, stats: {
    viewsIncrement?: number
    watchTimeIncrement?: number
    earningsIncrement?: number
  }) {
    const { viewsIncrement = 0, watchTimeIncrement = 0, earningsIncrement = 0 } = stats
    
    return await prisma.video.update({
      where: { id: videoId },
      data: {
        totalViews: { increment: viewsIncrement },
        totalWatchTime: { increment: watchTimeIncrement },
        totalEarnings: { increment: earningsIncrement }
      }
    })
  }
}

// View Session Operations
export const sessionService = {
  // Create new viewing session
  async createSession(data: {
    sessionToken: string
    viewerId: string
    videoId: string
    stakedAmount: number
    qualityWatched: string
    deviceType?: string
    browserInfo?: string
    ipAddress?: string
  }) {
    return await prisma.viewSession.create({
      data: {
        ...data,
        stakedAmount: data.stakedAmount.toString()
      }
    })
  },

  // Update session progress
  async updateSession(sessionToken: string, data: {
    watchedSeconds?: number
    amountCharged?: number
    status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
    endTime?: Date
  }) {
    const updateData: any = { ...data }
    if (data.amountCharged !== undefined) {
      updateData.amountCharged = data.amountCharged.toString()
    }

    return await prisma.viewSession.update({
      where: { sessionToken },
      data: updateData
    })
  },

  // Get active session
  async getActiveSession(sessionToken: string) {
    return await prisma.viewSession.findUnique({
      where: { sessionToken },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            pricePerSecond: true,
            duration: true
          }
        },
        viewer: {
          select: {
            id: true,
            username: true,
            walletAddress: true
          }
        }
      }
    })
  },

  // Get user's session history
  async getUserSessions(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [sessions, total] = await Promise.all([
      prisma.viewSession.findMany({
        where: { viewerId: userId },
        orderBy: { startTime: 'desc' },
        skip,
        take: limit,
        include: {
          video: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
              duration: true
            }
          }
        }
      }),
      prisma.viewSession.count({ where: { viewerId: userId } })
    ])

    return {
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}

// Achievement Operations
export const achievementService = {
  // Get all achievements with user progress
  async getAchievementsForUser(userId: string) {
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
      include: {
        userAchievements: {
          where: { userId },
          select: {
            currentValue: true,
            isEarned: true,
            earnedAt: true,
            tokenId: true
          }
        }
      }
    })

    return achievements.map(achievement => ({
      ...achievement,
      userProgress: achievement.userAchievements[0] || {
        currentValue: 0,
        isEarned: false,
        earnedAt: null,
        tokenId: null
      }
    }))
  },

  // Update achievement progress
  async updateAchievementProgress(userId: string, achievementId: string, newValue: number) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    })

    if (!achievement) throw new Error('Achievement not found')

    const isEarned = newValue >= achievement.threshold

    return await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      },
      update: {
        currentValue: newValue,
        isEarned,
        earnedAt: isEarned ? new Date() : undefined
      },
      create: {
        userId,
        achievementId,
        currentValue: newValue,
        isEarned,
        earnedAt: isEarned ? new Date() : undefined
      }
    })
  },

  // Check and update watch time achievements
  async checkWatchTimeAchievements(userId: string) {
    // Get user's total watch time
    const totalWatchTime = await prisma.viewSession.aggregate({
      where: {
        viewerId: userId,
        status: 'COMPLETED'
      },
      _sum: {
        watchedSeconds: true
      }
    })

    const watchedSeconds = totalWatchTime._sum.watchedSeconds || 0

    // Get watch time achievements
    const watchTimeAchievements = await prisma.achievement.findMany({
      where: {
        category: 'WATCH_TIME',
        isActive: true
      }
    })

    // Update each achievement
    for (const achievement of watchTimeAchievements) {
      await this.updateAchievementProgress(userId, achievement.id, watchedSeconds)
    }

    return watchedSeconds
  }
}

// Analytics Operations
export const analyticsService = {
  // Record daily platform analytics
  async recordDailyAnalytics(date: Date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Calculate metrics for the day
    const [
      dailyActiveUsers,
      newUsers,
      totalUsers,
      newVideos,
      totalVideos,
      totalSessions,
      totalWatchTime,
      revenueData
    ] = await Promise.all([
      // Daily active users
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      // New users
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      // Total users
      prisma.user.count(),
      // New videos
      prisma.video.count({
        where: {
          publishedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      // Total videos
      prisma.video.count({ where: { status: 'PUBLISHED' } }),
      // Sessions
      prisma.viewSession.count({
        where: {
          startTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      // Watch time
      prisma.viewSession.aggregate({
        where: {
          startTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        _sum: { watchedSeconds: true }
      }),
      // Revenue data
      prisma.creatorEarning.aggregate({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        _sum: { amount: true }
      })
    ])

    const averageSessionLength = totalSessions > 0 
      ? Math.round((totalWatchTime._sum.watchedSeconds || 0) / totalSessions)
      : 0

    return await prisma.platformAnalytics.upsert({
      where: { date: startOfDay },
      update: {
        dailyActiveUsers,
        newUsers,
        totalUsers,
        newVideos,
        totalVideos,
        totalSessions,
        totalWatchTime: totalWatchTime._sum.watchedSeconds || 0,
        averageSessionLength,
        totalRevenue: revenueData._sum.amount || 0
      },
      create: {
        date: startOfDay,
        dailyActiveUsers,
        newUsers,
        totalUsers,
        newVideos,
        totalVideos,
        totalSessions,
        totalWatchTime: totalWatchTime._sum.watchedSeconds || 0,
        averageSessionLength,
        totalRevenue: revenueData._sum.amount || 0
      }
    })
  },

  // Get analytics dashboard data
  async getDashboardData(days = 30) {
    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - days)

    return await prisma.platformAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    })
  }
}