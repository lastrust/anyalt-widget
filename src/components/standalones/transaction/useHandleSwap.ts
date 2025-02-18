import { AnyAlt, EVMTransactionDataResponse } from '@anyalt/sdk';
import { SwapResult } from '@anyalt/sdk/src/adapter/api/api';
import { switchChain } from '@wagmi/core';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { ChainType, ExecuteResponse, Token, WalletConnector } from '../../..';
import { walletConfig } from '../../../constants/configs';
import {
  STEP_DESCR,
  TX_MESSAGE,
  TX_STATUS,
} from '../../../constants/transaction';
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

      const progressKey = progress.isApproval
        ? STEP_DESCR.approval
        : STEP_DESCR.swap;

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

          chainName = transactionData.blockChain;
          isApproval =
            transactionData.type === 'EVM' &&
            (transactionData as EVMTransactionDataResponse).isApprovalTx;

          const stepText = isApproval ? STEP_DESCR.approval : STEP_DESCR.swap;
          const signerAddress = handleSignerAddress(transactionData);
          const transactionType = isApproval ? 'APPROVE' : 'MAIN';

          updateStepProgress({
            isApproval,
            status: TX_STATUS.signing,
            message: TX_MESSAGE.signing,
            details: {
              currentStep: stepIndex,
              totalSteps,
              stepDescription: stepText,
            },
          });

          txHash = await handleTransaction(transactionData);

          updateStepProgress({
            isApproval,
            status: TX_STATUS.broadcasting,
            message: TX_MESSAGE.broadcasting,
            chainName,
            txHash,
            details: {
              currentStep: stepIndex,
              totalSteps,
              stepDescription: stepText,
            },
          });

          await submitPendingTransaction(aaInstance, {
            operationId,
            type: transactionType,
            txHash: txHash || '',
            signerAddress: signerAddress,
          });

          updateStepProgress({
            isApproval,
            status: TX_STATUS.pending,
            message: TX_MESSAGE.pending,
            chainName,
            txHash,
            details: {
              currentStep: stepIndex,
              totalSteps,
              stepDescription: stepText,
            },
          });

          const waitForTxResponse = await aaInstance.waitForTx({
            operationId,
          });
          swapIsFinished = waitForTxResponse.swapIsFinished;
          crosschainSwapOutputAmount = waitForTxResponse?.outputAmount || '0';

          if (swapIsFinished) {
            updateStepProgress({
              isApproval,
              status: TX_STATUS.confirmed,
              message: TX_MESSAGE.confirmed,
              chainName,
              txHash,
              details: {
                currentStep: stepIndex,
                totalSteps,
                stepDescription: STEP_DESCR.complete,
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
            status: TX_STATUS.confirmed,
            message: TX_MESSAGE.confirmed,
            chainName,
            txHash,
            details: {
              currentStep: stepIndex,
              totalSteps,
              stepDescription: STEP_DESCR.complete,
            },
          });

          if (isApproval) {
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
          const isErrorInstance = error instanceof Error;
          const isTxErrorInstance = error instanceof TransactionError;

          const errorStatus = isErrorInstance ? error.message : String(error);
          const errorMessage = isTxErrorInstance
            ? error.message
            : TX_MESSAGE.failed;

          updateStepProgress({
            isApproval,
            status: TX_STATUS.failed,
            message: errorMessage,
            error: errorStatus,
            chainName,
            txHash,
            details: {
              currentStep: stepIndex,
              totalSteps,
              stepDescription: STEP_DESCR.failed,
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
          status: TX_STATUS.pending,
          message: TX_MESSAGE.pending,
          details: {
            currentStep: stepIndex,
            totalSteps,
            stepDescription: STEP_DESCR.pending,
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
            status: TX_STATUS.confirmed,
            message: TX_MESSAGE.confirmed,
            txHash: executeResponse.approvalTxHash,
            chainName: lastSwap?.to.blockchain,
            details: {
              currentStep: stepIndex,
              totalSteps,
              stepDescription: STEP_DESCR.complete,
            },
          });
        }
        if (executeResponse.executeTxHash) {
          updateStepProgress({
            isApproval: false,
            status: TX_STATUS.confirmed,
            message: TX_MESSAGE.confirmed,
            txHash: executeResponse.executeTxHash,
            chainName: lastSwap?.to.blockchain,
            details: {
              currentStep: stepIndex,
              totalSteps,
              stepDescription: STEP_DESCR.complete,
            },
          });
        }
      } catch (error) {
        try {
          const isErrorInstance = error instanceof Error;
          updateStepProgress({
            isApproval: false,
            status: TX_STATUS.failed,
            message: isErrorInstance ? error.message : TX_MESSAGE.failed,
            error: isErrorInstance ? error.message : String(error),
            details: {
              currentStep: stepIndex, // Ensure stepIndex is used
              totalSteps,
              stepDescription: STEP_DESCR.failed,
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
