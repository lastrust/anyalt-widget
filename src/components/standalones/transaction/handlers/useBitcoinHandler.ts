import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { BitcoinTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import { useCallback } from 'react';

export const useBitcoinHandler = () => {
  const { sendTransfer: sendBitcoinTransfer, account: bitcoinAccount } =
    useBitcoinWallet();

  const handleBitcoinTransaction = useCallback(
    async (
      transactionDetails: BitcoinTransactionDataResponse,
    ): Promise<string> => {
      try {
        if (!bitcoinAccount) {
          throw new TransactionError(
            'No Bitcoin accounts found. Please connect your wallet.',
          );
        }

        console.log('amountInSats: ', transactionDetails.amount);

        const amount = Number(transactionDetails.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error('Amount must be a positive number.');
        }

        const res = await sendBitcoinTransfer({
          to: transactionDetails.recipientAddress,
          sats: amount,
        });

        return res;
      } catch (error) {
        console.error('Error processing Bitcoin transaction:', error);
        throw new TransactionError(
          'Failed to process Bitcoin transaction',
          error instanceof Error ? error.message : String(error),
        );
      }
    },
    [bitcoinAccount, sendBitcoinTransfer],
  );

  return { handleBitcoinTransaction };
};
