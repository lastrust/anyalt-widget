import { useAtom } from 'jotai';
import { useRef } from 'react';
import { swapDataAtom, transactionIndexAtom } from '../../../store/stateStore';

export const useSwapState = () => {
  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [transactionIndex, setTransactionIndex] = useAtom(transactionIndexAtom);
  const swapDataRef = useRef(swapData);

  const updateTransactionIndex = () => {
    setTransactionIndex((prev) => prev + 1);
  };

  return {
    swapData,
    setSwapData,
    swapDataRef,
    transactionIndex,
    updateTransactionIndex,
  };
};
