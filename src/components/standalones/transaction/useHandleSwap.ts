import { AnyAlt, EVMTransactionDataResponse } from '@anyalt/sdk';
import { SwapResult } from '@anyalt/sdk/src/adapter/api/api';
import { switchChain } from '@wagmi/core';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { ChainType, ExecuteResponse, Token, WalletConnector } from '../../..';
import { walletConfig } from '../../../constants/configs';
import {
  allChainsAtom,
  bestRouteAtom,
  currentStepAtom,
  finalTokenAmountAtom,
  isTokenBuyTemplateAtom,
  stepsProgressAtom,
} from '../../../store/stateStore';
import {
  TransactionError,
  TransactionProgress,
} from '../../../types/transaction';
import { chainIds } from '../../../utils/chains';
import { getTransactionData } from '../../../utils/getTransactionData';
import { handleSignerAddress } from '../../../utils/handleSignerAddress';
import { submitPendingTransaction } from '../../../utils/submitPendingTransaction';
import { useHandleTransaction } from './handlers/useHandleTransaction';

export const useHandleSwap = (externalEvmWalletConnector?: WalletConnector) => {
  const [, setFinalTokenAmount] = useAtom(finalTokenAmountAtom);
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [stepsProgress, setStepsProgress] = useAtom(stepsProgressAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);

  const allChains = useAtomValue(allChainsAtom);
  const bestRoute = useAtomValue(bestRouteAtom);

  const {
    handleTransaction,
    handleEvmTransaction,
    handleSolanaTransaction,
    handleBitcoinTransaction,
  } = useHandleTransaction({
    externalEvmWalletConnector,
  });

  const updateStepProgress = (progress: TransactionProgress) => {
    setStepsProgress((prev) => {
      const newSteps = prev?.steps ? [...prev.steps] : [];
      const index = progress.details.currentStep - 1;

      const progressKey = progress.isApproval ? 'approve' : 'swap';

      newSteps[index] = {
        ...newSteps[index],
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
      let stepIndex = 1;
      setCurrentStep(stepIndex);
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
              currentStep: stepIndex,
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
              currentStep: stepIndex,
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
              currentStep: stepIndex,
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
                currentStep: stepIndex,
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
              currentStep: stepIndex,
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
            stepIndex++;
            setCurrentStep(stepIndex);
            console.log('currentStep increased ', stepIndex);
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
              currentStep: stepIndex,
              totalSteps,
              stepDescription: 'Failed',
            },
          });
          break;
        }
      } while (!swapIsFinished);

      if (isCrosschainSwapError) {
        throw new TransactionError('Transaction failed');
      }
      // If the template is token buy, we don't need to execute the last mile transaction
      if (isTokenBuyTemplate) return;

      // Execute last mile transaction
      try {
        stepIndex++;
        setCurrentStep(stepIndex);
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
        updateStepProgress({
          isApproval: false,
          status: 'pending',
          message: 'Waiting for transaction to complete...',
          details: {
            currentStep: stepIndex,
            totalSteps,
            stepDescription: 'Pending',
          },
        });

        const executeResponse = await executeCallBack({
          amount: crosschainSwapOutputAmount,
          address: lastSwap?.to.address || '',
          decimals: lastSwap?.to.decimals || 0,
          chainId:
            chainIds[lastSwap?.to.blockchain as keyof typeof chainIds] || 1,
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
              currentStep: stepIndex,
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
              currentStep: stepIndex,
              totalSteps,
              stepDescription: 'Complete',
            },
          });
        }
      } catch (error) {
        try {
          updateStepProgress({
            isApproval: false,
            status: 'failed',
            message:
              error instanceof TransactionError
                ? error.message
                : 'Transaction failed',
            error: error instanceof Error ? error.message : String(error),
            details: {
              currentStep: stepIndex, // Ensure stepIndex is used
              totalSteps,
              stepDescription: 'Failed',
            },
          });
        } catch (updateError) {
          console.error('Failed to update step progress:', updateError);
        }

        throw new TransactionError(
          'Failed to execute last mile transaction',
          error,
        );
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
    handleBitcoinTransaction,
  };
};
