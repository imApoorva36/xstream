"use client";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import VideoCard from "./components/VideoCard";

// Mock data for videos
const mockVideos = [
  {
    id: "1",
    title: "Introduction to x402 Micropayments",
    creator: "CryptoEdu",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=320&h=180&fit=crop&crop=center",
    duration: "10:30",
    views: 1250,
    uploadDate: "2 days ago",
    pricePerSecond: 0.01,
    maxQuality: "1080p",
    description: "Learn how x402 enables precise micropayments for content consumption"
  },
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
  {
    id: "5",
    title: "Ad-Free Viewing with Crypto",
    creator: "AdBlocker",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=320&h=180&fit=crop&crop=center",
    duration: "6:40",
    views: 560,
    uploadDate: "1 day ago",
    pricePerSecond: 0.003,
    maxQuality: "720p",
    description: "Skip ads instantly with x402 micropayments"
  },
  {
    id: "6",
    title: "Creator Revenue Transparency",
    creator: "FairPay",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=320&h=180&fit=crop&crop=center",
    duration: "9:30",
    views: 1800,
    uploadDate: "4 days ago",
    pricePerSecond: 0.007,
    maxQuality: "1080p",
    description: "How blockchain ensures fair creator compensation"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Trending on xStream
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pay per second. Pay per quality. Support creators directly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
