import { AnyAlt } from '@anyalt/sdk';
import { SwapResult } from '@anyalt/sdk/src/adapter/api/api';
import { switchChain } from '@wagmi/core';
import { useAtom, useAtomValue } from 'jotai';
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
  transactionsProgressAtom,
} from '../../../store/stateStore';
import { TransactionError } from '../../../types/transaction';
import { chainIds } from '../../../utils/chains';
import { useExecuteTokensSwap } from './useExecuteTokensSwap';
import { useSwapState } from './useSwapState';

export const useHandleSwap = (externalEvmWalletConnector?: WalletConnector) => {
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);

  const [, setFinalTokenAmount] = useAtom(finalTokenAmountAtom);
  const [transactionsProgress, setTransactionsProgress] = useAtom(
    transactionsProgressAtom,
  );

  const allChains = useAtomValue(allChainsAtom);
  const bestRoute = useAtomValue(bestRouteAtom);

  const {
    swapData,
    setSwapData,
    swapDataRef,
    transactionIndex,
    updateTransactionIndex,
  } = useSwapState();
  const { executeTokensSwap, updateStepProgress } = useExecuteTokensSwap(
    updateTransactionIndex,
    externalEvmWalletConnector,
  );

  const executeSwap = async (
    aaInstance: AnyAlt,
    operationId: string,
    slippage: string,
    swaps: SwapResult[],
    executeCallBack: (token: Token) => Promise<ExecuteResponse>,
  ) => {
    const lastMileTxStep = 1;
    const totalSteps = swaps.length + lastMileTxStep;

    setSwapData((prev) => {
      {
        const newData = { ...prev, isCrosschainSwapError: false, totalSteps };
        swapDataRef.current = newData;
        return newData;
      }
    });

    // Initialize steps progress array if not already set
    const isTransactionProgressEmpty =
      !transactionsProgress?.transactions ||
      transactionsProgress.transactions.length === 0;

    if (isTransactionProgressEmpty) {
      setTransactionsProgress({ transactions: Array(totalSteps).fill({}) });
    }

    const { isCrosschainSwapError } = await executeTokensSwap(
      aaInstance,
      operationId,
      slippage,
      totalSteps,
      swapDataRef,
    );

    if (isCrosschainSwapError) throw new TransactionError('Transaction failed');

    // If the template is token buy, we don't need to execute the last mile transaction
    if (isTokenBuyTemplate) return;

    if (!isCrosschainSwapError) {
      if (transactionIndex !== swapData.totalSteps) updateTransactionIndex();
      await executeLastMileTransaction(
        transactionIndex,
        executeCallBack,
        aaInstance,
        operationId,
      );
    }
  };

  const executeLastMileTransaction = async (
    stepIndex: number,
    executeCallBack: (token: Token) => Promise<ExecuteResponse>,
    aaInstance: AnyAlt,
    operationId: string,
  ) => {
    if (!swapDataRef.current.swapIsFinished)
      throw new TransactionError('Swap is not finished');

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
          totalSteps: swapDataRef.current.totalSteps,
          stepDescription: STEP_DESCR.pending,
        },
      });

      const executeResponse = await executeCallBack({
        amount: swapDataRef.current.crosschainSwapOutputAmount,
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
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });

        await aaInstance.createLastMileTransaction({
          vmType: isEvm ? 'EVM' : 'SOLANA',
          operationId,
          order: 0,
          chainId: isEvm ? chain?.chainId || 1 : 101,
          transactionHash: executeResponse.approvalTxHash,
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
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });

        await aaInstance.createLastMileTransaction({
          vmType: isEvm ? 'EVM' : 'SOLANA',
          operationId,
          order: 1,
          chainId: isEvm ? chain?.chainId || 1 : 101,
          transactionHash: executeResponse.executeTxHash,
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
            currentStep: stepIndex,
            totalSteps: swapDataRef.current.totalSteps,
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
  };

  return {
    executeSwap,
  };
};
