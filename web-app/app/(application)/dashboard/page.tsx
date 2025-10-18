"use client";

import { useState, useEffect } from "react";
import { Name } from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { address, isConnected } = useAccount();
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    totalWatchTime: 0,
    videosWatched: 0,
    nftsEarned: 0,
    favoriteCreators: 0
  });
  const [creatorStats, setCreatorStats] = useState({
    totalEarned: 0,
    totalViews: 0,
    totalVideos: 0,
    subscribers: 0,
    avgViewDuration: 0
  });

  // Fetch user stats when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      fetch(`/api/users/${address}/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.stats) {
            setUserStats({
              totalSpent: data.stats.totalSpent || 0,
              totalWatchTime: data.stats.totalWatchTime || 0,
              videosWatched: data.viewSessions?.length || 0,
              nftsEarned: 0,
              favoriteCreators: 0
            });
            setCreatorStats({
              totalEarned: data.stats.totalEarned || 0,
              totalViews: data.stats.totalViews || 0,
              totalVideos: data.stats.totalVideos || 0,
              subscribers: 0,
              avgViewDuration: 0
            });
          }
        })
        .catch(err => console.error('Failed to fetch stats:', err));
    }
  }, [address, isConnected]);

  // Note: These are placeholders - in a full implementation, fetch from API
  const recentVideos: any[] = [];
  const recentActivity: any[] = [];

  const nftMilestones = [
    { name: "First Video", description: "Watched your first video", earned: true, icon: "🎬" },
    { name: "10 Minutes", description: "Watched 10 minutes of content", earned: true, icon: "⏰" },
    { name: "Early Adopter", description: "Joined the platform early", earned: true, icon: "🚀" },
    { name: "Supporter", description: "Spent $10 on content", earned: false, icon: "💝" },
    { name: "Binge Watcher", description: "Watch 100 minutes", earned: false, icon: "📺" },
  ];

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-lg p-4">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col items-start gap-3 mb-4">
            <h1 className="text-4xl font-medium text-white">
              {isConnected && address ? (
                <> Welcome back, <Name address={address} className="text-slate-200" /> </>
              ) : (
                <>Dashboard</>
              )}
            </h1>
            <p className="text-gray-300 text-sm font-light">Track your xStream activity and earnings</p>
          </div>
        </div>

        {/* Tabs - matching Trending styling */}
        <Tabs defaultValue="overview" className="mb-8 text-sm font-light">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:border"
            >
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="creator"
              className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:border"
            >
              <Video className="w-4 h-4" />
              Creator Analytics
            </TabsTrigger>
            <TabsTrigger
              value="viewer"
              className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:border"
            >
              <Eye className="w-4 h-4" />
              Viewer Stats
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:border"
            >
              <Award className="w-4 h-4" />
              NFT Collection
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8">
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Total Earned</p>
                        <p className="text-2xl font-medium text-slate-200">${creatorStats.totalEarned}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Total Spent</p>
                        <p className="text-2xl font-medium text-slate-200">${userStats.totalSpent}</p>
                      </div>
                      <Wallet className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Watch Time</p>
                        <p className="text-2xl font-medium text-slate-200">
                          {Math.floor(userStats.totalWatchTime / 60)}h {userStats.totalWatchTime % 60}m
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">NFTs Earned</p>
                        <p className="text-2xl font-medium text-slate-200">{userStats.nftsEarned}</p>
                      </div>
                      <Award className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-slate-950 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Your latest transactions and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.type === "earn"
                                ? "bg-green-500"
                                : activity.type === "watch"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-light text-white">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            activity.amount > 0
                              ? "text-slate-200"
                              : activity.amount < 0
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {activity.amount !== 0 && (activity.amount > 0 ? "+" : "")}
                          {activity.amount !== 0 ? `$${Math.abs(activity.amount).toFixed(2)}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Creator Analytics Tab */}
          <TabsContent value="creator" className="mt-8">
            <div className="space-y-6">
              {/* Creator Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Total Views</p>
                        <p className="text-2xl font-medium text-slate-200">{creatorStats.totalViews.toLocaleString()}</p>
                      </div>
                      <Eye className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Subscribers</p>
                        <p className="text-2xl font-medium text-slate-200">{creatorStats.subscribers}</p>
                      </div>
                      <Users className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Videos Published</p>
                        <p className="text-2xl font-medium text-slate-200">{creatorStats.totalVideos}</p>
                      </div>
                      <Video className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Avg Watch Time</p>
                        <p className="text-2xl font-medium text-slate-200">{creatorStats.avgViewDuration}m</p>
                      </div>
                      <Clock className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video Performance */}
              <Card className="bg-slate-950 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Video Performance</CardTitle>
                  <CardDescription className="text-gray-400">Your recent videos and their performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 border border-white/10 rounded-md bg-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center">
                            <PlayCircle className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{video.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
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
                          <p className="text-lg font-semibold text-slate-200">${video.earned}</p>
                          <p className="text-sm text-gray-400">earned</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Viewer Stats Tab */}
          <TabsContent value="viewer" className="mt-8">
            <div className="space-y-6">
              {/* Viewer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Videos Watched</p>
                        <p className="text-2xl font-medium text-slate-200">{userStats.videosWatched}</p>
                      </div>
                      <Video className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Favorite Creators</p>
                        <p className="text-2xl font-medium text-slate-200">{userStats.favoriteCreators}</p>
                      </div>
                      <Star className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950 backdrop-blur border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-light text-gray-400">Avg Cost/Min</p>
                        <p className="text-2xl font-medium text-slate-200">
                          {userStats.totalWatchTime > 0
                            ? (userStats.totalSpent / userStats.totalWatchTime).toFixed(3)
                            : "0.000"}
                        </p>
                      </div>
                      <Zap className="h-8 w-8 text-slate-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Spending Breakdown */}
              <Card className="bg-slate-950 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Spending Insights</CardTitle>
                  <CardDescription className="text-gray-400">How you're using xStream</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-md border border-white/10">
                      <h4 className="font-medium text-white mb-2">Most Watched Quality</h4>
                      <p className="text-sm text-gray-400">1080p (78% of watch time) - You prefer high quality content</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-md border border-white/10">
                      <h4 className="font-medium text-white mb-2">Savings vs Traditional</h4>
                      <p className="text-sm text-gray-400">You've saved ~$15.67 compared to traditional subscriptions</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-md border border-white/10">
                      <h4 className="font-medium text-white mb-2">Peak Watching Time</h4>
                      <p className="text-sm text-gray-400">7-9 PM weekdays - Perfect for evening learning sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NFT Collection Tab */}
          <TabsContent value="nfts" className="mt-8">
            <div className="space-y-6">
              <Card className="bg-slate-950 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">NFT Collection</CardTitle>
                  <CardDescription className="text-gray-400">Milestone NFTs earned through your xStream activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nftMilestones.map((nft, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-md ${
                          nft.earned
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{nft.earned ? nft.icon : "🔒"}</div>
                          <h4 className="font-medium mb-1 text-white">{nft.name}</h4>
                          <p className="text-xs text-gray-400">{nft.description}</p>
                          {nft.earned && (
                            <Badge variant="secondary" className="mt-2">Earned</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* NFT Benefits */}
              <Card className="bg-slate-950 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">NFT Benefits</CardTitle>
                  <CardDescription className="text-gray-400">Unlock rewards and perks with your NFT collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10">
                      <div>
                        <h4 className="font-medium text-white">Early Access</h4>
                        <p className="text-sm text-gray-400">Get early access to new creator content</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10">
                      <div>
                        <h4 className="font-medium text-white">Exclusive Discounts</h4>
                        <p className="text-sm text-gray-400">10% off premium content (Requires 5 NFTs)</p>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-gray-300">Locked</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10">
                      <div>
                        <h4 className="font-medium text-white">Creator Chat Access</h4>
                        <p className="text-sm text-gray-400">Direct chat with your favorite creators (Requires 10 NFTs)</p>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-gray-300">Locked</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}