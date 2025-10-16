# 🎥 xStream — Pay-Per-Second Video Monetization Platform

> **Revolutionary Web3 streaming platform enabling precise pay-per-second video monetization with x402 micropayments on the Base blockchain.**

xStream transforms video monetization by introducing real-time, usage-based payments. Viewers pay only for the exact seconds they watch, while creators receive instant compensation with unprecedented precision.

---

## 💡 The Problem We're Solving

The creator economy is broken. Traditional streaming platforms extract **30–55% of creator revenue**, while viewers are trapped in expensive subscriptions they barely use.

### Current Pain Points

- 🏦 **Platform Monopoly** – YouTube and Netflix take massive cuts from creators
- 💸 **Unfair Pricing** – Users pay $15/month but watch only 2 hours
- ⏰ **Delayed Payments** – Creators wait 30–90 days for earnings
- 📊 **Opaque Analytics** – Black-box algorithms control creator visibility
- 🎯 **Ad Fatigue** – 20% of viewing time is ads, degrading user experience

### The $100B+ Opportunity

- **Creator Economy:** $104B market growing 20% annually
- **Micropayments:** $2.3T untapped potential for granular digital payments
- **Web3 Adoption:** 420M+ crypto users seeking real-world utility

---

## 🚀 Our Solution

### 💰 **Pay-Per-Second Precision**

- Sub-second billing accuracy via **x402 micropayment protocol**
- Quality-tiered pricing: 4K ($0.015/sec), 1080p ($0.010/sec), 720p ($0.005/sec)
- Average 60% cost savings for viewers vs. subscriptions

### 🎯 **Creator-First Economics**

- **95% revenue share** (vs. YouTube’s 55%)
- **Instant crypto settlements** — no more 30-90 day delays
- **Transparent earnings** with real-time blockchain verification

### ⚡ **Frictionless Experience**

- **Stake-before-watch** system with automatic refunds for unused time
- **One-click ad skipping** via micropayments
- **NFT achievement rewards** for engagement milestones

### 🔗 **Web3-Native Infrastructure**

- Built on **Base (Coinbase L2)** for low-cost, high-speed transactions
- **OnchainKit** wallet integration for seamless onboarding
- **Smart-contract automation** ensures trustless distribution

---

## 🛠 Technology Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | Next.js, React, TypeScript |
| UI         | shadcn/ui, Tailwind CSS    |
| Blockchain | Base (Coinbase L2)         |
| Payments   | x402 Micropayment Protocol |
| Wallet     | OnchainKit (Coinbase)      |

---

## 📋 Smart Contract Architecture

### 🎬 **1. XStreamCore.sol** — Main Monetization Engine

**Purpose:** Central hub for pay-per-second streaming

- Pay-per-second billing with sub-second precision
- 95% creator revenue share, 5% platform fee
- Stake-before-watch mechanism with refunds
- Quality-based pricing (4K/1080p/720p)
- Emergency pause functionality

**Key Functions:**

```solidity
uploadVideo()
startViewSession()
endViewSession()
withdrawCreatorEarnings()
```

---

### 🏆 **2. XStreamNFT.sol** — Achievement & Rewards System

**Purpose:** Gamified engagement through collectible NFTs

- Watch-time and spending-based achievements
- Creator upload and revenue milestone rewards
- ERC-721 compliant with IPFS metadata

---

### 📺 **3. XStreamAds.sol** — Advertisement Monetization

**Purpose:** Ad revenue via pay-per-view campaigns

- Viewers earn tokens for watching ads
- Advertisers manage budgets and target demographics
- Performance analytics and ROI tracking

---

### 🏭 **4. XStreamFactory.sol** — Deployment Manager

**Purpose:** Deploy and manage the entire ecosystem in one transaction

- Interconnected deployment of all contracts
- Central registry for frontend integration
- Emergency controls for all contracts

---

### 🔗 **OpenZeppelin Dependencies**

- `ReentrancyGuard` — Prevents reentrancy attacks
- `Ownable` — Access control
- `Pausable` — Emergency stop
- `ERC721`, `ERC721URIStorage` — NFT standards
- `Counters`, `SafeMath`, `Strings`, `Address`, `Context`

---

### 🔧 Example Contract Flow

```solidity
1. Viewer stakes ETH → XStreamCore.depositStake()
2. Start watching → XStreamCore.startViewSession()
3. End session → XStreamCore.endViewSession()
4. Trigger NFT → XStreamNFT.checkAndMintAchievements()
5. Creator withdraws → XStreamCore.withdrawCreatorEarnings()
```

---

## 📊 Deployment Stats

- ✅ 19 total contracts compiled (4 custom + 15 OpenZeppelin)
- ✅ Gas optimized with Hardhat IR compilation
- ✅ Solidity 0.8.28 — Zero compilation errors
- ✅ Security-audited OpenZeppelin foundations
- ✅ Deployed on **Base Sepolia**

---

## 🚦 Getting Started

```bash
# Clone and setup
git clone <repository-url>
cd xstream/web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to explore xStream!

---

## 📱 Platform Pages

- `/` — Homepage & discovery
- `/watch/[id]` — Video player with pay-per-second billing
- `/upload` — Creator upload workflow
- `/dashboard` — Creator/viewer analytics
- `/trending` — Popular content
- `/advertise` — Ad campaign management

---

## 👥 Founding Team

| Name              | Role       |
| ----------------- | ---------- |
| Apoorva Agrawal   | Co-Founder |
| Abhishek Satpathy | Co-Founder |
| Fahim Ahmed       | Co-Founder |
| Chinmaya Sahu     | Co-Founder |
| Vedant Tarale     | Co-Founder |

---

## 💎 Why Now?

- **Perfect storm:** Creator-economy crisis + Web3 readiness
- **Regulatory clarity:** Base/Coinbase provide compliant infrastructure
- **Market timing:** 420M+ crypto users seeking real utility
- **Technical readiness:** x402 + Base L2 make micropayments viable

---

## 🏗️ Backend Infrastructure

### **Database Architecture**

xStream uses a comprehensive PostgreSQL database with Prisma ORM to handle all non-Web3 operations, minimizing blockchain calls for better performance.

#### **Core Models:**
- **Users** — Profiles supporting both email/password and Web3 wallet authentication
- **Videos** — Content metadata, pricing, analytics with multi-quality support
- **ViewSessions** — Pay-per-second billing with real-time tracking
- **Achievements** — NFT-backed milestone system with gamification
- **CreatorEarnings** — Revenue tracking and payout management
- **AdCampaigns** — Advertisement system with targeting and analytics
- **PlatformAnalytics** — Business intelligence and performance metrics

### **Authentication System**

#### **Hybrid Authentication Support**

```typescript
// Email/Password Registration
POST /api/auth/register
{
  "type": "email",
  "email": "user@example.com", 
  "password": "securePassword",
  "username": "myUsername"
}

// Web3 Wallet Authentication
POST /api/auth/register  
{
  "type": "wallet",
  "walletAddress": "0x742d35cc...",
  "signature": "0x...",
  "message": "Welcome to xStream!...",
  "nonce": "randomNonce123"
}
```

### **API Endpoints**

| Endpoint | Purpose |
|----------|---------|
| `/api/users` | User management and profiles |
| `/api/videos` | Video CRUD with filtering/pagination |
| `/api/sessions` | Pay-per-second viewing sessions |
| `/api/achievements` | NFT achievement system |
| `/api/analytics` | Platform analytics dashboard |
| `/api/auth/*` | Complete authentication flow |

### **Setup Instructions**

```bash
# Navigate to web app
cd web-app

# Install backend dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Configure your database URL in .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/xstream"

# Set authentication secrets
JWT_SECRET="your-secure-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# Initialize database
npm run db:push

# Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

### **Database Commands**

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database  
npm run db:migrate     # Run migrations (development)
npm run db:seed        # Seed database with sample data
npm run db:reset       # Reset database and reseed
npm run db:studio      # Open Prisma Studio
```

### **Sample Data Included**

The seed script creates:
- 10 achievements across different categories
- 3 sample users (creator, viewer, advertiser)  
- 3 sample videos with multiple quality options
- 2 viewing sessions with billing data
- 1 ad campaign with targeting
- User stakes and creator earnings
- Initial platform analytics

### **Environment Variables**

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/xstream"

# Authentication  
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# Web3 Configuration
NEXT_PUBLIC_CHAIN_ID="11155111"
NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/your-key"

# Contract Addresses (fill after deployment)
NEXT_PUBLIC_XSTREAM_CORE_ADDRESS=""
NEXT_PUBLIC_XSTREAM_NFT_ADDRESS=""
```

### **Key Features**

- **Hybrid Web2/Web3** — Database handles 95% of operations, blockchain only for payments/staking/minting
- **Real-time Analytics** — Comprehensive tracking of users, content, and revenue  
- **Achievement NFTs** — Gamification system with blockchain rewards
- **Scalable Architecture** — Built with enterprise patterns for production use
- **Security First** — JWT tokens, input validation, rate limiting

---

## ✨ Join the Revolution

**xStream** — Building the financial infrastructure for content creators worldwide.

_Deploy. Stream. Earn._ ⚡

📧 [founders@xstream.com](mailto:founders@xstream.com)
💬 [Join our Discord](https://discord.gg/xstream)
🐦 [Follow us on Twitter](https://twitter.com/xstream_tv)
