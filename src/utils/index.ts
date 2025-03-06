import { BestRouteResponse } from '@anyalt/sdk';
import { PublicKey } from '@solana/web3.js';
import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import { formatUnits, zeroAddress } from 'viem';
import { config } from '../constants/configs';
import { chainIdsValues } from './chains';

export function isValidEthereumAddress(address: string): boolean {
  return ethers.isAddress(address);
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    const publicKey = new PublicKey(address);
    return PublicKey.isOnCurve(publicKey);
  } catch {
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
    const res = await getBalance(config, {
      chainId: chainId as chainIdsValues,
      address: walletAddress as `0x${string}`,
    });
    const balance = formatUnits(res.value, res.decimals);
    return balance;
  }

  const res = await getBalance(config, {
    chainId: chainId as chainIdsValues,
    token: tokenAddress as `0x${string}`,
    address: walletAddress as `0x${string}`,
  });

  const balance = formatUnits(res.value, res.decimals);
  return balance;
};

export const calculateWorstOutput = (
  route: BestRouteResponse,
  slippage: string,
) => {
  const decimals =
    route.swapSteps[route.swapSteps.length - 1].destinationToken.decimals;

  const outputAmountFloat = parseFloat(route.outputAmount);
  const outputAmountBigInt = ethers.parseUnits(
    outputAmountFloat.toFixed(decimals),
    decimals,
  );

  const slippageNo = Number(slippage) / 100;
  if (isNaN(slippageNo) || slippageNo < 0 || slippageNo > 1) {
    throw new Error('Invalid slippage');
  }

  const PRECISION = BigInt(1000000);
  const halfSlippageFactor =
    PRECISION - BigInt(Math.floor(slippageNo * 500000));
  const fullSlippageFactor =
    PRECISION - BigInt(Math.floor(slippageNo * 1000000));

  let worstOutput = outputAmountBigInt;
  for (let i = 0; i < route.swapSteps.length; i++) {
    if (i === 0) {
      // In Rango, the first swap applies half the slippage
      // This is done to balance the possibility of financial loss due to the slippage being applied on each swap
      // With the possibility of the transaction not going through due to the slippage protection being too low
      worstOutput = (worstOutput * halfSlippageFactor) / PRECISION;
    } else {
      worstOutput = (worstOutput * fullSlippageFactor) / PRECISION;
    }
  }

  return {
    humanReadable: ethers.formatUnits(worstOutput, decimals),
    raw: worstOutput,
  };
};
