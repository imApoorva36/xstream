"use client";

import { 
  Home, 
  TrendingUp, 
  Clock, 
  ThumbsUp, 
  Heart, 
  History, 
  PlaySquare,
  Upload,
  ChevronLeft,
  ChevronRight,
  DollarSignIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { icon: Home, label: "Home", href: "/browse" },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: PlaySquare, label: "Dashboard", href: "/dashboard" },
];

const libraryItems = [
  { icon: History, label: "History", href: "/history" },
  { icon: Clock, label: "Watch Later", href: "/watch-later" },
  { icon: ThumbsUp, label: "Liked Videos", href: "/liked" },
  { icon: Heart, label: "Favorites", href: "/favorites" },
];

const creatorItems = [
  { icon: Upload, label: "Upload Video", href: "/upload" },
  { icon: DollarSignIcon, label: "Advertise", href: "/advertise" }
];

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} fixed left-0 top-[73px] bottom-0 bg-black/20 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 hidden md:block transition-all duration-300 z-40`}>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </Button>

      <div className="p-4 space-y-6 overflow-y-auto h-full mt-2">
        
        {/* Main Navigation */}
        <div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} text-gray-300 hover:text-white hover:bg-white/10 ${isActive ? 'bg-white/20 text-white' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Library Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-3">
              Library
            </h3>
          )}
          <nav className="space-y-1">
            {libraryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} text-gray-300 hover:text-white hover:bg-white/10 ${isActive ? 'bg-white/20 text-white' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Creator Tools */}
        <div>
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-3">
              Creator Tools
            </h3>
          )}
          <nav className="space-y-1">
            {creatorItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} text-gray-300 hover:text-white hover:bg-white/10 ${isActive ? 'bg-white/20 text-white' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
            <p>© 2025 xStream</p>
            <p>Powered by x402 & Base</p>
          </div>
        )}
      </div>
    </div>
  );
}
