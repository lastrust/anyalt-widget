import { PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';

export function getImageURL(name: string) {
  return new URL(`../assets/imgs/${name}`, import.meta.url).href;
}

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
