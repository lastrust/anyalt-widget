import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
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

export const wagmiConfig = getDefaultConfig({
  appName: 'Anyalt Widget',
  projectId: 'c9123e47ba32bd9e6b2ab13381d5e51b',
  chains: [mainnet, arbitrum, polygon, optimism, base, linea, scroll, blast],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [linea.id]: http(),
    [scroll.id]: http(),
    [blast.id]: http(),
  },
});
