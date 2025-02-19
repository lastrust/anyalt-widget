import { SolanaTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { useCallback } from 'react';
import { useSolana } from '../../../../providers/useSolana';

export const useSolanaHandler = () => {
  const { connection } = useSolana();
  const { publicKey, signTransaction } = useWallet();

  const handleSolanaTransaction = useCallback(
    async (
      transactionDetails: SolanaTransactionDataResponse,
    ): Promise<string | undefined> => {
      if (!publicKey || !connection) {
        throw new TransactionError(
          'No public key or connection found. Please connect your wallet.',
        );
      }

      try {
        const serializedMessage = Buffer.from(
          transactionDetails.serializedMessage as Uint8Array,
        );

        const transaction = VersionedTransaction.deserialize(serializedMessage);

        const signedTransaction = await signTransaction!(transaction);
        const txHash = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            skipPreflight: true,
            preflightCommitment: 'confirmed',
          },
        );

        const timeout = 60000;
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
          try {
            const txStatus = await connection.getSignatureStatus(txHash);

            if (
              txStatus.value?.confirmationStatus === 'finalized' ||
              txStatus.value?.confirmationStatus === 'confirmed'
            ) {
              return txHash;
            } else if (txStatus.value?.err) {
              throw new TransactionError(
                `Transaction failed: ${txStatus.value?.err}`,
              );
            }
          } catch (error) {
            throw new TransactionError(
              'Failed to get transaction status',
              error instanceof Error ? error.message : error,
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        throw new TransactionError('Transaction confirmation timeout');
      } catch (error) {
        throw new TransactionError(
          'Failed to process Solana transaction',
          error instanceof Error ? error.message : error,
        );
      }
    },
    [connection, publicKey, signTransaction],
  );

  return { handleSolanaTransaction };
};
