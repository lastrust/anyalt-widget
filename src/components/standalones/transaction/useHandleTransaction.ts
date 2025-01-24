import {
  AnyAlt,
  BitcoinTransactionDataResponse,
  EVMTransactionDataResponse,
  PendingTransactionRequestDto,
  SolanaTransactionDataResponse,
} from '@anyalt/sdk';
import { SwapResult } from '@anyalt/sdk/src/adapter/api/api';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { sendTransaction, switchChain } from 'wagmi/actions';
import { wagmiAdapter } from '../../../providers/RainbowKitProvider';
import { allChainsAtom } from '../../../store/stateStore';

// Types moved to top
export type TransactionStatus =
  | 'pending'
  | 'signing'
  | 'broadcasting'
  | 'confirmed'
  | 'failed';

export interface TransactionProgressDetails {
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
}

export interface TransactionProgress {
  status: TransactionStatus;
  message: string;
  txHash?: string;
  error?: string;
  details?: TransactionProgressDetails;
}

class TransactionError extends Error {
  constructor(
    message: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}

export const useHandleTransaction = () => {
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const allChains = useAtomValue(allChainsAtom);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  // Function to handle transactions based on type
  const handleTransaction = async (
    transactionData:
      | EVMTransactionDataResponse
      | SolanaTransactionDataResponse
      | BitcoinTransactionDataResponse,
  ) => {
    let txHash;

    switch (transactionData.type) {
      case 'EVM':
        txHash = await handleEvmTransaction(
          transactionData as EVMTransactionDataResponse,
        );
        break;
      case 'SOLANA':
        txHash = await handleSolanaTransaction(
          transactionData as SolanaTransactionDataResponse,
        );
        break;
      default:
        throw new Error(
          `Unsupported transaction type: ${transactionData.type}`,
        );
    }

    return txHash;
  };

  const handleEvmTransaction = useCallback(
    async (transactionDetails: EVMTransactionDataResponse): Promise<string> => {
      if (!isEvmConnected) {
        throw new TransactionError(
          'EVM wallet not connected. Please connect your wallet.',
        );
      }

      try {
        // switch to the network from transactionDetails.blockchain finding from chains
        const chain = allChains.find(
          (chain) => chain.name === transactionDetails.blockChain,
        );
        if (!chain || !chain.chainId) {
          throw new TransactionError(
            `Unsupported blockchain: ${transactionDetails.blockChain}`,
          );
        }

        await switchChain(wagmiAdapter.wagmiConfig, {
          chainId: chain.chainId as any,
        });

        const txHash = await sendTransaction(wagmiAdapter.wagmiConfig, {
          to: transactionDetails.to as `0x${string}`,
          value: BigInt(transactionDetails.value!),
          data: transactionDetails.data! as `0x${string}`,
        });

        return txHash;
      } catch (error) {
        throw new TransactionError(
          'Failed to send EVM transaction',
          error instanceof Error ? error.message : error,
        );
      }
    },
    [],
  );

  const handleSolanaTransaction = useCallback(
    async (
      transactionDetails: SolanaTransactionDataResponse,
    ): Promise<string | undefined> => {
      if (!publicKey) {
        throw new TransactionError(
          'No public key found. Please connect your wallet.',
        );
      }

      try {
        const serializedMessage = Buffer.from(
          transactionDetails.serializedMessage as Uint8Array,
        );

        const transaction = VersionedTransaction.deserialize(serializedMessage);

        const signedTransaction = await signTransaction!(transaction);
        const response = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            skipPreflight: true,
            preflightCommitment: 'confirmed',
          },
        );

        return response;
      } catch (error) {
        throw new TransactionError(
          'Failed to process Solana transaction',
          error instanceof Error ? error.message : error,
        );
      }
    },
    [connection, publicKey, signTransaction],
  );

  const executeSwap = useCallback(
    async (
      aaInstance: AnyAlt,
      operationId: string,
      slippage: string,
      swaps: SwapResult[],
      onProgress?: (progress: TransactionProgress) => void,
    ) => {
      let swapIsFinished = false;
      let currentStep = 1;
      let totalSteps = calculateTotalSteps(swaps);
      do {
        try {
          onProgress?.({
            status: 'pending',
            message: 'Fetching transaction data...',
            details: {
              currentStep,
              totalSteps,
              stepDescription: 'Preparing transaction',
            },
          });

          const transactionData = await getTransactionData(
            aaInstance,
            operationId,
            slippage,
          );

          if (
            transactionData.type === 'EVM' &&
            (transactionData as EVMTransactionDataResponse).isApprovalTx
          ) {
            totalSteps = 2;
          }

          onProgress?.({
            status: 'signing',
            message: 'Please sign the transaction in your wallet...',
            details: {
              currentStep,
              totalSteps,
              stepDescription:
                transactionData.type === 'EVM' &&
                (transactionData as EVMTransactionDataResponse).isApprovalTx
                  ? 'Token Approval'
                  : 'Swap Transaction',
            },
          });

          const txHash = await handleTransaction(transactionData);
          console.log('txHash: ', txHash);

          onProgress?.({
            status: 'broadcasting',
            message: 'Broadcasting transaction...',
            txHash,
            details: {
              currentStep,
              totalSteps,
              stepDescription:
                transactionData.type === 'EVM' &&
                (transactionData as EVMTransactionDataResponse).isApprovalTx
                  ? 'Token Approval'
                  : 'Swap Transaction',
            },
          });

          const signerAddress = handleSignerAddress(transactionData);

          const transactionType =
            transactionData.type === 'EVM' &&
            (transactionData as EVMTransactionDataResponse).isApprovalTx
              ? 'APPROVE'
              : 'MAIN';

          await submitPendingTransaction(aaInstance, {
            operationId,
            type: transactionType,
            txHash: txHash || '',
            signerAddress: signerAddress,
          });

          onProgress?.({
            status: 'pending',
            message: 'Waiting for transaction confirmation...',
            txHash,
            details: {
              currentStep: totalSteps,
              totalSteps,
              stepDescription:
                transactionData.type === 'EVM' &&
                (transactionData as EVMTransactionDataResponse).isApprovalTx
                  ? 'Token Approval'
                  : 'Swap Transaction',
            },
          });

          const waitForTxResponse = await aaInstance.waitForTx({
            operationId,
          });
          swapIsFinished = waitForTxResponse.swapIsFinished;

          if (swapIsFinished) {
            onProgress?.({
              status: 'confirmed',
              message: 'Transaction confirmed successfully!',
              txHash,
              details: {
                currentStep: totalSteps,
                totalSteps,
                stepDescription: 'Complete',
              },
            });
            break;
          } else {
            // If not finished and there are multiple steps, increment the step counter
            currentStep++;
          }
        } catch (error) {
          console.error('Error during swap execution:', error);
          onProgress?.({
            status: 'failed',
            message:
              error instanceof TransactionError
                ? error.message
                : 'Transaction failed',
            error: error instanceof Error ? error.message : String(error),
            details: {
              currentStep,
              totalSteps,
              stepDescription: 'Failed',
            },
          });
          break;
        }
      } while (!swapIsFinished);
    },
    [handleEvmTransaction, handleSolanaTransaction],
  );

  return {
    executeSwap,
    handleEvmTransaction,
    handleSolanaTransaction,
  };
};

// Helper functions
const calculateTotalSteps = (swaps: SwapResult[]): number => {
  let totalSteps = 0;
  const processSwap = (swap: SwapResult) => {
    totalSteps += swap.maxRequiredSign;
    if (swap.internalSwaps && swap.internalSwaps.length > 0) {
      swap.internalSwaps.forEach(processSwap);
    }
  };
  swaps.forEach(processSwap);
  return totalSteps;
};

const getTransactionData = async (
  aaInstance: AnyAlt,
  operationId: string,
  slippage: string,
): Promise<
  | EVMTransactionDataResponse
  | SolanaTransactionDataResponse
  | BitcoinTransactionDataResponse
> => {
  try {
    const response = await aaInstance.getTransactionData({
      operationId,
      slippage,
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

const handleSignerAddress = (
  transactionData:
    | EVMTransactionDataResponse
    | SolanaTransactionDataResponse
    | BitcoinTransactionDataResponse,
): string => {
  console.log('handleSignerAddress: ', transactionData);
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

// Function to submit the pending transaction
const submitPendingTransaction = async (
  aaInstance: AnyAlt,
  request: PendingTransactionRequestDto,
) => {
  try {
    await aaInstance.submitPendingTransaction({
      operationId: request.operationId,
      type: request.type,
      txHash: request.txHash,
      signerAddress: request.signerAddress,
    });
    console.log('Pending transaction submitted:', request);
  } catch (error) {
    console.error('Error submitting pending transaction:', error);
    throw new Error('Failed to submit pending transaction.');
  }
};
