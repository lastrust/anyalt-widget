export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
}

export interface Token {
  symbol: string;
  address: string;
  chainId?: number;
  chainType: ChainType;
  logoUrl?: string;
}

export interface EstimateResponse {
  amountOut: string;
  priceInUSD: string;
}
