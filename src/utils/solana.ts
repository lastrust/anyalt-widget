import { Connection } from '@solana/web3.js';

export const getSolana = () => {
  return new Connection('https://mainnet.helius-rpc.com');
};
