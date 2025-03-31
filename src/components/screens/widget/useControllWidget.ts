import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import {
  activeOperationIdAtom,
  bestRouteAtom,
  currentStepAtom,
  lastMileTokenEstimateAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  swapDataAtom,
  tokenFetchErrorAtom,
  transactionIndexAtom,
  transactionsListAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';

type ControllWidgetProps = {
  activeStep: number;
  onGetRoutes: (isFirstFetch: boolean) => Promise<void>;
  setActiveStep: (step: number) => void;
  onClose: () => void;
  goToPrevious: VoidFunction;
};

export const useControllWidget = ({
  activeStep,
  onClose,
  onGetRoutes,
  goToPrevious,
  setActiveStep,
}: ControllWidgetProps) => {
  const [openSlippageModal, setOpenSlippageModal] = useState(false);

  const [, setBestRoute] = useAtom(bestRouteAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [, setSelectedToken] = useAtom(selectedTokenAtom);
  const [, setTokenFetchError] = useAtom(tokenFetchErrorAtom);
  const [, setTransactionsList] = useAtom(transactionsListAtom);
  const [, setTransactionIndex] = useAtom(transactionIndexAtom);
  const [, setActiveOperationId] = useAtom(activeOperationIdAtom);
  const [, setSelectedTokenAmount] = useAtom(selectedTokenAmountAtom);
  const [, setTransactionsProgress] = useAtom(transactionsProgressAtom);
  const [, setLastMileTokenEstimate] = useAtom(lastMileTokenEstimateAtom);

  const resetState = useCallback(() => {
    setActiveStep(0);
    setActiveOperationId(undefined);
    setLastMileTokenEstimate(undefined);
    setTransactionsList(undefined);
    setSelectedTokenAmount(undefined);
    setSelectedToken(undefined);
    setTokenFetchError({ isError: false, errorMessage: '' });
    setBestRoute(undefined);
    setSwapData({
      swapIsFinished: false,
      isCrosschainSwapError: false,
      crosschainSwapOutputAmount: '',
      totalSteps: 0,
      currentStep: 1,
    });
    setTransactionsProgress({});
    setTransactionIndex(1);
    localStorage.removeItem('operationId');
    localStorage.removeItem('tokenBuyOperationId');
  }, [
    setActiveOperationId,
    setActiveOperationId,
    setLastMileTokenEstimate,
    setTransactionsList,
    setSelectedTokenAmount,
    setSelectedToken,
    setTokenFetchError,
    setBestRoute,
    setSwapData,
    setTransactionsProgress,
    setTransactionIndex,
  ]);

  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);

  const onConfigClick = () => {
    setOpenSlippageModal(true);
  };

  const onBackClick = () => {
    if (activeStep === 2) {
      setActiveStep(1);
      onGetRoutes(false);
      setSwapData({
        ...swapData,
        swapIsFinished: false,
        isCrosschainSwapError: false,
      });
    } else {
      goToPrevious();
    }
  };

  const onTxComplete = () => {
    setActiveStep(3);
  };

  const onComplete = () => {
    onClose();
    setActiveStep(0);
    setTransactionIndex(1);
    resetState();
  };

  return {
    resetState,
    onComplete,
    onBackClick,
    onTxComplete,
    onConfigClick,
    openSlippageModal,
    setOpenSlippageModal,
  };
};
