import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { ChainType } from '..';
import { allChainsAtom } from '../store/stateStore';

// Solana Token Balance Hook
export const useSolana = () => {
  // Create a Solana connection to the mainnet-beta by default
  const allChains = useAtomValue(allChainsAtom);
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    let endpoint = allChains.find(
      (chain) => chain.chainType === ChainType.SOLANA,
    )?.rpcUrl;
    if (!endpoint || endpoint === '') {
      endpoint = 'https://api.mainnet-beta.solana.com';
    }
    setConnection(new Connection(endpoint));
  }, [allChains]);

  const getSolanaTokenBalance = async (
    tokenAddress: string,
    walletAddress: string,
  ): Promise<string> => {
    if (!connection) {
      return '0.00';
    }

    const walletPublicKey = new PublicKey(walletAddress);
    if (
      tokenAddress === 'So11111111111111111111111111111111111111112' ||
      tokenAddress === 'Unknown' ||
      tokenAddress === ''
    ) {
      // Get the SOL balance
      const solBalanceLamports = await connection.getBalance(walletPublicKey);
      const solBalance = (solBalanceLamports / 1e9).toString(); // Convert lamports to SOL
      return solBalance;
    }

    // Create PublicKey objects for the token and wallet
    const tokenPublicKey = new PublicKey(tokenAddress);

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
      return '0.00';
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
    connection,
    getSolanaTokenBalance,
  };
};
