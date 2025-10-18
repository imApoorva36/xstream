"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Name } from "@coinbase/onchainkit/identity";
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
  Users,
  Loader2
} from "lucide-react";
import VideoPlayer from "@/app/components/VideoPlayer";
import VideoCard from "@/app/components/VideoCard";

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id;
  const [video, setVideo] = useState<any>(null);
  const [suggestedVideos, setSuggestedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch video data
  useEffect(() => {
    async function fetchVideo() {
      if (!videoId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/videos/${videoId}`);
        
        if (!response.ok) {
          throw new Error('Video not found');
        }
        
        const data = await response.json();
        setVideo(data.video);
        
        // Fetch suggested videos
        const suggestedResponse = await fetch('/api/videos?limit=3');
        if (suggestedResponse.ok) {
          const suggestedData = await suggestedResponse.json();
          setSuggestedVideos(suggestedData.videos || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black/20 backdrop-blur-lg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black/20 backdrop-blur-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">{error || 'Video not found'}</p>
          <Button onClick={() => window.location.href = '/browse'}>
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-lg p-4">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer video={video} />

            {/* Video Info */}
            <Card className="bg-slate-950 backdrop-blur border-white/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Title and Stats */}
                  <div>
                    <h1 className="text-2xl font-medium text-white mb-2">
                      {video.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{video.totalViews?.toLocaleString() || 0} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${parseFloat(video.pricePerSecond).toFixed(3)}/sec</span>
                      </div>
                    </div>
                  </div>

                  {/* Creator Info and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={video.creator?.profileImage || undefined} />
                        <AvatarFallback>
                          {video.creator?.displayName?.slice(0, 2).toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">
                          <Name address={video.creator?.walletAddress as `0x${string}`} />
                        </h3>
                        <p className="text-sm text-gray-400">
                          {video.creator?.walletAddress?.slice(0, 6)}...{video.creator?.walletAddress?.slice(-4)}
                        </p>
                      </div>
                      <Button variant="default" className="ml-4">
                        Subscribe
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-white/5 rounded-full">
                        <Button variant="ghost" size="sm" className="rounded-l-full">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          0
                        </Button>
                        <div className="w-px h-6 bg-gray-600" />
                        <Button variant="ghost" size="sm" className="rounded-r-full">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          0
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/20 text-gray-200">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/20 text-gray-200">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* xStream Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-md border border-white/10">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Pay per Second</p>
                        <p className="text-xs text-blue-400">Only pay for what you watch</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Direct to Creator</p>
                        <p className="text-xs text-green-400">${parseFloat(video.totalEarnings || '0').toFixed(2)} earned</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Earn NFT Rewards</p>
                        <p className="text-xs text-purple-400">Watch to unlock rewards</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Description</h4>
                    <p className="text-gray-400 leading-relaxed">
                      {video.description || 'No description available'}
                    </p>
                    {/* Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {video.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-slate-950 backdrop-blur border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
                <div className="text-center py-8 text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Comments coming soon...</p>
                  <p className="text-sm">Connect your wallet to leave a comment</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Suggested Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Up Next
            </h3>
            <div className="space-y-4">
              {suggestedVideos.map((video: any) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}