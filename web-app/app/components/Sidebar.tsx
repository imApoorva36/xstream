"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  TrendingUp, 
  Clock, 
  ThumbsUp, 
  Heart, 
  History, 
  PlaySquare,
  Upload,
  Settings,
  HelpCircle,
  DollarSign,
  Zap,
  Award
} from "lucide-react";
import Link from "next/link";

const navigationItems = [
  { icon: Home, label: "Home", href: "/", active: true },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: PlaySquare, label: "Subscriptions", href: "/subscriptions" },
];

const libraryItems = [
  { icon: History, label: "History", href: "/history" },
  { icon: Clock, label: "Watch Later", href: "/watch-later" },
  { icon: ThumbsUp, label: "Liked Videos", href: "/liked" },
  { icon: Heart, label: "Favorites", href: "/favorites" },
];

const creatorItems = [
  { icon: Upload, label: "Upload Video", href: "/upload" },
  { icon: DollarSign, label: "Analytics", href: "/analytics" },
  { icon: Award, label: "My NFTs", href: "/nfts" },
];

const settingsItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
      <div className="p-4 space-y-6">
        
        {/* Main Navigation */}
        <div>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Library Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-3">
            Library
          </h3>
          <nav className="space-y-1">
            {libraryItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Creator Tools */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-3">
            Creator Tools
          </h3>
          <nav className="space-y-1">
            {creatorItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* xStream Features */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-3">
            xStream Features
          </h3>
          <div className="space-y-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Pay per Second
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Only pay for what you watch
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Direct to Creator
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                100% goes to creators
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Settings */}
        <div>
          <nav className="space-y-1">
            {settingsItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 xStream</p>
          <p>Powered by x402 & Base</p>
        </div>
      </div>
    </aside>
  );
}
