import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { BitcoinTransactionDataResponse } from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';
import { useCallback, useEffect, useState } from 'react';

export type FeePriority =
  | 'fastest'
  | 'halfHour'
  | 'hour'
  | 'economy'
  | 'minimum';

interface RecommendedFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

const INITIAL_FEES: RecommendedFees = {
  fastestFee: 0,
  halfHourFee: 0,
  hourFee: 0,
  economyFee: 0,
  minimumFee: 0,
};

export const useBitcoinHandler = () => {
  const { sendTransfer: sendBitcoinTransfer, account: bitcoinAccount } =
    useBitcoinWallet();
  const [recommendedFees, setRecommendedFees] =
    useState<RecommendedFees>(INITIAL_FEES);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);

  const fetchRecommendedFees =
    useCallback(async (): Promise<RecommendedFees> => {
      try {
        setIsLoadingFees(true);
        setFeeError(null);

        const response = await fetch(
          'https://mempool.space/api/v1/fees/recommended',
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch fees: ${response.status} ${response.statusText}`,
          );
        }

        const fees: RecommendedFees = await response.json();
        setRecommendedFees(fees);
        return fees;
      } catch (error) {
        console.error('Error fetching recommended fees:', error);
        setFeeError(error instanceof Error ? error.message : String(error));
        return INITIAL_FEES; // Return zeros, indicating we couldn't fetch fees
      } finally {
        setIsLoadingFees(false);
      }
    }, []);

  const getFeeRate = (priority: FeePriority = 'halfHour'): number | null => {
    if (Object.values(recommendedFees).every((fee) => fee === 0)) {
      return null; // Return null if we don't have valid fees
    }

    switch (priority) {
      case 'fastest':
        return recommendedFees.fastestFee;
      case 'halfHour':
        return recommendedFees.halfHourFee;
      case 'hour':
        return recommendedFees.hourFee;
      case 'economy':
        return recommendedFees.economyFee;
      case 'minimum':
        return recommendedFees.minimumFee;
      default:
        return recommendedFees.halfHourFee;
    }
  };

  useEffect(() => {
    fetchRecommendedFees();
  }, [fetchRecommendedFees]);

  const handleBitcoinTransaction = useCallback(
    async (
      transactionDetails: BitcoinTransactionDataResponse,
      feePriority?: FeePriority,
    ): Promise<string> => {
      try {
        if (!bitcoinAccount) {
          throw new TransactionError(
            'No Bitcoin accounts found. Please connect your wallet.',
          );
        }

        if (feePriority) {
          await fetchRecommendedFees();
        }

        const amount = Number(transactionDetails.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error('Amount must be a positive number.');
        }

        // Get the appropriate fee rate based on priority
        const feeRate = feePriority ? getFeeRate(feePriority) : null;

        // Prepare transaction parameters
        const transferParams: any = {
          to: transactionDetails.recipientAddress,
          sats: amount,
        };

        // Only include fee options if we have a valid fee rate
        if (feeRate !== null && feeRate !== 0) {
          console.debug(
            `Using fee rate: ${feeRate} sats/vB for priority: ${feePriority}`,
          );
          transferParams.options = {
            feeRate: feeRate,
          };
        } else {
          console.debug(
            'Using wallet default fee rate (no fees available from API)',
          );
        }

        const res = await sendBitcoinTransfer(transferParams);

        return res;
      } catch (error) {
        console.error('Error processing Bitcoin transaction:', error);
        throw new TransactionError(
          'Failed to process Bitcoin transaction',
          error instanceof Error ? error.message : String(error),
        );
      }
    },
    [
      bitcoinAccount,
      sendBitcoinTransfer,
      recommendedFees,
      fetchRecommendedFees,
    ],
  );

  return {
    handleBitcoinTransaction,
    fetchRecommendedFees,
    recommendedFees,
    isLoadingFees,
    feeError,
  };
};
