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
  bestRouteAtom,
  finalTokenAmountAtom,
  isTokenBuyTemplateAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';
import { TransactionError } from '../../../types/transaction';
import { useExecuteTokensSwap } from './useExecuteTokensSwap';
import { useSwapState } from './useSwapState';

export const useHandleSwap = (externalEvmWalletConnector?: WalletConnector) => {
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);

  const [, setFinalTokenAmount] = useAtom(finalTokenAmountAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);

  const bestRoute = useAtomValue(bestRouteAtom);

  const {
    swapData,
    setSwapData,
    swapDataRef,
    transactionIndex,
    updateTransactionIndex,
  } = useSwapState();
  const { executeTokensSwap, updateTransactionProgress } = useExecuteTokensSwap(
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

    if (bestRoute?.swaps && bestRoute?.swaps?.length > 0) {
      const { isCrosschainSwapError } = await executeTokensSwap(
        aaInstance,
        operationId,
        slippage,
        totalSteps,
        swapDataRef,
      );

      if (isCrosschainSwapError)
        throw new TransactionError('Transaction failed');
    }
    // If the template is token buy, we don't need to execute the last mile transaction
    if (isTokenBuyTemplate) return;

    if (transactionIndex !== swapData.totalSteps) updateTransactionIndex();
    await executeLastMileTransaction(
      transactionIndex,
      executeCallBack,
      aaInstance,
      operationId,
    );
  };

  const executeLastMileTransaction = async (
    stepIndex: number,
    executeCallBack: (token: Token) => Promise<ExecuteResponse>,
    aaInstance: AnyAlt,
    operationId: string,
  ) => {
    if (
      bestRoute?.swaps &&
      bestRoute?.swaps?.length > 0 &&
      !swapDataRef.current.swapIsFinished
    )
      throw new TransactionError('Swap is not finished');

    try {
      const isEvm = protocolInputToken?.chain?.chainType === ChainType.EVM;

      if (isEvm && protocolInputToken?.chain?.chainId) {
        await switchChain(walletConfig, {
          chainId: protocolInputToken.chain.chainId,
        });
      }

      updateTransactionProgress({
        isApproval: false,
        status: TX_STATUS.pending,
        message: TX_MESSAGE.signing,
        details: {
          currentStep: stepIndex + 1,
          totalSteps: swapDataRef.current.totalSteps,
          stepDescription: STEP_DESCR.pending,
        },
      });

      const executeResponse = await executeCallBack({
        amount: swapDataRef.current.crosschainSwapOutputAmount,
        address: protocolInputToken?.tokenAddress || '',
        decimals: protocolInputToken?.decimals || 0,
        chainId: protocolInputToken?.chain?.chainId || 1,
        name: protocolInputToken?.symbol || '',
        symbol: protocolInputToken?.symbol || '',
        chainType: isEvm ? ChainType.EVM : ChainType.SOLANA,
      });

      setFinalTokenAmount(executeResponse.amountOut);

      if (executeResponse.approvalTxHash) {
        updateTransactionProgress({
          isApproval: true,
          status: TX_STATUS.confirmed,
          message: TX_MESSAGE.confirmed,
          txHash: executeResponse.approvalTxHash,
          chainName: protocolInputToken?.chain?.name,
          details: {
            currentStep: stepIndex + 1,
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });

        await aaInstance.createLastMileTransaction({
          vmType: isEvm ? 'EVM' : 'SOLANA',
          operationId,
          order: 0,
          chainId: isEvm ? protocolInputToken?.chain?.chainId || 1 : 101,
          transactionHash: executeResponse.approvalTxHash,
        });
      }

      if (executeResponse.executeTxHash) {
        updateTransactionProgress({
          isApproval: false,
          status: TX_STATUS.confirmed,
          message: TX_MESSAGE.confirmed,
          txHash: executeResponse.executeTxHash,
          chainName: protocolInputToken?.chain?.name,
          details: {
            currentStep: stepIndex + 1,
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.complete,
          },
        });

        await aaInstance.createLastMileTransaction({
          vmType: isEvm ? 'EVM' : 'SOLANA',
          operationId,
          order: 1,
          chainId: isEvm ? protocolInputToken?.chain?.chainId || 1 : 101,
          transactionHash: executeResponse.executeTxHash,
        });
      }
    } catch (error) {
      const isErrorInstance = error instanceof Error;
      const errorMessage = isErrorInstance ? error.message : String(error);
      const isRejectedByUser =
        (error as any)?.code === 4001 || errorMessage.includes('User rejected');

      try {
        updateTransactionProgress({
          isApproval: false,
          status: TX_STATUS.failed,
          message: isRejectedByUser
            ? 'Transaction rejected by user'
            : TX_MESSAGE.failed, // Default failure message
          error: errorMessage,
          details: {
            currentStep: stepIndex + 1,
            totalSteps: swapDataRef.current.totalSteps,
            stepDescription: STEP_DESCR.failed,
          },
        });
      } catch (updateError) {
        console.error('Failed to update step progress:', updateError);
      }

      throw new TransactionError(
        isRejectedByUser
          ? 'Transaction was rejected by the user in MetaMask'
          : 'Failed to execute last mile transaction',
        error,
      );
    }
  };

  return {
    executeSwap,
  };
};
