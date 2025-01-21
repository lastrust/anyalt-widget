import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { getSolana } from '../utils/solana';

// Solana Token Balance Hook
export const useSolana = () => {
  // Create a Solana connection to the devnet by default
  const connection = useMemo(() => getSolana(), []);

  const getSolanaTokenBalance = async (
    tokenAddress: string,
    walletAddress: string,
  ): Promise<string> => {
    // Create PublicKey objects for the token and wallet
    const tokenPublicKey = new PublicKey(tokenAddress);
    const walletPublicKey = new PublicKey(walletAddress);

    if (tokenAddress === 'So11111111111111111111111111111111111111112') {
      // Get the SOL balance
      const solBalanceLamports = await connection.getBalance(walletPublicKey);
      const solBalance = (solBalanceLamports / 1e9).toString(); // Convert lamports to SOL
      return solBalance;
    }

    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      },
    );

    // Find the token account that matches the token address
    const tokenAccountInfo = tokenAccounts.value.find((accountInfo) => {
      return (
        accountInfo.account.data.parsed.info.mint === tokenPublicKey.toBase58()
      );
    });

    if (!tokenAccountInfo) {
      throw new Error('Token account not found');
    }

    // Extract the token balance
    const tokenAmount =
      tokenAccountInfo.account.data.parsed.info.tokenAmount.amount;
    const tokenDecimals =
      tokenAccountInfo.account.data.parsed.info.tokenAmount.decimals;

    const tokenBalance = (
      Number(tokenAmount) / Math.pow(10, tokenDecimals)
    ).toFixed(tokenDecimals);

    return tokenBalance;
  };

  return {
    getSolanaTokenBalance,
  };
};
