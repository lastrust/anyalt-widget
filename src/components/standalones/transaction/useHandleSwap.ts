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
  finalTokenAmountAtom,
  isTokenBuyTemplateAtom,
  stepsProgressAtom,
  swapDataAtom,
  transactionIndexAtom,
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
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);

  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [, setFinalTokenAmount] = useAtom(finalTokenAmountAtom);
  const [stepsProgress, setStepsProgress] = useAtom(stepsProgressAtom);
  const [transactionIndex, setTransactionIndex] = useAtom(transactionIndexAtom);

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

  const increaseTransactionIndex = () => {
    setTransactionIndex(transactionIndex + 1);
  };

  const updateStepProgress = (progress: TransactionProgress) => {
    setStepsProgress((prev) => {
      const newSteps = prev?.steps ? [...prev.steps] : [];
      const index = progress.details.currentStep - 1;

      const txType = progress.isApproval ? 'approve' : 'swap';

      newSteps[index] = {
        ...newSteps[index],
        [txType]: progress,
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
      let isCrosschainSwapError = false;
      const lastMileTxStep = 1;
      const totalSteps = swaps.length + lastMileTxStep;

      setSwapData({
        ...swapData,
        isCrosschainSwapError,
        totalSteps,
      });

      // Initialize steps progress array if not already set
      if (!stepsProgress?.steps || stepsProgress.steps.length === 0) {
        setStepsProgress({ steps: Array(totalSteps).fill({}) });
      }

      if (!swapData.swapIsFinished) {
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
            const isEVMTx = transactionData.type === 'EVM';
            const evmTxData = transactionData as EVMTransactionDataResponse;
            const isApprovalTx = evmTxData.isApprovalTx;

            isApproval = isEVMTx && isApprovalTx;

            const transactionType = isApproval ? 'APPROVE' : 'MAIN';
            const signerAddress = handleSignerAddress(transactionData);
            const stepText = isApproval ? STEP_DESCR.approval : STEP_DESCR.swap;

            updateStepProgress({
              isApproval,
              status: TX_STATUS.signing,
              message: TX_MESSAGE.signing,
              details: {
                currentStep: transactionIndex,
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
                currentStep: transactionIndex,
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
                currentStep: transactionIndex,
                totalSteps,
                stepDescription: stepText,
              },
            });

            const waitForTxResponse = await aaInstance.waitForTx({
              operationId,
            });
            const swapIsFinished = waitForTxResponse.swapIsFinished;

            if (swapIsFinished) {
              setSwapData({
                ...swapData,
                swapIsFinished: waitForTxResponse.swapIsFinished,
                crosschainSwapOutputAmount:
                  waitForTxResponse?.outputAmount || '0',
                totalSteps,
              });

              updateStepProgress({
                isApproval,
                status: TX_STATUS.confirmed,
                message: TX_MESSAGE.confirmed,
                chainName,
                txHash,
                details: {
                  currentStep: transactionIndex,
                  totalSteps,
                  stepDescription: STEP_DESCR.complete,
                },
              });
              break;
            }

            const isTxFailed = waitForTxResponse.status === 'FAILED';
            if (isTxFailed) {
              const errMsg = 'Transaction failed: ' + waitForTxResponse.message;
              throw new TransactionError(errMsg);
            }

            updateStepProgress({
              isApproval,
              status: TX_STATUS.confirmed,
              message: TX_MESSAGE.confirmed,
              chainName,
              txHash,
              details: {
                currentStep: transactionIndex,
                totalSteps,
                stepDescription: STEP_DESCR.complete,
              },
            });

            if (isApproval) {
              console.log('approvalTx');
              continue;
            } else {
              increaseTransactionIndex();
              console.log('currentStep increased ', transactionIndex);
            }
          } catch (error) {
            console.error('Error during swap execution:', error);
            isCrosschainSwapError = true;
            setSwapData({
              ...swapData,
              isCrosschainSwapError: true,
            });

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
                currentStep: transactionIndex,
                totalSteps,
                stepDescription: STEP_DESCR.failed,
              },
            });
            break;
          }
        } while (!swapData.swapIsFinished);
      }

      if (isCrosschainSwapError) {
        throw new TransactionError('Transaction failed');
      }
      // If the template is token buy, we don't need to execute the last mile transaction
      if (isTokenBuyTemplate) return;

      // Execute last mile transaction

      if (!isCrosschainSwapError) {
        increaseTransactionIndex();
        await executeLastMileTransaction(
          swapData.crosschainSwapOutputAmount,
          transactionIndex,
          swapData.totalSteps,
          executeCallBack,
        );
      }
    },
    [
      handleEvmTransaction,
      handleSolanaTransaction,
      transactionIndex,
      setTransactionIndex,
      setStepsProgress,
      swapData,
      setSwapData,
    ],
  );

  const executeLastMileTransaction = useCallback(
    async (
      crosschainSwapOutputAmount: string,
      stepIndex: number,
      totalSteps: number,
      executeCallBack: (token: Token) => Promise<ExecuteResponse>,
    ) => {
      try {
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

        const isApproval = Boolean(executeResponse.approvalTxHash);
        const txHash = isApproval
          ? executeResponse.approvalTxHash
          : executeResponse.executeTxHash;

        updateStepProgress({
          isApproval,
          status: TX_STATUS.confirmed,
          message: TX_MESSAGE.confirmed,
          txHash,
          chainName: lastSwap?.to.blockchain,
          details: {
            currentStep: stepIndex,
            totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });
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
    [],
  );

  return {
    executeSwap,
    handleEvmTransaction,
    handleSolanaTransaction,
    handleBitcoinTransaction,
  };
};
