import { createAppKit } from '@reown/appkit/react';

import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const projectId = 'c9123e47ba32bd9e6b2ab13381d5e51b';

const metadata = {
  name: 'AnyAlt-Widget',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

const networks = [mainnet, arbitrum];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum],
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#008080',
            borderRadius: 'medium',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
