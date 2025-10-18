"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance
} from '@coinbase/onchainkit/identity';
import { Search, Upload as UploadIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "./SidebarContext";

export default function Header() {
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 transition-all duration-300">
      <div className="px-6 py-4 flex items-center justify-between gap-4" >
        <Link href="/" className="flex items-center gap-1 hover:bg-white/5 px-2 py-1 rounded shrink-0">
          <Image src="/logo.png" alt="xStream Logo" width={42} height={42} />
          <span className="text-2xl font-medium bg-white bg-clip-text text-transparent transition-opacity duration-700 animate-pulse">
            xStream
          </span>
        </Link>

        <div className="flex-1 max-w-2xl hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search videos, creators, topics..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">

          <Wallet>
            <ConnectWallet>
              <Name className="text-xs font-light" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>
    </header>
  );
}
