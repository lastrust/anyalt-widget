import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const [bestRoute, setBestRoute] = useAtom(bestRouteAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [selectedToken, setSelectedToken] = useAtom(selectedTokenAtom);
  const setTokenFetchError = useSetAtom(tokenFetchErrorAtom);
  const setTransactionsList = useSetAtom(transactionsListAtom);
  const setTransactionIndex = useSetAtom(transactionIndexAtom);
  const setActiveOperationId = useSetAtom(activeOperationIdAtom);
  const [selectedTokenAmount, setSelectedTokenAmount] = useAtom(
    selectedTokenAmountAtom,
  );
  const setTransactionsProgress = useSetAtom(transactionsProgressAtom);
  const setLastMileTokenEstimate = useSetAtom(lastMileTokenEstimateAtom);

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

  const isButtonDisabled = useMemo(() => {
    if (activeStep === 0) {
      return (
        Number(selectedTokenAmount ?? 0) == 0 ||
        selectedToken == null ||
        !bestRoute
      );
    }
    return Number(selectedTokenAmount ?? 0) == 0 || selectedToken == null;
  }, [selectedTokenAmount, selectedToken, bestRoute, activeStep]);

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
    isButtonDisabled,
    resetState,
    onComplete,
    onBackClick,
    onTxComplete,
    onConfigClick,
    openSlippageModal,
    setOpenSlippageModal,
  };
};
