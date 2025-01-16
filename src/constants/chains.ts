import {
  arbitrum,
  avalanche,
  base,
  bsc,
  fantom,
  gnosis,
  klaytn,
  mainnet,
  optimism,
  polygon,
  zkSync,
} from 'wagmi/chains';
import { getImageURL } from '../utils';

export enum SupportChainType {
  Ethereum = 'ethereum',
  Arbitrum = 'arbitrum',
  Avalanche = 'avalanche',
  Base = 'base',
  Bnb = 'bnb-chain',
  Fantom = 'fantom',
  Gnosis = 'gnosis',
  Klaytn = 'klaytn',
  Optimism = 'optimism',
  Polygon = 'polygon',
  ZkSync = 'zksync-era',
  Solana = 'solana',
}

export type ChainModel = {
  name: SupportChainType;
  chain: string;
  icon: string;
  symbol: string;
  color: string;
  nativeCoin: string;
  chainId?: number;
  rpcUrl: string;
};

export const CHAIN_LIST: ChainModel[] = [
  {
    name: SupportChainType.Ethereum,
    chain: 'Ethereum',
    icon: getImageURL('ethereum.svg'),
    symbol: 'ETH',
    color: 'ethereum',
    nativeCoin: 'ETH',
    chainId: mainnet.id,
    rpcUrl: mainnet.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Arbitrum,
    chain: 'Arbitrum',
    icon: getImageURL('arbitrum.svg'),
    symbol: 'ARB',
    color: 'arbitrum',
    nativeCoin: 'ETH',
    chainId: arbitrum.id,
    rpcUrl: arbitrum.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Avalanche,
    chain: 'Avalanche',
    icon: getImageURL('avalanche.svg'),
    symbol: 'AVAX',
    color: 'avalanche',
    nativeCoin: 'AVAX',
    chainId: avalanche.id,
    rpcUrl: avalanche.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Base,
    chain: 'Base',
    icon: getImageURL('base.svg'),
    symbol: 'BASE',
    color: 'base',
    nativeCoin: 'BASE',
    chainId: base.id,
    rpcUrl: base.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Bnb,
    chain: 'Binance',
    icon: getImageURL('binance.svg'),
    symbol: 'BSC',
    color: 'binance',
    nativeCoin: 'BNB',
    chainId: bsc.id,
    rpcUrl: bsc.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Fantom,
    chain: 'Fantom',
    icon: getImageURL('fantom.svg'),
    symbol: 'FTM',
    color: 'ftm',
    nativeCoin: 'FTM',
    chainId: fantom.id,
    rpcUrl: fantom.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Polygon,
    chain: 'Polygon',
    icon: getImageURL('polygon.svg'),
    symbol: 'MATIC',
    color: 'polygon',
    nativeCoin: 'MATIC',
    chainId: polygon.id,
    rpcUrl: polygon.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Optimism,
    chain: 'Optimism',
    icon: getImageURL('optimism.svg'),
    symbol: 'OP',
    color: 'optimism',
    nativeCoin: 'OP',
    chainId: optimism.id,
    rpcUrl: optimism.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.ZkSync,
    chain: 'ZkSync Era',
    icon: getImageURL('zksync_era.svg'),
    symbol: 'ETH',
    color: 'ethereum',
    nativeCoin: 'ETH',
    chainId: zkSync.id,
    rpcUrl: zkSync.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Gnosis,
    chain: 'Gnosis',
    icon: getImageURL('gnosis.svg'),
    symbol: 'GNO',
    color: 'gnosis',
    nativeCoin: 'GNO',
    chainId: gnosis.id,
    rpcUrl: gnosis.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Klaytn,
    chain: 'Klaytn',
    icon: getImageURL('klaytn.svg'),
    symbol: 'KLAY',
    color: 'klaytn',
    nativeCoin: 'KLAY',
    chainId: klaytn.id,
    rpcUrl: klaytn.rpcUrls.default.http[0],
  },
  {
    name: SupportChainType.Solana,
    chain: 'Solana',
    icon: getImageURL('solana.svg'),
    symbol: 'SOLANA',
    color: 'solana',
    nativeCoin: 'SOL',
    rpcUrl: '',
  },
];
