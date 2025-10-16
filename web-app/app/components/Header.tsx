"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useDisplayName } from "../hooks/useDisplayName";
import { Search, Upload as UploadIcon, Play, TrendingUp, Home, LayoutDashboard, Target } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { address } = useAccount();
  
  // Use our custom hook that resolves basename first, then ENS
  const { displayName: resolvedName } = useDisplayName(address);

  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
            <Play className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            xStream
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 ml-8">
          <Link href="/browse">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-blue-400">
              <Home className="w-4 h-4 mr-2" />
              Browse
            </Button>
          </Link>
          <Link href="/trending">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-blue-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-blue-400">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          <Link href="/advertise">
            <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-cyan-500/30">
              <Target className="w-4 h-4 mr-2" />
              Advertise
            </Button>
          </Link>
        </nav>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search videos, creators, topics..." 
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Link href="/upload">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <UploadIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </Link>
          
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button onClick={openChainModal} variant="destructive">
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={openChainModal}
                          variant="ghost"
                          className="text-white hover:bg-white/10 hidden sm:flex"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 16,
                                height: 16,
                                borderRadius: 999,
                                overflow: 'hidden',
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 16, height: 16 }}
                                />
                              )}
                            </div>
                          )}
                        </Button>

                        <Button
                          onClick={openAccountModal}
                          className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
                        >
                          <span className="hidden sm:inline mr-2">
                            {resolvedName || account.displayName}
                          </span>
                          <span className="sm:hidden">
                            {resolvedName || `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                          </span>
                          {account.displayBalance && (
                            <span className="hidden lg:inline ml-2 text-blue-400">
                              {account.displayBalance}
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
