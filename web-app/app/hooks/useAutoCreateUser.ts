"use client";

import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export function useAutoCreateUser() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address && isConnected) {
      // Auto-create or update user when wallet connects
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      }).catch(err => console.error('Failed to create user:', err));
    }
  }, [address, isConnected]);
}
