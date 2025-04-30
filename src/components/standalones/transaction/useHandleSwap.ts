import { AnyAlt } from '@anyalt/sdk';
import { useAtomValue } from 'jotai';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../..';
import { widgetTemplateAtom } from '../../../store/stateStore';
import { TransactionError } from '../../../types/transaction';
import { selectedRouteAtom } from './../../../store/stateStore';
import { useExecuteTokensSwap } from './useExecuteTokensSwap';
import { useLastMileTransaction } from './useLastMileTransaction';
import { useSwapState } from './useSwapState';

export const useHandleSwap = (externalEvmWalletConnector?: WalletConnector) => {
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const selectedRoute = useAtomValue(selectedRouteAtom);

  const {
    setSwapData,
    swapDataRef,
    updateTransactionIndex,
    updateTransactionProgress,
  } = useSwapState();

  const { executeTokensSwap } = useExecuteTokensSwap(
    updateTransactionIndex,
    updateTransactionProgress,
    externalEvmWalletConnector,
  );

  const { executeLastMileTransaction } = useLastMileTransaction({
    swapDataRef,
    updateTransactionProgress,
  });

  const executeSwap = async (
    aaInstance: AnyAlt,
    operationId: string,
    slippage: string,
    stepsNo: number,
    executeCallBack: (token: Token) => Promise<ExecuteResponse>,
    estimateCallback: (token: Token) => Promise<EstimateResponse>,
    higherGasCost?: boolean,
  ) => {
    const lastMileTxStep = 1;
    const totalSteps = stepsNo + lastMileTxStep;

    setSwapData((prev) => {
      {
        const newData = { ...prev, isCrosschainSwapError: false, totalSteps };
        swapDataRef.current = newData;
        return newData;
      }
    });

    const isSwapRemaining = selectedRoute?.swapSteps.filter(
      (swap) => swap.status !== 'SUCCESS',
    ).length;

    const isSwapAnySwaps = Boolean(
      isSwapRemaining &&
        selectedRoute?.swapSteps &&
        selectedRoute?.swapSteps?.length > 0,
    );

    setSwapData((prev) => {
      {
        const newData = {
          ...prev,
          isCrosschainSwapError: false,
          totalSteps,
          swapIsFinished: !isSwapAnySwaps,
        };
        swapDataRef.current = newData;
        return newData;
      }
    });

    if (isSwapAnySwaps) {
      // This is the only place this variable is used
      // And it doesn't seem to actually care that the swap was cross chain
      // So it's just an indicator of whether the swap was successful or not
      // We should rename it.
      const { isCrosschainSwapError } = await executeTokensSwap(
        aaInstance,
        operationId,
        slippage,
        totalSteps,
        swapDataRef,
        estimateCallback,
        higherGasCost,
      );

      if (isCrosschainSwapError)
        throw new TransactionError('Transaction failed');
    }
    // If the template is token buy, we don't need to execute the last mile transaction
    if (widgetTemplate === 'TOKEN_BUY') return;

    await executeLastMileTransaction(
      swapDataRef.current.currentStep,
      executeCallBack,
      aaInstance,
      operationId,
    );
  };

  return {
    executeSwap,
  };
};
