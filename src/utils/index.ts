import { PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import { zeroAddress } from 'viem';

export function isValidEthereumAddress(address: string): boolean {
  return ethers.isAddress(address);
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    const publicKey = new PublicKey(address);
    return PublicKey.isOnCurve(publicKey);
  } catch (e) {
    console.log(e);
    return false;
  }
}

export const getEvmTokenBalance = async (
  rpcURL: string,
  tokenAddress: string,
  walletAddress: string,
): Promise<string> => {
  const client = await new ethers.JsonRpcProvider(rpcURL);
  if (
    tokenAddress === zeroAddress ||
    tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  ) {
    const balance = await client.getBalance(walletAddress);
    const balanceInEth = ethers.formatEther(balance);

    return balanceInEth;
  }

  const ERC20_ABI = [
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)',
  ];

  const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, client);
  const decimals = await erc20Contract.decimals!();
  const balance = await erc20Contract.balanceOf!(walletAddress);

  const balanceInToken = ethers.formatUnits(balance, decimals || 18);
  return balanceInToken;
};
