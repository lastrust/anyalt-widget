import { Connection, clusterApiUrl } from '@solana/web3.js';

export const getSolana = () => {
  // You can switch to other clusters like 'testnet' or 'mainnet-beta' as needed
  const network = 'devnet';
  const endpoint = clusterApiUrl(network);
  return new Connection(endpoint, 'confirmed');
};
