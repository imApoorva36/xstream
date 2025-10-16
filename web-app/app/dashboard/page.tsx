"use client";

import { useState } from "react";
import Header from "../components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Eye, 
  Clock, 
  TrendingUp, 
  Video, 
  Users, 
  Award,
  Download,
  Wallet,
  Zap,
  PlayCircle,
  Calendar,
  Star
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app this would come from API
  const userStats = {
    totalSpent: 23.45,
    totalWatchTime: 1234, // minutes
    videosWatched: 45,
    nftsEarned: 8,
    favoriteCreators: 12
  };

  const creatorStats = {
    totalEarned: 456.78,
    totalViews: 12500,
    totalVideos: 15,
    subscribers: 850,
    avgViewDuration: 4.2 // minutes
  };

  const recentVideos = [
    {
      id: "1",
      title: "Introduction to x402 Micropayments",
      views: 1250,
      earned: 25.60,
      duration: "10:30",
      uploadDate: "2 days ago"
    },
    {
      id: "2",
      title: "Building on Base Blockchain",
      views: 890,
      earned: 18.20,
      duration: "8:45",
      uploadDate: "1 week ago"
    }
  ];

  const recentActivity = [
    {
      type: "watch",
      description: "Watched 'NFT Rewards Guide'",
      amount: -0.45,
      time: "2 hours ago"
    },
    {
      type: "earn",
      description: "Earned from 'Crypto Tutorial'",
      amount: 2.30,
      time: "5 hours ago"
    },
    {
      type: "nft",
      description: "Earned 'Early Adopter' NFT",
      amount: 0,
      time: "1 day ago"
    }
  ];

  const nftMilestones = [
    { name: "First Video", description: "Watched your first video", earned: true, icon: "🎬" },
    { name: "10 Minutes", description: "Watched 10 minutes of content", earned: true, icon: "⏰" },
    { name: "Early Adopter", description: "Joined the platform early", earned: true, icon: "🚀" },
    { name: "Supporter", description: "Spent $10 on content", earned: false, icon: "💝" },
    { name: "Binge Watcher", description: "Watch 100 minutes", earned: false, icon: "📺" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-300">
            Track your xStream activity and earnings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "creator", label: "Creator Analytics", icon: Video },
              { id: "viewer", label: "Viewer Stats", icon: Eye },
              { id: "nfts", label: "NFT Collection", icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Earned
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${creatorStats.totalEarned}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${userStats.totalSpent}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Watch Time
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.floor(userStats.totalWatchTime / 60)}h {userStats.totalWatchTime % 60}m
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        NFTs Earned
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {userStats.nftsEarned}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === "earn" ? "bg-green-500" :
                          activity.type === "watch" ? "bg-blue-500" : "bg-yellow-500"
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        activity.amount > 0 ? "text-green-600" :
                        activity.amount < 0 ? "text-red-600" : "text-gray-600"
                      }`}>
                        {activity.amount !== 0 && (activity.amount > 0 ? "+" : "")}
                        {activity.amount !== 0 ? `$${Math.abs(activity.amount).toFixed(2)}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Creator Analytics Tab */}
        {activeTab === "creator" && (
          <div className="space-y-6">
            {/* Creator Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Views
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {creatorStats.totalViews.toLocaleString()}
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Subscribers
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {creatorStats.subscribers}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Videos Published
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {creatorStats.totalVideos}
                      </p>
                    </div>
                    <Video className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Watch Time
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {creatorStats.avgViewDuration}m
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Video Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Video Performance</CardTitle>
                <CardDescription>Your recent videos and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVideos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <PlayCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{video.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {video.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {video.duration}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {video.uploadDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          ${video.earned}
                        </p>
                        <p className="text-sm text-gray-500">earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Viewer Stats Tab */}
        {activeTab === "viewer" && (
          <div className="space-y-6">
            {/* Viewer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Videos Watched
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {userStats.videosWatched}
                      </p>
                    </div>
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Favorite Creators
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {userStats.favoriteCreators}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Cost/Min
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${(userStats.totalSpent / userStats.totalWatchTime).toFixed(3)}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spending Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Insights</CardTitle>
                <CardDescription>How you're using xStream</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                      Most Watched Quality
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      1080p (78% of watch time) - You prefer high quality content
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                      Savings vs Traditional
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      You've saved ~$15.67 compared to traditional subscriptions
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                      Peak Watching Time
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      7-9 PM weekdays - Perfect for evening learning sessions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* NFT Collection Tab */}
        {activeTab === "nfts" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NFT Collection</CardTitle>
                <CardDescription>Milestone NFTs earned through your xStream activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nftMilestones.map((nft, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        nft.earned
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {nft.earned ? nft.icon : "🔒"}
                        </div>
                        <h4 className={`font-medium mb-1 ${
                          nft.earned ? "text-gray-900 dark:text-white" : "text-gray-500"
                        }`}>
                          {nft.name}
                        </h4>
                        <p className={`text-xs ${
                          nft.earned ? "text-gray-600 dark:text-gray-400" : "text-gray-400"
                        }`}>
                          {nft.description}
                        </p>
                        {nft.earned && (
                          <Badge variant="secondary" className="mt-2">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* NFT Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>NFT Benefits</CardTitle>
                <CardDescription>Unlock rewards and perks with your NFT collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-300">
                        Early Access
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Get early access to new creator content
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Exclusive Discounts
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        10% off premium content (Requires 5 NFTs)
                      </p>
                    </div>
                    <Badge variant="outline">
                      Locked
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        Creator Chat Access
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Direct chat with your favorite creators (Requires 10 NFTs)
                      </p>
                    </div>
                    <Badge variant="outline">
                      Locked
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}