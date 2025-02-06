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
import { getChainId, sendTransaction, switchChain } from '@wagmi/core';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { ChainType, ExecuteResponse, Token, WalletConnector } from '../../..';
import { walletConfig } from '../../../constants/configs';
import {
  allChainsAtom,
  bestRouteAtom,
  currentStepAtom,
  finalTokenAmountAtom,
  stepsProgressAtom,
} from '../../../store/stateStore';

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
  isApproval: boolean;
  chainName?: string;
  txHash?: string;
  error?: string;
  details?: TransactionProgressDetails;
}

export interface StepProgress {
  approve?: TransactionProgress;
  swap?: TransactionProgress;
}

export type TransactionStatusList = {
  steps?: {
    from: {
      tokenName: string;
      tokenLogo: string;
      tokenAmount: string;
      tokenPrice: string;
      tokenUsdPrice: string;
      tokenDecimals: number;
      blockchain: string;
      blockchainLogo: string;
    };
    to: {
      tokenName: string;
      tokenLogo: string;
      tokenAmount: string;
      tokenPrice: string;
      tokenUsdPrice: string;
      tokenDecimals: number;
      blockchain: string;
      blockchainLogo: string;
    };
  }[];
};

export interface StepsProgress {
  steps: StepProgress[];
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

export const useHandleTransaction = (
  externalEvmWalletConnector?: WalletConnector,
) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { isConnected: isEvmConnected, chain: evmChain } = useAccount();

  const [, setFinalTokenAmount] = useAtom(finalTokenAmountAtom);
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [stepsProgress, setStepsProgress] = useAtom(stepsProgressAtom);

  const allChains = useAtomValue(allChainsAtom);
  const bestRoute = useAtomValue(bestRouteAtom);

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
      const chain = allChains.find(
        (chain) => chain.name === transactionDetails.blockChain,
      );

      if (externalEvmWalletConnector) {
        console.log('externalEvmWalletConnector: ', externalEvmWalletConnector);
        if (!externalEvmWalletConnector.isConnected) {
          throw new TransactionError(
            'EVM wallet not connected. Please connect your wallet.',
          );
        }

        if (chain?.chainId !== (await externalEvmWalletConnector.getChain())) {
          await externalEvmWalletConnector.switchChain(chain?.chainId || 0);
        }

        const txHash =
          await externalEvmWalletConnector.signTransaction(transactionDetails);

        return txHash;
      }

      if (!isEvmConnected) {
        throw new TransactionError(
          'EVM wallet not connected. Please connect your wallet.',
        );
      }

      try {
        // switch to the network from transactionDetails.blockchain finding from chains
        if (!chain || !chain.chainId) {
          throw new TransactionError(
            `Unsupported blockchain: ${transactionDetails.blockChain}`,
          );
        }
        console.log('chain: ', chain.chainId);

        console.log('wagmi chain ', evmChain);

        console.log(chain.chainId, getChainId(walletConfig));

        const res = await switchChain(walletConfig, {
          chainId: chain.chainId,
        });

        console.log('res: ', res);

        console.log(transactionDetails);

        if (transactionDetails.isApprovalTx) {
          return await sendTransaction(walletConfig, {
            to: transactionDetails.to as `0x${string}`,
            data: transactionDetails.data! as `0x${string}`,
          });
        } else {
          return await sendTransaction(walletConfig, {
            to: transactionDetails.to as `0x${string}`,
            value: BigInt(transactionDetails.value!),
            data: transactionDetails.data! as `0x${string}`,
          });
        }
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

  const updateStepProgress = (progress: TransactionProgress) => {
    // Update the progress for the current step
    setStepsProgress((prev) => {
      const newSteps = prev?.steps ? [...prev.steps] : [];
      const stepIndex = currentStep - 1;

      // Determine if this is an approval or swap transaction
      const progressKey = progress.isApproval ? 'approve' : 'swap';

      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        [progressKey]: progress,
      };

      return { steps: newSteps };
    });
  };

  const executeSwap = useCallback(
    async (
      aaInstance: AnyAlt,
      operationId: string,
      slippage: string,
      swaps: SwapResult[],
      executeCallBack: (token: Token) => Promise<ExecuteResponse>,
    ) => {
      let swapIsFinished = false;
      let crosschainSwapOutputAmount = '0';
      setCurrentStep(1);
      const totalSteps = swaps.length + 1;

      // Initialize steps progress array if not already set
      if (!stepsProgress?.steps || stepsProgress.steps.length === 0) {
        setStepsProgress({ steps: Array(totalSteps).fill({}) });
      }

      let isCrosschainSwapError = false;
      do {
        let isApproval = false;
        let chainName: string | undefined;
        let txHash: string | undefined;
        try {
          const transactionData = await getTransactionData(
            aaInstance,
            operationId,
            slippage,
          );

          isApproval =
            transactionData.type === 'EVM' &&
            (transactionData as EVMTransactionDataResponse).isApprovalTx;

          console.log('isApproval: ', isApproval);

          chainName = transactionData.blockChain;

          updateStepProgress({
            isApproval,
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

          txHash = await handleTransaction(transactionData);
          console.log('txHash: ', txHash);

          updateStepProgress({
            isApproval,
            status: 'broadcasting',
            message: 'Broadcasting transaction...',
            chainName,
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

          updateStepProgress({
            isApproval,
            status: 'pending',
            message:
              'Waiting for confirmation on source and destination chains...',
            chainName,
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

          const waitForTxResponse = await aaInstance.waitForTx({
            operationId,
          });
          swapIsFinished = waitForTxResponse.swapIsFinished;
          crosschainSwapOutputAmount = waitForTxResponse?.outputAmount || '0';

          if (swapIsFinished) {
            console.log('swapIsFinished: ', swapIsFinished);
            updateStepProgress({
              isApproval,
              status: 'confirmed',
              message: 'Transaction confirmed successfully!',
              chainName,
              txHash,
              details: {
                currentStep: totalSteps,
                totalSteps,
                stepDescription: 'Complete',
              },
            });
            break;
          }

          if (waitForTxResponse.status === 'FAILED') {
            throw new TransactionError(
              'Transaction failed: ' + waitForTxResponse.message,
            );
          }

          updateStepProgress({
            isApproval,
            status: 'confirmed',
            message: 'Transaction confirmed successfully!',
            chainName,
            txHash,
            details: {
              currentStep: totalSteps,
              totalSteps,
              stepDescription: 'Complete',
            },
          });

          if (
            transactionData.type === 'EVM' &&
            (transactionData as EVMTransactionDataResponse).isApprovalTx
          ) {
            console.log('approvalTx');
            continue;
          } else {
            setCurrentStep(currentStep + 1);
            console.log('currentStep increased ', currentStep + 1);
          }
        } catch (error) {
          console.error('Error during swap execution:', error);
          isCrosschainSwapError = true;
          updateStepProgress({
            isApproval,
            status: 'failed',
            message:
              error instanceof TransactionError
                ? error.message
                : 'Transaction failed',
            error: error instanceof Error ? error.message : String(error),
            chainName,
            txHash,
            details: {
              currentStep,
              totalSteps,
              stepDescription: 'Failed',
            },
          });
          break;
        }
      } while (!swapIsFinished);

      if (isCrosschainSwapError) {
        throw new TransactionError('Transaction failed');
      } else {
        // Execute last mile transaction
        try {
          setCurrentStep(currentStep + 1);
          const lastSwap = bestRoute?.swaps[bestRoute.swaps.length - 1];
          const chain = allChains.find(
            (chain) => chain.name === lastSwap?.to.blockchain,
          );
          const isEvm = chain?.chainType === ChainType.EVM;
          if (isEvm && chain?.chainId) {
            await switchChain(walletConfig, {
              chainId: chain.chainId,
            });
          }
          console.log(
            'crosschainSwapOutputAmount: ',
            crosschainSwapOutputAmount,
          );
          const executeResponse = await executeCallBack({
            amount: crosschainSwapOutputAmount,
            address: lastSwap?.to.address || '',
            decimals: lastSwap?.to.decimals || 0,
            name: lastSwap?.to.symbol || '',
            symbol: lastSwap?.to.symbol || '',
            chainType: isEvm ? ChainType.EVM : ChainType.SOLANA,
          });
          setFinalTokenAmount(executeResponse.amountOut);
          if (executeResponse.approvalTxHash) {
            updateStepProgress({
              isApproval: true,
              status: 'confirmed',
              message: 'Transaction confirmed successfully!',
              txHash: executeResponse.approvalTxHash,
              chainName: lastSwap?.to.blockchain,
              details: {
                currentStep: totalSteps,
                totalSteps,
                stepDescription: 'Complete',
              },
            });
          }
          if (executeResponse.executeTxHash) {
            updateStepProgress({
              isApproval: false,
              status: 'confirmed',
              message: 'Transaction confirmed successfully!',
              txHash: executeResponse.executeTxHash,
              chainName: lastSwap?.to.blockchain,
              details: {
                currentStep: totalSteps,
                totalSteps,
                stepDescription: 'Complete',
              },
            });
          }
        } catch (error) {
          updateStepProgress({
            isApproval: false,
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
          throw new TransactionError(
            'Failed to execute last mile transaction',
            error,
          );
        }
      }
    },
    [
      handleEvmTransaction,
      handleSolanaTransaction,
      currentStep,
      setCurrentStep,
      setStepsProgress,
    ],
  );

  return {
    executeSwap,
    handleEvmTransaction,
    handleSolanaTransaction,
  };
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
