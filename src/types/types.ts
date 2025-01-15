export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
}

export interface Token {
  address: string;
  chainId: number;
  chainType: ChainType;
}
