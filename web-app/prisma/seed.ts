import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample achievements
  console.log('Creating achievements...')
  const achievements = await Promise.all([
    // Watch Time Achievements
    prisma.achievement.create({
      data: {
        name: 'First Steps',
        description: 'Watch your first 60 seconds of content',
        category: 'WATCH_TIME',
        threshold: 60,
        imageUrl: '/achievements/first-steps.png',
        utilityLevel: 1
      }
    }),
    prisma.achievement.create({
      data: {
        name: '10 Minute Milestone',
        description: 'Watch 10 minutes of content',
        category: 'WATCH_TIME',
        threshold: 600,
        imageUrl: '/achievements/10-minutes.png',
        utilityLevel: 2
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Hour Hero',
        description: 'Watch 1 hour of content',
        category: 'WATCH_TIME',
        threshold: 3600,
        imageUrl: '/achievements/hour-hero.png',
        utilityLevel: 3
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Binge Watcher',
        description: 'Watch 10 hours of content',
        category: 'WATCH_TIME',
        threshold: 36000,
        imageUrl: '/achievements/binge-watcher.png',
        utilityLevel: 4
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Content Connoisseur',
        description: 'Watch 100 hours of content',
        category: 'WATCH_TIME',
        threshold: 360000,
        imageUrl: '/achievements/connoisseur.png',
        utilityLevel: 5
      }
    }),

    // Creator Achievements
    prisma.achievement.create({
      data: {
        name: 'First Upload',
        description: 'Upload your first video',
        category: 'CREATOR_UPLOAD',
        threshold: 1,
        imageUrl: '/achievements/first-upload.png',
        utilityLevel: 1
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Content Creator',
        description: 'Upload 10 videos',
        category: 'CREATOR_UPLOAD',
        threshold: 10,
        imageUrl: '/achievements/content-creator.png',
        utilityLevel: 3
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Prolific Producer',
        description: 'Upload 100 videos',
        category: 'CREATOR_UPLOAD',
        threshold: 100,
        imageUrl: '/achievements/prolific-producer.png',
        utilityLevel: 5
      }
    }),

    // Platform Loyalty
    prisma.achievement.create({
      data: {
        name: 'Early Adopter',
        description: 'Join xStream in the first month',
        category: 'PLATFORM_LOYALTY',
        threshold: 1,
        imageUrl: '/achievements/early-adopter.png',
        utilityLevel: 4
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Community Champion',
        description: 'Active for 30 days',
        category: 'PLATFORM_LOYALTY',
        threshold: 30,
        imageUrl: '/achievements/community-champion.png',
        utilityLevel: 5
      }
    })
  ])

  console.log(`✅ Created ${achievements.length} achievements`)

  // Create sample users
  console.log('Creating sample users...')
  const sampleUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'creator@example.com',
        username: 'topCreator',
        displayName: 'Top Creator',
        bio: 'Creating amazing content on xStream',
        walletAddress: '0x742d35cc6634c0532925a3b8d2f8f5c5b032b7e1',
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'viewer@example.com',
        username: 'eagleViewer',
        displayName: 'Eagle Viewer',
        bio: 'Love watching great content',
        walletAddress: '0x8ba1f109551bd432803012645hac136c25c12cf',
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'advertiser@example.com',
        username: 'adMaster',
        displayName: 'Ad Master',
        bio: 'Running effective ad campaigns',
        walletAddress: '0x742d35cc6634c0532925a3b8d2f8f5c5b032b123',
        emailVerified: true
      }
    })
  ])

  console.log(`✅ Created ${sampleUsers.length} sample users`)

  // Create sample videos
  console.log('Creating sample videos...')
  const sampleVideos = await Promise.all([
    prisma.video.create({
      data: {
        title: 'Introduction to DeFi: A Beginner\'s Guide',
        description: 'Learn the basics of Decentralized Finance and how it\'s revolutionizing the financial world.',
        videoUrl: 'https://example.com/videos/defi-intro.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/defi-intro.jpg',
        duration: 1200, // 20 minutes
        pricePerSecond: '0.000001', // 0.000001 ETH per second
        category: 'Education',
        tags: ['DeFi', 'Cryptocurrency', 'Finance', 'Beginner'],
        status: 'PUBLISHED',
        publishedAt: new Date(),
        creatorId: sampleUsers[0].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'Advanced Trading Strategies',
        description: 'Master advanced trading techniques and risk management in crypto markets.',
        videoUrl: 'https://example.com/videos/advanced-trading.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/advanced-trading.jpg',
        duration: 1800, // 30 minutes
        pricePerSecond: '0.000002', // Higher price for advanced content
        category: 'Trading',
        tags: ['Trading', 'Strategy', 'Advanced', 'Risk Management'],
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        creatorId: sampleUsers[0].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'NFT Art Creation Workshop',
        description: 'Create your first NFT artwork and learn about digital art monetization.',
        videoUrl: 'https://example.com/videos/nft-workshop.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/nft-workshop.jpg',
        duration: 900, // 15 minutes
        pricePerSecond: '0.000003', // Premium content
        category: 'Art',
        tags: ['NFT', 'Art', 'Creation', 'Workshop'],
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        creatorId: sampleUsers[0].id
      }
    })
  ])

  console.log(`✅ Created ${sampleVideos.length} sample videos`)

  // Create video qualities for each video
  console.log('Creating video qualities...')
  const videoQualities = []
  for (const video of sampleVideos) {
    const qualities = await Promise.all([
      prisma.videoQuality.create({
        data: {
          videoId: video.id,
          quality: '720p',
          url: video.videoUrl.replace('.mp4', '_720p.mp4'),
          fileSize: BigInt(100 * 1024 * 1024), // 100MB
          bitrate: 2500
        }
      }),
      prisma.videoQuality.create({
        data: {
          videoId: video.id,
          quality: '1080p',
          url: video.videoUrl.replace('.mp4', '_1080p.mp4'),
          fileSize: BigInt(200 * 1024 * 1024), // 200MB
          bitrate: 5000
        }
      })
    ])
    videoQualities.push(...qualities)
  }

  console.log(`✅ Created ${videoQualities.length} video quality options`)

  // Create sample view sessions
  console.log('Creating sample view sessions...')
  const viewSessions = await Promise.all([
    prisma.viewSession.create({
      data: {
        sessionToken: 'session_' + Date.now() + '_1',
        watchedSeconds: 600, // Watched 10 minutes
        stakedAmount: '0.001',
        amountCharged: '0.0006', // 600 seconds * 0.000001 ETH
        status: 'COMPLETED',
        qualityWatched: '1080p',
        deviceType: 'desktop',
        viewerId: sampleUsers[1].id,
        videoId: sampleVideos[0].id,
        endTime: new Date()
      }
    }),
    prisma.viewSession.create({
      data: {
        sessionToken: 'session_' + Date.now() + '_2',
        watchedSeconds: 1800, // Watched full video
        stakedAmount: '0.004',
        amountCharged: '0.0036', // 1800 seconds * 0.000002 ETH
        status: 'COMPLETED',
        qualityWatched: '720p',
        deviceType: 'mobile',
        viewerId: sampleUsers[1].id,
        videoId: sampleVideos[1].id,
        endTime: new Date()
      }
    })
  ])

  console.log(`✅ Created ${viewSessions.length} sample view sessions`)

  // Update video stats based on sessions
  console.log('Updating video statistics...')
  await prisma.video.update({
    where: { id: sampleVideos[0].id },
    data: {
      totalViews: 1,
      totalWatchTime: 600,
      totalEarnings: '0.0006',
      uniqueViewers: 1
    }
  })

  await prisma.video.update({
    where: { id: sampleVideos[1].id },
    data: {
      totalViews: 1,
      totalWatchTime: 1800,
      totalEarnings: '0.0036',
      uniqueViewers: 1
    }
  })

  // Create sample ad campaign
  console.log('Creating sample ad campaign...')
  const adCampaign = await prisma.adCampaign.create({
    data: {
      name: 'Crypto Exchange Promotion',
      description: 'Promote our new crypto exchange platform',
      adContentUrl: 'https://example.com/ads/crypto-exchange.mp4',
      targetUrl: 'https://example-exchange.com',
      totalBudget: '1.0',
      remainingBudget: '0.8',
      pricePerView: '0.0001',
      pricePerClick: '0.001',
      targetCategories: ['Trading', 'Finance'],
      targetCountries: ['US', 'UK', 'CA'],
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      advertiserId: sampleUsers[2].id
    }
  })

  console.log('✅ Created sample ad campaign')

  // Create sample user stakes
  console.log('Creating sample user stakes...')
  await prisma.userStake.create({
    data: {
      amount: '0.1',
      status: 'ACTIVE',
      userId: sampleUsers[1].id
    }
  })

  // Create sample creator earnings
  console.log('Creating sample creator earnings...')
  await prisma.creatorEarning.create({
    data: {
      amount: '0.0042', // Total from both videos
      source: 'VIDEO_VIEWS',
      status: 'PAID',
      creatorId: sampleUsers[0].id,
      description: 'Earnings from video views',
      paidAt: new Date()
    }
  })

  // Grant some achievements to viewer
  console.log('Granting sample achievements...')
  await prisma.userAchievement.create({
    data: {
      userId: sampleUsers[1].id,
      achievementId: achievements[0].id, // First Steps
      currentValue: 2400, // Total watch time
      isEarned: true,
      earnedAt: new Date()
    }
  })

  await prisma.userAchievement.create({
    data: {
      userId: sampleUsers[1].id,
      achievementId: achievements[1].id, // 10 Minute Milestone
      currentValue: 2400,
      isEarned: true,
      earnedAt: new Date()
    }
  })

  // Create initial platform analytics
  console.log('Creating initial platform analytics...')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  await prisma.platformAnalytics.create({
    data: {
      date: today,
      dailyActiveUsers: 3,
      newUsers: 3,
      totalUsers: 3,
      newVideos: 3,
      totalVideos: 3,
      totalWatchTime: 2400,
      totalRevenue: '0.0042',
      creatorRevenue: '0.0042',
      platformRevenue: '0',
      totalSessions: 2,
      averageSessionLength: 1200
    }
  })

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Seeded data summary:')
  console.log(`- ${achievements.length} achievements`)
  console.log(`- ${sampleUsers.length} users`)
  console.log(`- ${sampleVideos.length} videos`)
  console.log(`- ${videoQualities.length} video quality options`)
  console.log(`- ${viewSessions.length} view sessions`)
  console.log('- 1 ad campaign')
  console.log('- 1 user stake')
  console.log('- 1 creator earning record')
  console.log('- 2 user achievements')
  console.log('- 1 platform analytics record')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })