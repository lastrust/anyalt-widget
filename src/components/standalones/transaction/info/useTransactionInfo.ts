import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../../..';
import {
  activeOperationIdAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  finalTokenEstimateAtom,
  slippageAtom,
  transactionIndexAtom,
  transactionsListAtom,
  transactionsProgressAtom,
} from '../../../../store/stateStore';
import { useHandleSwap } from '../useHandleSwap';

export const useTransactionInfo = ({
  externalEvmWalletConnector,
  onTxComplete,
  executeCallBack,
  estimateCallback,
}: {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const slippage = useAtomValue(slippageAtom);
  const bestRoute = useAtomValue(bestRouteAtom);
  const currentStep = useAtomValue(transactionIndexAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const transactionsList = useAtomValue(transactionsListAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const transactionsProgress = useAtomValue(transactionsProgressAtom);

  const { executeSwap } = useHandleSwap(externalEvmWalletConnector);

  const runTx = async () => {
    if (!anyaltInstance || !activeOperationId) return;
    setIsLoading(true);
    try {
      await executeSwap(
        anyaltInstance,
        activeOperationId,
        slippage,
        (bestRoute?.swapSteps ?? []).length,
        executeCallBack,
        estimateCallback,
      );
      onTxComplete();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const estimatedTime = useMemo(() => {
    if (!bestRoute) return 0;
    if (currentStep > bestRoute.swapSteps.length)
      return finalTokenEstimate?.estimatedTimeInSeconds || 0;
    return bestRoute.swapSteps[currentStep - 1]?.estimatedTimeInSeconds || 0;
  }, [bestRoute, currentStep, finalTokenEstimate]);

  const fees = useMemo(() => {
    if (!bestRoute) return '0';
    if (currentStep > bestRoute.swapSteps.length)
      return finalTokenEstimate?.estimatedFeeInUSD || '0';
    return (
      bestRoute.swapSteps[currentStep - 1]?.fees
        .reduce((acc, fee) => {
          const amount = parseFloat(fee?.amount);
          const price = fee.price || 0;
          return acc + amount * price;
        }, 0)
        .toFixed(2)
        .toString() || '0'
    );
  }, [bestRoute, currentStep, finalTokenEstimate]);

  return {
    fees,
    runTx,
    isLoading,
    bestRoute,
    currentStep,
    estimatedTime,
    transactionsList,
    transactionsProgress,
    recentTransaction: transactionsList?.steps?.[currentStep - 1],
  };
};
