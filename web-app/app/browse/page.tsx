"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Header from "../components/Header";
import { 
  Play, 
  Home,
  TrendingUp, 
  Upload as UploadIcon,
  LayoutDashboard,
  Eye,
  Gamepad2,
  GraduationCap,
  Music,
  Newspaper,
  Trophy,
  Film
} from "lucide-react";

const mockVideos = [
  {
    id: "1",
    title: "Introduction to x402 Micropayments",
    creator: "CryptoEdu",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=640&h=360&fit=crop",
    duration: "10:30",
    views: 15250,
    uploadDate: "2 days ago",
    pricePerSecond: 0.01,
    category: "Education"
  },
  {
    id: "2",
    title: "Building on Base Developer Guide",
    creator: "BaseBuilder",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop",
    duration: "15:45",
    views: 23420,
    uploadDate: "1 day ago",
    pricePerSecond: 0.008,
    category: "Technology"
  },
  {
    id: "3",
    title: "NFT Rewards Loyalty Programs",
    creator: "Web3Creator",
    thumbnail: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=640&h=360&fit=crop",
    duration: "8:20",
    views: 8890,
    uploadDate: "3 days ago",
    pricePerSecond: 0.005,
    category: "Web3"
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
    category: "Business"
  },
  {
    id: "5",
    title: "Future of Content Creation",
    creator: "ContentKing",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=360&fit=crop",
    duration: "6:40",
    views: 12560,
    uploadDate: "1 day ago",
    pricePerSecond: 0.003,
    category: "Entertainment"
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
    category: "Education"
  },
  {
    id: "7",
    title: "Smart Contract Security",
    creator: "SecureWeb3",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&h=360&fit=crop",
    duration: "14:20",
    views: 9420,
    uploadDate: "4 days ago",
    pricePerSecond: 0.011,
    category: "Technology"
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
    category: "Web3"
  },
  {
    id: "9",
    title: "DeFi Protocols Explained",
    creator: "DeFiGuru",
    thumbnail: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=640&h=360&fit=crop",
    duration: "13:15",
    views: 14230,
    uploadDate: "1 day ago",
    pricePerSecond: 0.009,
    category: "Finance"
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
    category: "Gaming"
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
    category: "Finance"
  },
  {
    id: "12",
    title: "Music NFTs and Royalties",
    creator: "MusicDAO",
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop",
    duration: "9:50",
    views: 16320,
    uploadDate: "1 day ago",
    pricePerSecond: 0.008,
    category: "Music"
  }
];

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Header />

      <div className="flex">
        {/* Left Sidebar - YouTube style */}
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-black/10 backdrop-blur border-r border-white/10 p-4 sticky top-[73px] hidden md:block">
          <nav className="space-y-1">
            <Link href="/browse">
              <Button variant="ghost" className="w-full justify-start text-white bg-blue-500/20 hover:bg-blue-500/30">
                <Home className="w-5 h-5 mr-3" />
                Home
              </Button>
            </Link>
            
            <Link href="/trending">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                <TrendingUp className="w-5 h-5 mr-3" />
                Trending
              </Button>
            </Link>
            
            <Link href="/upload">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                <UploadIcon className="w-5 h-5 mr-3" />
                Upload
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Button>
            </Link>
          </nav>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-gray-400 text-xs font-semibold mb-3 uppercase px-3">Categories</h3>
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                <GraduationCap className="w-4 h-4 mr-3" />
                Education
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                <Gamepad2 className="w-4 h-4 mr-3" />
                Gaming
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                <Music className="w-4 h-4 mr-3" />
                Music
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                <Newspaper className="w-4 h-4 mr-3" />
                News
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                <Trophy className="w-4 h-4 mr-3" />
                Sports
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                <Film className="w-4 h-4 mr-3" />
                Entertainment
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Browse Videos</h1>
            <p className="text-gray-300">Discover amazing content and pay per second</p>
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

function VideoCard({ video }: { video: typeof mockVideos[0] }) {
  return (
    <Link href={`/watch/${video.id}`}>
      <Card className="group bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all overflow-hidden cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-semibold">{video.duration}</div>
          <Badge className="absolute top-2 left-2 bg-blue-500/90 text-xs">{video.category}</Badge>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold mb-1 line-clamp-2 group-hover:text-blue-400 transition text-sm">{video.title}</h3>
          <p className="text-gray-400 text-xs mb-2">{video.creator}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{video.views.toLocaleString()} views</span>
            </div>
            <span>{video.uploadDate}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Per second</span>
              <span className="text-blue-400 font-semibold">${video.pricePerSecond}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
