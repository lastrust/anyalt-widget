import { getDefaultConfig } from '@rainbow-me/rainbowkit';
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

export const config = getDefaultConfig({
  appName: metadata.name,
  projectId,
  chains: [mainnet, arbitrum, polygon, optimism, base, linea, scroll, blast],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
