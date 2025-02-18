import {
  BitcoinTransactionDataResponse,
  EVMTransactionDataResponse,
  SolanaTransactionDataResponse,
} from '@anyalt/sdk';
import { useState } from 'react';
import { WalletConnector } from '../../../..';
import { useBitcoinHandler } from './useBitcoinHandler';
import { useEvmHandler } from './useEvmHandler';
import { useSolanaHandler } from './useSolanaHandler';

type UseHandleTransactionProps = {
  externalEvmWalletConnector?: WalletConnector;
};

export const useHandleTransaction = ({
  externalEvmWalletConnector,
}: UseHandleTransactionProps) => {
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  const { handleEvmTransaction } = useEvmHandler(externalEvmWalletConnector);
  const { handleSolanaTransaction } = useSolanaHandler();
  const { handleBitcoinTransaction } = useBitcoinHandler();

  const handleTransaction = async (
    transactionData:
      | EVMTransactionDataResponse
      | SolanaTransactionDataResponse
      | BitcoinTransactionDataResponse,
  ) => {
    switch (transactionData.type) {
      case 'EVM':
        setTxHash(
          await handleEvmTransaction(
            transactionData as EVMTransactionDataResponse,
          ),
        );
        break;
      case 'SOLANA':
        setTxHash(
          (await handleSolanaTransaction(
            transactionData as SolanaTransactionDataResponse,
          )) || '',
        );
        break;
      case 'TRANSFER':
        setTxHash(
          await handleBitcoinTransaction(
            transactionData as BitcoinTransactionDataResponse,
          ),
        );
        break;
      default:
        throw new Error(
          `Unsupported transaction type: ${transactionData.type}`,
        );
    }

    return txHash;
  };

  return {
    handleTransaction,
    handleEvmTransaction,
    handleSolanaTransaction,
    handleBitcoinTransaction,
  };
};
