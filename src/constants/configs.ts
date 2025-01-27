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

// export const defaultWalletConfig = getDefaultConfig({
//   appName: 'Anyalt Widget',
//   projectId: 'c9123e47ba32bd9e6b2ab13381d5e51b',
//   ssr: false,
//   chains: [mainnet, arbitrum, polygon, optimism, base, linea, scroll, blast],
//   transports: {
//     [mainnet.id]: http(),
//     [arbitrum.id]: http(),
//     [polygon.id]: http(),
//     [optimism.id]: http(),
//     [base.id]: http(),
//     [linea.id]: http(),
//     [scroll.id]: http(),
//     [blast.id]: http(),
//   },
// });

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

export const defaultWalletConfig = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
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
