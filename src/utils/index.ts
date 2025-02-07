import { PublicKey } from '@solana/web3.js';
import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import { formatUnits, zeroAddress } from 'viem';
import { walletConfig } from '../constants/configs';

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
  chainId: number,
  tokenAddress: string,
  walletAddress: string,
) => {
  if (
    tokenAddress === '' ||
    tokenAddress === 'Unknown' ||
    tokenAddress === zeroAddress ||
    tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  ) {
    const res = await getBalance(walletConfig, {
      chainId: chainId,
      address: walletAddress as `0x${string}`,
    });
    const balance = formatUnits(res.value, res.decimals);
    return balance;
  }

  const res = await getBalance(walletConfig, {
    chainId: chainId,
    token: tokenAddress as `0x${string}`,
    address: walletAddress as `0x${string}`,
  });

  const balance = formatUnits(res.value, res.decimals);
  return balance;
};
