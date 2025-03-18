import {
  BitcoinTransactionDataResponse,
  EVMTransactionDataResponse,
  SolanaTransactionDataResponse,
} from '@anyalt/sdk';
import { WalletConnector } from '../../../..';
import { useBitcoinHandler } from './useBitcoinHandler';
import { useEvmHandler } from './useEvmHandler';
import { useSolanaHandler } from './useSolanaHandler';

type UseHandleTransactionProps = {
  externalEvmWalletConnector?: WalletConnector;
};

export interface TransactionResult {
  txHash: string;
  nonce: number | null;
}

export const useHandleTransaction = ({
  externalEvmWalletConnector,
}: UseHandleTransactionProps) => {
  const { handleEvmTransaction } = useEvmHandler(externalEvmWalletConnector);
  const { handleSolanaTransaction } = useSolanaHandler();
  const { handleBitcoinTransaction } = useBitcoinHandler();

  const handleTransaction = async (
    transactionData:
      | EVMTransactionDataResponse
      | SolanaTransactionDataResponse
      | BitcoinTransactionDataResponse,
  ): Promise<TransactionResult> => {
    switch (transactionData.type) {
      case 'EVM':
        return await handleEvmTransaction(
          transactionData as EVMTransactionDataResponse,
        );
      case 'SOLANA':
        return {
          txHash:
            (await handleSolanaTransaction(
              transactionData as SolanaTransactionDataResponse,
            )) || '',
          nonce: null,
        };
      case 'TRANSFER':
        return {
          txHash: await handleBitcoinTransaction(
            transactionData as BitcoinTransactionDataResponse,
          ),
          nonce: null,
        };
      default:
        throw new Error(
          `Unsupported transaction type: ${transactionData.type}`,
        );
    }
  };

  return {
    handleTransaction,
    handleEvmTransaction,
    handleSolanaTransaction,
    handleBitcoinTransaction,
  };
};
