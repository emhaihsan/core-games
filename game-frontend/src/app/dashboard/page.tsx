'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Dashboard() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const games = [
    {
      id: 'snake',
      name: 'Snake',
      description: 'Classic Snake Game. Eat food, grow longer, avoid walls and yourself!',
      image: '/snake.svg',
      path: '/games/snake'
    },
    // More games will be added here in the future
  ];

  if (!isConnected) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <header className="w-full py-4 px-6 flex justify-between items-center bg-[#1a1a1a] border-b border-[#ff6b00]/30">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="text-[#ff6b00]">Classic</span>GameHub
          </Link>
        </div>
        <div className="p-1 rounded-lg bg-gradient-to-r from-[#ff6b00] to-[#ffa500]">
          <div className="bg-[#1a1a1a] rounded-md p-0.5">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#ff6b00]">Game</span> Dashboard
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#ff6b00] to-[#ffa500] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Link 
              key={game.id}
              href={game.path}
              className="web3-card group p-6 hover:border-[#ff6b00]"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 mr-4 flex items-center justify-center bg-[#ff6b00]/10 rounded-lg group-hover:bg-[#ff6b00]/20 transition-colors">
                  <Image 
                    src={game.image} 
                    alt={game.name} 
                    width={40} 
                    height={40}
                    className="text-[#ff6b00]"
                  />
                </div>
                <h2 className="text-xl font-bold text-white">{game.name}</h2>
              </div>
              <p className="text-gray-400 mb-4">{game.description}</p>
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-[#ff6b00] text-white hover:bg-[#e05800] transition-colors">
                  Play Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 border-t border-[#ff6b00]/20">
        <p>  {new Date().getFullYear()} Classic Game Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
