'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to dashboard if wallet is connected, but only from the homepage
  useEffect(() => {
    if (isConnected && pathname === '/') {
      router.push('/dashboard');
    }
  }, [isConnected, router, pathname]);

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-[#1a1a1a] border-b border-[#ff6b00]/30">
      <Link href="/" className="text-2xl font-bold text-white">
        <span className="text-[#ff6b00]">Classic</span>GameHub
      </Link>
      <div className="p-1 rounded-lg bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">
        <div className="bg-[#1a1a1a] rounded-md p-0.5">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
