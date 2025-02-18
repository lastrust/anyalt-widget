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
  ) => {
    let txHash = '';
    switch (transactionData.type) {
      case 'EVM':
        txHash = await handleEvmTransaction(
          transactionData as EVMTransactionDataResponse,
        );
        break;
      case 'SOLANA':
        txHash =
          (await handleSolanaTransaction(
            transactionData as SolanaTransactionDataResponse,
          )) || '';
        break;
      case 'TRANSFER':
        txHash = await handleBitcoinTransaction(
          transactionData as BitcoinTransactionDataResponse,
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
