"use client";

import { useParams } from "next/navigation";
import Header from "../../components/Header";
import VideoPlayer from "../../components/VideoPlayer";
import VideoCard from "../../components/VideoCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  Download, 
  Flag, 
  Eye, 
  Calendar,
  DollarSign,
  Zap,
  Award,
  Users
} from "lucide-react";

// Mock data - in real app this would come from API
const mockVideo = {
  id: "1",
  title: "Introduction to x402 Micropayments",
  creator: "CryptoEdu",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=320&h=180&fit=crop&crop=center",
  duration: "10:30",
  views: 1250,
  likes: 89,
  dislikes: 3,
  uploadDate: "2 days ago",
  pricePerSecond: 0.01,
  maxQuality: "1080p",
  description: "Learn how x402 enables precise micropayments for content consumption. In this comprehensive tutorial, we'll explore the revolutionary technology behind pay-per-second streaming and how it's changing the landscape of digital content monetization.",
  tags: ["x402", "micropayments", "blockchain", "streaming"],
  subscribers: 12500,
  totalEarnings: 2456.78,
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
};

const mockSuggestedVideos = [
  {
    id: "2",
    title: "Building on Base: A Developer's Guide",
    creator: "BaseBuilder",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=320&h=180&fit=crop&crop=center",
    duration: "15:45",
    views: 3420,
    uploadDate: "1 week ago",
    pricePerSecond: 0.008,
    maxQuality: "4K",
    description: "Complete guide to developing dApps on the Base blockchain"
  },
  {
    id: "3",
    title: "NFT Rewards & Loyalty Programs",
    creator: "Web3Creator",
    thumbnail: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=320&h=180&fit=crop&crop=center",
    duration: "8:20",
    views: 890,
    uploadDate: "3 days ago",
    pricePerSecond: 0.005,
    maxQuality: "720p",
    description: "How NFT rewards can revolutionize content creator loyalty"
  },
  {
    id: "4",
    title: "Real-time Video Monetization",
    creator: "StreamTech",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=320&h=180&fit=crop&crop=center",
    duration: "12:15",
    views: 2100,
    uploadDate: "5 days ago",
    pricePerSecond: 0.012,
    maxQuality: "1080p",
    description: "The future of pay-per-second video streaming"
  },
];

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer video={mockVideo} />

            {/* Video Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Title and Stats */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {mockVideo.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{mockVideo.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{mockVideo.uploadDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${mockVideo.pricePerSecond}/sec</span>
                      </div>
                    </div>
                  </div>

                  {/* Creator Info and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={mockVideo.avatar} />
                        <AvatarFallback>{mockVideo.creator.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {mockVideo.creator}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {mockVideo.subscribers.toLocaleString()} subscribers
                        </p>
                      </div>
                      <Button variant="default" className="ml-4">
                        Subscribe
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full">
                        <Button variant="ghost" size="sm" className="rounded-l-full">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {mockVideo.likes}
                        </Button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                        <Button variant="ghost" size="sm" className="rounded-r-full">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          {mockVideo.dislikes}
                        </Button>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* xStream Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Pay per Second
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Only pay for what you watch
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          Direct to Creator
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ${mockVideo.totalEarnings.toFixed(2)} earned
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Earn NFT Rewards
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          Watch to unlock rewards
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {mockVideo.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {mockVideo.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Comments coming soon...</p>
                  <p className="text-sm">Connect your wallet to leave a comment</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Suggested Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Up Next
            </h3>
            
            <div className="space-y-4">
              {mockSuggestedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}