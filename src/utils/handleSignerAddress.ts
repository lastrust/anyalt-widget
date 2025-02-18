import {
  BitcoinTransactionDataResponse,
  EVMTransactionDataResponse,
  SolanaTransactionDataResponse,
} from '@anyalt/sdk';

export const handleSignerAddress = (
  transactionData:
    | EVMTransactionDataResponse
    | SolanaTransactionDataResponse
    | BitcoinTransactionDataResponse,
): string => {
  switch (transactionData.type) {
    case 'EVM':
      return (transactionData as EVMTransactionDataResponse).from!;
    case 'SOLANA':
      return (transactionData as SolanaTransactionDataResponse).from!;
    case 'TRANSFER':
      return (transactionData as BitcoinTransactionDataResponse)
        .fromWalletAddress;
    default:
      throw new Error(`Unsupported transaction type: ${transactionData.type}`);
  }
};
