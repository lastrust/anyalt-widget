import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  okxWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  arbitrum,
  base,
  blast,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
} from 'wagmi/chains';

const projectId = 'c9123e47ba32bd9e6b2ab13381d5e51b';

const metadata = {
  name: 'AnyAlt-Widget',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

const networks = [
  mainnet,
  arbitrum,
  polygon,
  optimism,
  base,
  linea,
  scroll,
  blast,
];

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, coinbaseWallet, okxWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'Anyalt Widget',
    projectId: projectId,
  },
);

export const defaultWalletConfig = new WagmiAdapter({
  connectors,
  networks,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [defaultWalletConfig],
  networks: [mainnet, arbitrum, polygon, optimism, base, linea, scroll, blast],
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

export const walletConfig = defaultWalletConfig.wagmiConfig;
