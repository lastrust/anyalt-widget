import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { ExecuteResponse, Token, WalletConnector } from '../../..';
import {
  activeOperationIdAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  currentStepAtom,
  slippageAtom,
} from '../../../store/stateStore';
import { useHandleTransaction } from './useHandleTransaction';

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

  return {
    bestRoute,
    runTx,
    currentStep,
    isLoading,
    recentTransaction: bestRoute?.swaps[currentStep - 1],
    estimatedTime: bestRoute?.swaps[currentStep - 1].estimatedTimeInSeconds,
    fees: bestRoute?.swaps[currentStep - 1].fee
      .reduce((acc, fee) => {
        const amount = parseFloat(fee.amount);
        const price = fee.price || 0;
        return acc + amount * price;
      }, 0)
      .toFixed(2)
      .toString(),
  };
};
