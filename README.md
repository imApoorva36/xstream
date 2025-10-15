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

## ✨ Join the Revolution

**xStream** — Building the financial infrastructure for content creators worldwide.

_Deploy. Stream. Earn._ ⚡

📧 [founders@xstream.com](mailto:founders@xstream.com)
💬 [Join our Discord](https://discord.gg/xstream)
🐦 [Follow us on Twitter](https://twitter.com/xstream_tv)
