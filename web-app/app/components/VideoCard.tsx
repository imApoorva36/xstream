"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Clock, Eye, DollarSign, Zap, Star } from "lucide-react";
import Link from "next/link";
import { formatDuration, formatRelativeTime, formatCreatorName } from "@/lib/video-utils";

interface Video {
  id: string;
  title: string;
  creator?: any;
  thumbnailUrl?: string;
  thumbnail?: string;
  duration: number | string;
  totalViews?: number;
  views?: number;
  publishedAt?: string | Date;
  uploadDate?: string;
  pricePerSecond: number | string;
  maxQuality?: string;
  description?: string;
  category?: string;
}

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const calculateTotalPrice = (pricePerSecond: number | string, duration: number | string) => {
    const price = typeof pricePerSecond === 'string' ? parseFloat(pricePerSecond) : pricePerSecond;
    
    let totalSeconds: number;
    if (typeof duration === 'number') {
      totalSeconds = duration;
    } else {
      const parts = duration.split(':');
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      totalSeconds = minutes * 60 + seconds;
    }
    
    return (price * totalSeconds).toFixed(2);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '4K':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case '1080p':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '720p':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const thumbnailUrl = video.thumbnailUrl || video.thumbnail || '';
  const viewCount = video.totalViews ?? video.views ?? 0;
  const uploadDate = video.publishedAt 
    ? formatRelativeTime(video.publishedAt)
    : video.uploadDate || '';
  const durationDisplay = typeof video.duration === 'number' 
    ? formatDuration(video.duration)
    : video.duration;
  const creatorName = formatCreatorName(video.creator);
  const creatorInitials = typeof video.creator === 'string'
    ? video.creator.slice(0, 2).toUpperCase()
    : (video.creator?.displayName?.slice(0, 2).toUpperCase() || '??');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      <div className="relative">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xNDUgNzBjMCA1LjUyMyA0LjQ3NyAxMCAxMCAxMHMxMC00LjQ3NyAxMC0xMC00LjQ3Ny0xMC0xMC0xMC0xMCA0LjQ3Ny0xMCAxMHoiIGZpbGw9IiM5Y2EzYWYiLz4KPHN2ZyBjbGFzcz0idzYgaDYgdGV4dC1ncmF5LTQwMCIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMjAgMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTQgM2ExIDEgMCAwMC0xIDF2MTJhMSAxIDAgMDAxIDFoMTJhMSAxIDAgMDAxLTFWNGExIDEgMCAwMC0xLTFINHptNSA4YTMgMyAwIDAwMy0zVjZhNSA1IDAgMTAtNSA1eiIgY2xpcC1ydWxlPSJldmVub2RkIj48L3BhdGg+Cjwvc3ZnPgo8L3N2Zz4=";
            }}
          />
          
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {durationDisplay}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50">
            <Button size="lg" className="rounded-full">
              <Play className="h-6 w-6 ml-1" />
            </Button>
          </div>
        </div>

        {video.maxQuality && (
          <Badge className={`absolute top-2 left-2 ${getQualityColor(video.maxQuality)}`}>
            {video.maxQuality}
          </Badge>
        )}

        <Badge variant="secondary" className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <DollarSign className="h-3 w-3 mr-1" />
          ${calculateTotalPrice(video.pricePerSecond, video.duration)}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={typeof video.creator === 'object' ? video.creator?.profileImage : undefined} />
              <AvatarFallback>{creatorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {creatorName}
              </p>
            </div>
          </div>

          <Link href={`/watch/${video.id}`}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
              {video.title}
            </h3>
          </Link>

          {video.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {video.description}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
              <span>{uploadDate}</span>
            </div>
          </div>

          {/* Pricing info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">
                ${video.pricePerSecond}/sec
              </span>
            </div>
            
            <Link href={`/watch/${video.id}`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Watch
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
