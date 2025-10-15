"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { Search, Upload, Bell, User, Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">xStream</div>
            <Badge variant="secondary" className="text-xs">BETA</Badge>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <div className="flex w-full">
            <Input
              type="text"
              placeholder="Search videos, creators, or topics..."
              className="rounded-r-none border-r-0"
            />
            <Button 
              variant="outline" 
              className="rounded-l-none border-l-0 px-6"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right side - Actions and Wallet */}
        <div className="flex items-center space-x-3">
          {/* Upload Button */}
          <Link href="/upload">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </Link>

          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Wallet Connection */}
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-8 w-8" />
                <Name className="hidden sm:block ml-2" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="/dashboard"
                >
                  Dashboard
                </WalletDropdownLink>
                <WalletDropdownLink
                  icon="user"
                  href="/profile"
                >
                  Profile
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-3">
        <div className="flex w-full">
          <Input
            type="text"
            placeholder="Search videos..."
            className="rounded-r-none border-r-0"
          />
          <Button 
            variant="outline" 
            className="rounded-l-none border-l-0 px-6"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
