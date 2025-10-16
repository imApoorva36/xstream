"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { resolveL2Name, BASENAME_RESOLVER_ADDRESS } from "thirdweb/extensions/ens";
import { base } from "thirdweb/chains";
import { thirdwebClient } from "@/lib/thirdweb";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

/**
 * Custom hook to resolve and display basename (priority) or ENS name
 * Based on Khoj implementation - uses thirdweb for basename resolution
 * @param address - Ethereum address to resolve
 * @returns {object} - Display name and loading state
 */
export function useDisplayName(address?: `0x${string}`) {
  const [displayName, setDisplayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setDisplayName("");
      return;
    }

    const resolveName = async () => {
      setIsLoading(true);
      
      try {
        console.log("🔍 Resolving name for address:", address);
        
        // Try to resolve Basename on Base Mainnet first using thirdweb
        try {
          const basename = await resolveL2Name({
            client: thirdwebClient,
            address: address,
            resolverAddress: BASENAME_RESOLVER_ADDRESS,
            resolverChain: base,
          });

          if (basename) {
            console.log("✅ Basename found:", basename);
            setDisplayName(basename);
            setIsLoading(false);
            return;
          }
        } catch (baseError) {
          console.log("ℹ️ No basename found, trying ENS...", baseError);
        }

        // If no basename, try ENS on mainnet using viem
        try {
          const mainnetClient = createPublicClient({
            chain: mainnet,
            transport: http(),
          });

          const ensName = await mainnetClient.getEnsName({
            address: address,
          });

          if (ensName) {
            console.log("✅ ENS name found:", ensName);
            setDisplayName(ensName);
            setIsLoading(false);
            return;
          }
        } catch (ensError) {
          console.log("ℹ️ No ENS found");
        }

        // If neither exists, show shortened address
        console.log("ℹ️ No name found, using shortened address");
        setDisplayName(`${address.slice(0, 6)}...${address.slice(-4)}`);
      } catch (error) {
        console.error("❌ Error resolving name:", error);
        // Fallback to shortened address
        setDisplayName(`${address.slice(0, 6)}...${address.slice(-4)}`);
      } finally {
        setIsLoading(false);
      }
    };

    resolveName();
  }, [address]);

  return { displayName, isLoading };
}

/**
 * Hook to get display name for the currently connected wallet
 */
export function useConnectedDisplayName() {
  const { address } = useAccount();
  return useDisplayName(address);
}
