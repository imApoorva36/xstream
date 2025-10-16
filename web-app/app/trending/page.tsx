"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import Header from "../components/Header";
import { TrendingUp, Eye, Flame, Clock, Star } from "lucide-react";

const trendingVideos = [
  {
    id: "2",
    title: "Building on Base Developer Guide",
    creator: "BaseBuilder",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop",
    duration: "15:45",
    views: 23420,
    uploadDate: "1 day ago",
    pricePerSecond: 0.008,
    trending: true,
    trendScore: 95,
  },
  {
    id: "6",
    title: "Blockchain Explained Simply",
    creator: "EduChain",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=640&h=360&fit=crop",
    duration: "9:30",
    views: 31800,
    uploadDate: "2 days ago",
    pricePerSecond: 0.007,
    trending: true,
    trendScore: 92,
  },
  {
    id: "4",
    title: "Real-time Video Monetization",
    creator: "StreamTech",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=640&h=360&fit=crop",
    duration: "12:15",
    views: 19100,
    uploadDate: "5 hours ago",
    pricePerSecond: 0.012,
    trending: true,
    trendScore: 88,
  },
  {
    id: "11",
    title: "Crypto Trading Strategies",
    creator: "TradeWizard",
    thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=640&h=360&fit=crop",
    duration: "11:25",
    views: 22140,
    uploadDate: "3 days ago",
    pricePerSecond: 0.011,
    trending: true,
    trendScore: 85,
  },
  {
    id: "10",
    title: "Web3 Gaming Revolution",
    creator: "GameChain",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop",
    duration: "16:40",
    views: 18950,
    uploadDate: "2 days ago",
    pricePerSecond: 0.010,
    trending: true,
    trendScore: 82,
  },
  {
    id: "8",
    title: "Creating NFT Collection",
    creator: "NFTMaster",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop",
    duration: "11:45",
    views: 16730,
    uploadDate: "3 days ago",
    pricePerSecond: 0.009,
    trending: true,
    trendScore: 79,
  },
];

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Trending Now</h1>
              <p className="text-gray-300">Most popular videos on xStream right now</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="hot" className="mb-8">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="hot">
              <Flame className="w-4 h-4 mr-2" />
              Hot
            </TabsTrigger>
            <TabsTrigger value="new">
              <Clock className="w-4 h-4 mr-2" />
              New & Rising
            </TabsTrigger>
            <TabsTrigger value="top">
              <Star className="w-4 h-4 mr-2" />
              Top Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hot" className="mt-8">
            <VideoGrid videos={trendingVideos} />
          </TabsContent>
          <TabsContent value="new" className="mt-8">
            <VideoGrid videos={trendingVideos.filter((_, i) => i < 3)} />
          </TabsContent>
          <TabsContent value="top" className="mt-8">
            <VideoGrid videos={trendingVideos.filter((v) => v.trendScore > 85)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function VideoGrid({ videos }: { videos: typeof trendingVideos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoCard({ video }: { video: typeof trendingVideos[0] }) {
  return (
    <Link href={`/watch/${video.id}`}>
      <Card className="group bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all overflow-hidden cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">{video.duration}</div>
          <Badge className="absolute top-2 left-2 bg-blue-500/90 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {video.trendScore}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition">{video.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{video.creator}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{video.views.toLocaleString()} views</span>
            </div>
            <span>{video.uploadDate}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Price per second</span>
              <span className="text-blue-400 font-semibold">${video.pricePerSecond}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
