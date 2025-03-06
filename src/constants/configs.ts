import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  okxWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createClient, http } from 'viem';
import { createConfig } from 'wagmi';
import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
  zksync
} from 'wagmi/chains';

const projectId = 'c9123e47ba32bd9e6b2ab13381d5e51b';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, coinbaseWallet, okxWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'AnyAlt-Widget',
    projectId: projectId,
  },
);

export const config = createConfig({
  connectors,
  chains: [
    mainnet,
    arbitrum,
    polygon,
    optimism,
    base,
    linea,
    scroll,
    blast,
    avalanche,
    bsc,
    zksync
  ],
  ssr: true,
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});
