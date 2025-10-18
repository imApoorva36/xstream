import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding for xStream...\n')

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...')
  await prisma.creatorEarning.deleteMany()
  await prisma.viewSession.deleteMany()
  await prisma.video.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Existing data cleared\n')

  // Create sample users (creators and viewers)
  console.log('👥 Creating users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        walletAddress: '0x1234567890123456789012345678901234567890',
        username: 'cryptoedu',
        displayName: 'CryptoEdu',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
      }
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x2345678901234567890123456789012345678901',
        username: 'basebuilder',
        displayName: 'Base Builder',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
      }
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x3456789012345678901234567890123456789012',
        username: 'web3creator',
        displayName: 'Web3 Creator',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
      }
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x4567890123456789012345678901234567890123',
        username: 'streamtech',
        displayName: 'StreamTech',
        profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop'
      }
    }),
    prisma.user.create({
      data: {
        walletAddress: '0x5678901234567890123456789012345678901234',
        username: 'viewer1',
        displayName: 'Alex Viewer',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
      }
    })
  ])
  console.log(`✅ Created ${users.length} users\n`)

  // Create sample videos
  console.log('🎥 Creating videos...')
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        title: 'Introduction to x402 Micropayments',
        description: 'Learn how x402 enables precise micropayments for content consumption. In this comprehensive tutorial, we explore the revolutionary technology behind pay-per-second streaming.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1280&h=720&fit=crop&q=80',
        duration: 630, // 10:30 in seconds
        pricePerSecond: 0.01,
        category: 'Education',
        tags: ['x402', 'micropayments', 'blockchain', 'tutorial'],
        totalViews: 1250,
        totalWatchTime: 450000,
        totalEarnings: 4500,
        creatorId: users[0].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'Building on Base: A Developer\'s Guide',
        description: 'Complete guide to developing dApps on the Base blockchain. Learn about smart contracts, deployment, and best practices.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop&q=80',
        duration: 945, // 15:45
        pricePerSecond: 0.008,
        category: 'Technology',
        tags: ['base', 'blockchain', 'development', 'smart contracts'],
        totalViews: 890,
        totalWatchTime: 320000,
        totalEarnings: 2560,
        creatorId: users[1].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'NFT Rewards & Loyalty Programs',
        description: 'How NFT rewards can revolutionize content creator loyalty. Explore use cases and implementation strategies.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1280&h=720&fit=crop&q=80',
        duration: 500, // 8:20
        pricePerSecond: 0.005,
        category: 'Web3',
        tags: ['nft', 'rewards', 'loyalty', 'web3'],
        totalViews: 2340,
        totalWatchTime: 580000,
        totalEarnings: 2900,
        creatorId: users[2].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'Real-time Video Monetization',
        description: 'The future of pay-per-second video streaming. Learn how creators can earn instant payments from viewers.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d61?w=1280&h=720&fit=crop&q=80',
        duration: 735, // 12:15
        pricePerSecond: 0.012,
        category: 'Business',
        tags: ['monetization', 'streaming', 'payments', 'creators'],
        totalViews: 1560,
        totalWatchTime: 420000,
        totalEarnings: 5040,
        creatorId: users[3].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'Future of Content Creation',
        description: 'Exploring how blockchain technology is changing the creator economy. Web3 tools, decentralization, and fair compensation.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1280&h=720&fit=crop&q=80',
        duration: 400, // 6:40
        pricePerSecond: 0.003,
        category: 'Entertainment',
        tags: ['creator economy', 'web3', 'blockchain', 'future'],
        totalViews: 3200,
        totalWatchTime: 640000,
        totalEarnings: 1920,
        creatorId: users[0].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'Blockchain Explained Simply',
        description: 'A beginner-friendly introduction to blockchain technology. No technical background required!',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1280&h=720&fit=crop&q=80',
        duration: 570, // 9:30
        pricePerSecond: 0.007,
        category: 'Education',
        tags: ['blockchain', 'beginner', 'tutorial', 'crypto'],
        totalViews: 4500,
        totalWatchTime: 890000,
        totalEarnings: 6230,
        creatorId: users[1].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'Smart Contract Security Best Practices',
        description: 'Essential security patterns for Solidity developers. Learn how to write secure smart contracts.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&h=720&fit=crop&q=80',
        duration: 860, // 14:20
        pricePerSecond: 0.015,
        category: 'Technology',
        tags: ['solidity', 'security', 'smart contracts', 'development'],
        totalViews: 780,
        totalWatchTime: 290000,
        totalEarnings: 4350,
        creatorId: users[2].id
      }
    }),
    prisma.video.create({
      data: {
        title: 'DeFi Explained: Lending and Borrowing',
        description: 'Understanding decentralized finance protocols. How lending pools work and how to use them safely.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1280&h=720&fit=crop&q=80',
        duration: 680, // 11:20
        pricePerSecond: 0.009,
        category: 'Finance',
        tags: ['defi', 'lending', 'borrowing', 'finance'],
        totalViews: 1890,
        totalWatchTime: 450000,
        totalEarnings: 4050,
        creatorId: users[3].id
      }
    })
  ])
  console.log(`✅ Created ${videos.length} videos\n`)

  // Create sample viewing sessions
  console.log('📺 Creating view sessions...')
  const sessions = await Promise.all([
    prisma.viewSession.create({
      data: {
        sessionToken: 'session-001-abc123',
        viewerId: users[4].id, // Alex Viewer
        videoId: videos[0].id,
        startTime: new Date('2025-10-16T10:00:00Z'),
        endTime: new Date('2025-10-16T10:08:30Z'),
        watchedSeconds: 510,
        amountCharged: 5.10,
        status: 'COMPLETED'
      }
    }),
    prisma.viewSession.create({
      data: {
        sessionToken: 'session-002-def456',
        viewerId: users[4].id,
        videoId: videos[1].id,
        startTime: new Date('2025-10-16T14:30:00Z'),
        endTime: new Date('2025-10-16T14:42:00Z'),
        watchedSeconds: 720,
        amountCharged: 5.76,
        status: 'COMPLETED'
      }
    }),
    prisma.viewSession.create({
      data: {
        sessionToken: 'session-003-ghi789',
        viewerId: users[4].id,
        videoId: videos[2].id,
        startTime: new Date('2025-10-17T09:15:00Z'),
        watchedSeconds: 180,
        amountCharged: 0.90,
        status: 'ACTIVE'
      }
    })
  ])
  console.log(`✅ Created ${sessions.length} view sessions\n`)

  // Create sample creator earnings
  console.log('💰 Creating creator earnings...')
  const earnings = await Promise.all([
    prisma.creatorEarning.create({
      data: {
        creatorId: users[0].id, // CryptoEdu
        amount: 5.10,
        videoId: videos[0].id,
        sessionId: sessions[0].id,
        status: 'PAID',
        txHash: '0xabc123def456...',
        paidAt: new Date('2025-10-16T10:09:00Z')
      }
    }),
    prisma.creatorEarning.create({
      data: {
        creatorId: users[1].id, // Base Builder
        amount: 5.76,
        videoId: videos[1].id,
        sessionId: sessions[1].id,
        status: 'PAID',
        txHash: '0xdef456ghi789...',
        paidAt: new Date('2025-10-16T14:43:00Z')
      }
    }),
    prisma.creatorEarning.create({
      data: {
        creatorId: users[2].id, // Web3 Creator
        amount: 0.90,
        videoId: videos[2].id,
        sessionId: sessions[2].id,
        status: 'PENDING'
      }
    })
  ])
  console.log(`✅ Created ${earnings.length} creator earnings\n`)

  // Summary
  console.log('📊 Seeding Summary:')
  console.log(`   • ${users.length} users created`)
  console.log(`   • ${videos.length} videos created`)
  console.log(`   • ${sessions.length} view sessions created`)
  console.log(`   • ${earnings.length} earnings records created`)
  console.log('\n✨ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
