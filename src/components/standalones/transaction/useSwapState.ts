import { useAtom } from 'jotai';
import { swapDataAtom, transactionIndexAtom } from '../../../store/stateStore';

export const useSwapState = () => {
  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [transactionIndex, setTransactionIndex] = useAtom(transactionIndexAtom);

  const updateTransactionIndex = () => {
    setTransactionIndex((prev) => prev + 1);
  };

  return {
    swapData,
    setSwapData,
    transactionIndex,
    updateTransactionIndex,
  };
};
