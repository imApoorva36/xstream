"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, Flame, Loader2 } from "lucide-react";
import { formatDuration, formatRelativeTime, formatCreatorName } from "@/lib/video-utils";

export default function TrendingPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingVideos() {
      try {
        const response = await fetch('/api/videos?sortBy=popular&limit=12');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error('Failed to fetch trending videos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrendingVideos();
  }, []);

  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-lg p-4">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col items-start gap-3 mb-4">
            <h1 className="text-4xl font-medium text-white">Trending Now</h1>
            <p className="text-gray-300 text-sm font-light">Most popular videos on xStream right now</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-white">Loading trending videos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const thumbnailUrl = video.thumbnailUrl || '';
  const viewCount = video.totalViews || 0;
  const durationDisplay = typeof video.duration === 'number' ? formatDuration(video.duration) : video.duration;
  const uploadDate = video.publishedAt ? formatRelativeTime(video.publishedAt) : '';
  const creatorName = formatCreatorName(video.creator);
  const priceDisplay = typeof video.pricePerSecond === 'string' 
    ? parseFloat(video.pricePerSecond).toFixed(4)
    : video.pricePerSecond.toFixed(4);

  return (
    <Link href={`/watch/${video.id}`}>
      <Card className="group bg-slate-950 backdrop-blur border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all overflow-hidden cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-[filter,transform] duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
            {durationDisplay}
          </div>
          <Badge className="absolute top-2 left-2 bg-blue-500/90 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {Math.round(viewCount / 50)}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-blue-400 transition">
            {video.title}
          </h3>
          <p className="text-gray-400 font-light text-xs mb-3">{creatorName}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
            <span>{uploadDate}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Price per second</span>
              <span className="text-blue-400 font-medium">${priceDisplay}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
