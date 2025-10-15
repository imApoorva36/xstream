"use client";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Zap, Clock } from "lucide-react";

// Mock trending data
const trendingVideos = {
  now: [
    {
      id: "t1",
      title: "BREAKING: New x402 Features Released!",
      creator: "TechNews",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=320&h=180&fit=crop&crop=center",
      duration: "5:45",
      views: 15420,
      uploadDate: "2 hours ago",
      pricePerSecond: 0.015,
      maxQuality: "4K",
      description: "Latest x402 updates that will change micropayments forever",
      trending: true
    },
    {
      id: "t2",
      title: "Building Your First DApp on Base",
      creator: "BaseDev",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=180&fit=crop&crop=center",
      duration: "18:30",
      views: 8930,
      uploadDate: "4 hours ago",
      pricePerSecond: 0.012,
      maxQuality: "1080p",
      description: "Complete tutorial for Base blockchain development"
    },
    {
      id: "t3",
      title: "Why Pay-Per-Second Will Kill Subscriptions",
      creator: "FutureStreaming",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&h=180&fit=crop&crop=center",
      duration: "12:15",
      views: 12350,
      uploadDate: "6 hours ago",
      pricePerSecond: 0.008,
      maxQuality: "1080p",
      description: "Analysis of the streaming industry's biggest disruption"
    }
  ],
  week: [
    {
      id: "w1",
      title: "Creator Earnings: $50K in First Month",
      creator: "SuccessStory",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=320&h=180&fit=crop&crop=center",
      duration: "14:20",
      views: 45600,
      uploadDate: "3 days ago",
      pricePerSecond: 0.010,
      maxQuality: "4K",
      description: "How one creator earned $50,000 in their first month on xStream"
    },
    {
      id: "w2",
      title: "NFT Rewards System Deep Dive",
      creator: "Web3Academy",
      thumbnail: "https://images.unsplash.com/photo-1616077167555-51f6bc516dfa?w=320&h=180&fit=crop&crop=center",
      duration: "22:10",
      views: 38920,
      uploadDate: "5 days ago",
      pricePerSecond: 0.009,
      maxQuality: "1080p",
      description: "Understanding xStream's revolutionary NFT reward system"
    }
  ],
  crypto: [
    {
      id: "c1",
      title: "Smart Contracts for Content Creators",
      creator: "CryptoEdu",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=320&h=180&fit=crop&crop=center",
      duration: "16:45",
      views: 22100,
      uploadDate: "1 day ago",
      pricePerSecond: 0.011,
      maxQuality: "1080p",
      description: "How smart contracts ensure fair creator compensation"
    },
    {
      id: "c2",
      title: "Base vs Other L2s: Complete Comparison",
      creator: "BlockchainAnalyst",
      thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=320&h=180&fit=crop&crop=center",
      duration: "25:30",
      views: 31400,
      uploadDate: "2 days ago",
      pricePerSecond: 0.013,
      maxQuality: "4K",
      description: "Comprehensive analysis of Layer 2 blockchain solutions"
    }
  ]
};

const trendingStats = [
  {
    title: "Total Views Today",
    value: "2.4M",
    change: "+15.3%",
    icon: TrendingUp,
    color: "text-blue-600"
  },
  {
    title: "Creator Earnings",
    value: "$125K",
    change: "+22.1%",
    icon: Zap,
    color: "text-green-600"
  },
  {
    title: "Active Viewers",
    value: "45.2K",
    change: "+8.7%",
    icon: Flame,
    color: "text-red-600"
  },
  {
    title: "Avg Watch Time",
    value: "8.4 min",
    change: "+12.5%",
    icon: Clock,
    color: "text-purple-600"
  }
];

export default function TrendingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Trending on xStream
              </h1>
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                <Flame className="h-3 w-3 mr-1" />
                Hot
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the most popular content and rising creators
            </p>
          </div>

          {/* Trending Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {trendingStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className={`text-sm ${stat.color} font-medium`}>
                        {stat.change} from yesterday
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trending Categories */}
          <Tabs defaultValue="now" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="now" className="flex items-center space-x-2">
                <Flame className="h-4 w-4" />
                <span>Trending Now</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>This Week</span>
              </TabsTrigger>
              <TabsTrigger value="crypto" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Crypto</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="now" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-red-500" />
                    <span>Trending Right Now</span>
                  </CardTitle>
                  <CardDescription>
                    The hottest content gaining views this hour
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trendingVideos.now.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="week" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span>Top This Week</span>
                  </CardTitle>
                  <CardDescription>
                    Most popular videos from the past 7 days
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trendingVideos.week.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Crypto & Web3</span>
                  </CardTitle>
                  <CardDescription>
                    Trending blockchain and cryptocurrency content
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trendingVideos.crypto.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Platform Highlights */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              xStream Highlights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Pay Per Second
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Only pay for what you actually watch - no more subscription waste
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Creator First
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        100% of payments go directly to creators - no middleman cuts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}