export const chainExplorers = {
  ETH: 'https://etherscan.io/tx/',
  ARBITRUM: 'https://arbiscan.io/tx/',
  POLYGON: 'https://polygonscan.com/tx/',
  OPTIMISM: 'https://optimistic.etherscan.io/tx/',
  BASE: 'https://basescan.org/tx/',
  LINEA: 'https://lineascan.build/tx/',
  BTC: 'https://www.blockchain.com/explorer/transactions/btc/',
  SCROLL: 'https://scrollscan.com//tx/',
  BLAST: 'https://blastscan.io/tx/',
  SOLANA: 'https://solscan.io/tx/',
  BSC: 'https://bscscan.com/tx/',
  AVALANCHE: 'https://snowtrace.io/tx/',
  ZKSYNC: 'https://explorer.zksync.io/tx/',
};

export const chainIds = {
  ETH: 1,
  ARBITRUM: 42161,
  POLYGON: 137,
  OPTIMISM: 10,
  BASE: 8453,
  LINEA: 59144,
  BTC: 0,
  SCROLL: 534351,
  BLAST: 534352,
  SOLANA: 101,
  BSC: 56,
  AVALANCHE: 43114,
  ZKSYNC: 324,
};

export type chainIdsValues =
  | 1
  | 42161
  | 137
  | 10
  | 8453
  | 59144
  | 534352
  | 324
  | 56
  | 43114;

export const CHAIN_ETHEREUM = 'ETH';
export const CHAIN_ARBITRUM = 'ARBITRUM';
export const CHAIN_AVALANCHE = 'AVAX_CCHAIN';
export const CHAIN_BASE = 'BASE';
export const CHAIN_BNB = 'BSC';
export const CHAIN_FANTOM = 'FANTOM';
export const CHAIN_GNOSIS = 'GNOSIS';
export const CHAIN_OPTIMISM = 'OPTIMISM';
export const CHAIN_POLYGON = 'POLYGON';
export const CHAIN_ZKSYNC = 'ZKSYNC';

export const ChainIdToChainConstant = {
  1: CHAIN_ETHEREUM,
  42161: CHAIN_ARBITRUM,
  43114: CHAIN_AVALANCHE,
  8453: CHAIN_BASE,
  56: CHAIN_BNB,
  250: CHAIN_FANTOM,
  100: CHAIN_GNOSIS,
  10: CHAIN_OPTIMISM,
  137: CHAIN_POLYGON,
  324: CHAIN_ZKSYNC,
} as const;

export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
  BTC = 'BTC',
}

export function mapBlockchainToChainType(blockchain: string): ChainType | null {
  const evmChains = [
    'ETH',
    'ARBITRUM',
    'BASE',
    'OPTIMISM',
    'POLYGON',
    'LINEA',
    'SCROLL',
    'BLAST',
  ];

  if (evmChains.includes(blockchain.toUpperCase())) {
    return ChainType.EVM;
  }

  switch (blockchain.toUpperCase()) {
    case 'BTC':
      return ChainType.BTC;
    case 'SOLANA':
      return ChainType.SOLANA;
    default:
      return null;
  }
}
