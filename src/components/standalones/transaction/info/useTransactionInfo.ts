import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { ExecuteResponse, Token, WalletConnector } from '../../../..';
import {
  activeOperationIdAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  currentStepAtom,
  finalTokenEstimateAtom,
  slippageAtom,
  transactionsListAtom,
} from '../../../../store/stateStore';
import { useHandleTransaction } from '../useHandleTransaction';

export const useTransactionInfo = ({
  externalEvmWalletConnector,
  onTxComplete,
  executeCallBack,
}: {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const slippage = useAtomValue(slippageAtom);
  const bestRoute = useAtomValue(bestRouteAtom);
  const currentStep = useAtomValue(currentStepAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const transactionsList = useAtomValue(transactionsListAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  const { executeSwap } = useHandleTransaction(externalEvmWalletConnector);

  const runTx = async () => {
    if (!anyaltInstance || !activeOperationId) return;
    setIsLoading(true);
    try {
      await executeSwap(
        anyaltInstance,
        activeOperationId,
        slippage,
        bestRoute?.swaps || [],
        executeCallBack,
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
    if (currentStep >= bestRoute.swaps.length)
      return finalTokenEstimate?.estimatedTimeInSeconds || 0;
    return bestRoute.swaps[currentStep - 1]?.estimatedTimeInSeconds || 0;
  }, [bestRoute, currentStep, finalTokenEstimate]);

  const fees = useMemo(() => {
    if (!bestRoute) return '0';
    if (currentStep >= bestRoute.swaps.length)
      return finalTokenEstimate?.estimatedFeeInUSD || '0';
    return (
      bestRoute.swaps[currentStep - 1]?.fee
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
    bestRoute,
    runTx,
    currentStep,
    isLoading,
    transactionsList,
    recentTransaction: transactionsList?.steps?.[currentStep - 1],
    estimatedTime,
    fees,
  };
};
