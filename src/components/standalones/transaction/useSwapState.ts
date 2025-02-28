import { useAtom } from 'jotai';
import { useRef } from 'react';
import {
  swapDataAtom,
  transactionIndexAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import {
  TransactionProgress,
  TransactionsProgress,
} from '../../../types/transaction';

export const useSwapState = () => {
  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [, setTransactionsProgress] = useAtom(transactionsProgressAtom);
  const [transactionIndex, setTransactionIndex] = useAtom(transactionIndexAtom);
  const swapDataRef = useRef(swapData);

  const updateTransactionIndex = () => {
    swapDataRef.current.currentStep = swapDataRef.current.currentStep + 1;
    setTransactionIndex((prev) => prev + 1);
  };

  const updateTransactionProgress = (progress: TransactionProgress) => {
    setTransactionsProgress((prev) => {
      const newProgress: TransactionsProgress = prev || {};
      const index = swapDataRef.current.currentStep - 1;
      const txType = progress.isApproval ? 'approve' : 'swap';

      newProgress[index] = {
        ...newProgress[index],
        [txType]: progress,
      };

      return { ...newProgress };
    });
  };

  return {
    swapData,
    setSwapData,
    swapDataRef,
    transactionIndex,
    updateTransactionIndex,
    updateTransactionProgress,
  };
};
