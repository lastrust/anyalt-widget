import {
  AnyAlt,
  BitcoinTransactionDataResponse,
  EVMTransactionDataResponse,
  SolanaTransactionDataResponse,
} from '@anyalt/sdk';
import { TransactionError } from '@anyalt/sdk/dist/types/types';

export const getTransactionData = async (
  aaInstance: AnyAlt,
  operationId: string,
  slippage: string,
  walletAddress: string,
): Promise<
  | EVMTransactionDataResponse
  | SolanaTransactionDataResponse
  | BitcoinTransactionDataResponse
> => {
  try {
    const response = await aaInstance.getTransactionData({
      operationId,
      slippage,
      walletAddress,
    });

    if (!response) {
      throw new TransactionError('No transaction data received from server');
    }
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: any } };
      const errorData = axiosError.response.data;
      const errorMessage =
        errorData?.message || errorData?.error || JSON.stringify(errorData);
      throw new TransactionError(errorMessage);
    }
    throw new TransactionError(
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching transaction data.',
      error,
    );
  }
};
