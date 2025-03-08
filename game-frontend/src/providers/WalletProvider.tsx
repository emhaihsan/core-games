"use client";

import { ReactNode } from "react";
import {
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { http } from "viem";
import { mainnet, sepolia } from "wagmi/chains";

import "@rainbow-me/rainbowkit/styles.css";

// Project ID from WalletConnect Cloud
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "7c6d84f2e64691899d2eb6d337ee9c89";

// Configure with the new getDefaultConfig API for Wagmi v2
const config = getDefaultConfig({
  appName: "Classic Game Hub",
  projectId,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
