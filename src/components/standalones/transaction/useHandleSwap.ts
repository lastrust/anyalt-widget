import { AnyAlt } from '@anyalt/sdk';
import { useAtomValue } from 'jotai';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../..';
import { allRoutesAtom, widgetTemplateAtom } from '../../../store/stateStore';
import { TransactionError } from '../../../types/transaction';
import { useExecuteTokensSwap } from './useExecuteTokensSwap';
import { useLastMileTransaction } from './useLastMileTransaction';
import { useSwapState } from './useSwapState';

export const useHandleSwap = (externalEvmWalletConnector?: WalletConnector) => {
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const allRoutes = useAtomValue(allRoutesAtom);

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

    if (allRoutes?.swapSteps && allRoutes?.swapSteps?.length > 0) {
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
