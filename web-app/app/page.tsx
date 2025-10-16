"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Play, 
  Zap, 
  TrendingUp, 
  Shield, 
  Award, 
  Coins,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Wallet,
  Upload,
  Users
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              xStream
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="text-gray-300 hover:text-white transition">
              Browse
            </Link>
            <Link href="/trending" className="text-gray-300 hover:text-white transition">
              Trending
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition">
              Upload
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/browse">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Explore
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                <Wallet className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Pay-Per-Second Streaming
            </Badge>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Stream Content.
              </span>
              <br />
              <span className="text-white">
                Pay Per Second.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary Web3 platform where viewers pay only for what they watch, 
              and creators keep <span className="text-blue-400 font-semibold">95%</span> of earnings.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/browse">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg px-8 py-6 h-auto">
                  <Play className="w-5 h-5 mr-2" fill="white" />
                  Start Watching
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="lg" variant="outline" className="border-blue-500/50 text-white hover:bg-blue-500/10 text-lg px-8 py-6 h-auto">
                  <Upload className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
              {[
                { label: "Creator Share", value: "95%", icon: TrendingUp },
                { label: "Avg Savings", value: "60%", icon: Coins },
                { label: "Instant Payouts", value: "Real-time", icon: Zap },
                { label: "Platform Fee", value: "5%", icon: Shield }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose xStream?
            </h2>
            <p className="text-xl text-gray-300">
              Built for creators. Designed for viewers. Powered by Web3.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Pay Per Second",
                description: "Only pay for the exact seconds you watch. No monthly subscriptions, no wasted money."
              },
              {
                icon: TrendingUp,
                title: "95% Creator Revenue",
                description: "Creators keep 95% of earnings vs. YouTube's 55%. Fair compensation for your content."
              },
              {
                icon: Shield,
                title: "Blockchain Secured",
                description: "Built on Base L2 with transparent, trustless payments. Your funds are always safe."
              },
              {
                icon: Award,
                title: "NFT Achievements",
                description: "Earn collectible NFT rewards for watching, creating, and supporting the platform."
              },
              {
                icon: Coins,
                title: "Instant Settlements",
                description: "No more 30-90 day delays. Creators receive payments in real-time via crypto."
              },
              {
                icon: Users,
                title: "Creator First",
                description: "Transparent analytics, direct payouts, and full control over your content pricing."
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 transition group">
                <feature.icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Simple, transparent, and revolutionary
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Connect your Web3 wallet and deposit stake to start watching instantly."
              },
              {
                step: "02",
                title: "Watch & Pay",
                description: "Browse content and pay per second. Pause anytime and get refunded unused stake."
              },
              {
                step: "03",
                title: "Earn Rewards",
                description: "Collect NFT achievements and support creators directly with 95% revenue share."
              }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 bg-clip-text text-transparent mb-4">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur border-blue-500/30 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Video Monetization?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators and viewers building the future of content streaming.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/browse">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg px-8 py-6 h-auto">
                  <Play className="w-5 h-5 mr-2" fill="white" />
                  Explore Videos
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="lg" variant="outline" className="border-blue-500/50 text-white hover:bg-blue-500/10 text-lg px-8 py-6 h-auto">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Content
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="text-xl font-bold text-white">xStream</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionary Web3 streaming platform enabling precise pay-per-second video monetization.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <div className="space-y-2">
                <Link href="/browse" className="block text-gray-400 hover:text-white transition">Browse</Link>
                <Link href="/trending" className="block text-gray-400 hover:text-white transition">Trending</Link>
                <Link href="/upload" className="block text-gray-400 hover:text-white transition">Upload</Link>
                <Link href="/dashboard" className="block text-gray-400 hover:text-white transition">Dashboard</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition">API</a>
                <a href="#" className="block text-gray-400 hover:text-white transition">Support</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition">Twitter</a>
                <a href="#" className="block text-gray-400 hover:text-white transition">Discord</a>
                <a href="#" className="block text-gray-400 hover:text-white transition">GitHub</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            © 2025 xStream. Built on Base. Powered by Web3.
          </div>
        </div>
      </footer>
    </div>
  );
}
