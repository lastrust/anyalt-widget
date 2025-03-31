import { BestRouteResponse } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import {
  EstimateResponse,
  Token,
  WalletConnector,
  WidgetTemplateType,
} from '../../..';
import {
  activeOperationIdAtom,
  bestRouteAtom,
  selectedRouteAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  showStuckTransactionDialogAtom,
  transactionIndexAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import { TransactionsProgress } from '../../../types/transaction';
import { convertSwapTransactionToTransactionProgress } from '../../../utils';
import { usePendingOperation } from '../../standalones/pendingOperationDialog/usePendingOperation';
import { useConfirmRoute } from './useConfirmRoute';
import { useControllWidget } from './useControllWidget';
import { useFetchRoutes } from './useFetchRoutes';
import { useSetupWidget } from './useSetupWidget';
import { useWidgetWallets } from './useWidgetWallets';

type Props = {
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  apiKey: string;
  swapResultToken: Token;
  finalToken?: Token;
  widgetTemplate: WidgetTemplateType;
  minDepositAmount: number;
  walletConnector?: WalletConnector;
  onClose: () => void;
};

type ReturnType = {
  loading: boolean;
  activeStep: number;
  activeRoute: BestRouteResponse | undefined;
  isValidAmountIn: boolean;
  isButtonDisabled: boolean;
  openSlippageModal: boolean;
  isConnectWalletsOpen: boolean;
  failedToFetchRoute: boolean;
  areWalletsConnected: boolean;
  showPendingOperationDialog: boolean;
  showStuckTransactionDialog: boolean;
  allNecessaryWalletsConnected: boolean;
  modalWrapperMaxWidth: string | undefined;
  headerCustomText: string | undefined;
  onBackClick: () => void;
  onComplete: () => void;
  onTxComplete: () => void;
  onConfigClick: () => void;
  connectWalletsOpen: () => void;
  connectWalletsClose: () => void;
  setOpenSlippageModal: (value: boolean) => void;
  onChooseRouteButtonClick: () => Promise<void>;
  setOperationToCurrentRoute: (operation: BestRouteResponse) => void;
  resetState: () => void;
};

export const useAnyaltWidget = ({
  apiKey,
  swapResultToken,
  finalToken,
  walletConnector,
  minDepositAmount,
  widgetTemplate,
  estimateCallback,
  onClose,
}: Props): ReturnType => {
  const selectedToken = useAtomValue(selectedTokenAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const showStuckTransactionDialog = useAtomValue(
    showStuckTransactionDialogAtom,
  );

  const [bestRoute, setBestRoute] = useAtom(bestRouteAtom);

  const setTransactionIndex = useSetAtom(transactionIndexAtom);
  const setActiveOperationId = useSetAtom(activeOperationIdAtom);
  const setTransactionsProgress = useSetAtom(transactionsProgressAtom);

  const { activeStep, setActiveStep, goToPrevious } = useSteps({
    index: 0,
  });
  const {
    isOpen: isConnectWalletsOpen,
    onClose: connectWalletsClose,
    onOpen: connectWalletsOpen,
  } = useDisclosure();

  const { showPendingOperationDialog, allNecessaryWalletsConnected } =
    usePendingOperation({ closeConnectWalletsModal: connectWalletsClose });

  const { modalWrapperMaxWidth, headerCustomText } = useSetupWidget({
    apiKey,
    activeStep,
    swapResultToken,
    finalToken,
    widgetTemplate,
  });

  const {
    evmAddress,
    solanaAddress,
    bitcoinAccount,
    areWalletsConnected,
    getChain,
  } = useWidgetWallets({
    walletConnector,
    isConnectWalletsOpen,
    connectWalletsClose,
  });

  const {
    loading,
    isValidAmountIn,
    failedToFetchRoute,
    onGetRoutes,
    setLoading,
    setListOfTransactionsFromRoute,
  } = useFetchRoutes({
    finalToken,
    activeStep,
    swapResultToken,
    minDepositAmount,
    setActiveStep,
    estimateCallback,
  });

  const {
    openSlippageModal,
    setOpenSlippageModal,
    resetState,
    onConfigClick,
    onBackClick,
    onTxComplete,
    onComplete,
  } = useControllWidget({
    activeStep,
    setActiveStep,
    onGetRoutes,
    goToPrevious,
    onClose,
  });

  const { onChooseRouteButtonClick } = useConfirmRoute({
    areWalletsConnected,
    evmAddress,
    solanaAddress,
    bitcoinAccount,
    widgetTemplate,
    walletConnector,
    connectWalletsOpen,
    connectWalletsClose,
    setActiveStep,
    setLoading,
    getChain,
  });

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

  //TODO: Should be refactored to handle it to handle selected route. Probably can be deleted
  useEffect(() => {
    if (selectedRoute) setBestRoute(selectedRoute);
  }, [selectedRoute]);

  const setOperationToCurrentRoute = useCallback(
    (operation: BestRouteResponse) => {
      setBestRoute(operation);
      setActiveOperationId(operation.operationId);
      setActiveStep(2);

      const newTransactionProgress = {} as TransactionsProgress;
      let lastFinishedTransactionIndex = 0;

      operation.swapSteps.forEach((step, index) => {
        step.transactions
          .sort(
            (a, b) =>
              (Number(a.confirmedTimestamp) || 0) -
              (Number(b.confirmedTimestamp) || 0),
          )
          .forEach((transaction) => {
            newTransactionProgress[index] = {};
            switch (transaction.type) {
              case 'MAIN':
                newTransactionProgress[index].swap =
                  convertSwapTransactionToTransactionProgress(
                    step,
                    transaction,
                  );

                if (
                  newTransactionProgress[index].swap?.status === 'confirmed'
                ) {
                  lastFinishedTransactionIndex = index + 1;
                }

                break;
              case 'APPROVE':
                newTransactionProgress[index].approve =
                  convertSwapTransactionToTransactionProgress(
                    step,
                    transaction,
                  );
                break;
              default:
                break;
            }
          });
      });

      setTransactionsProgress(newTransactionProgress);
      setTransactionIndex(lastFinishedTransactionIndex + 1);
      setListOfTransactionsFromRoute(
        operation,
        operation.swapSteps[operation.swapSteps.length - 1].destinationToken,
      );
    },
    [],
  );

  return {
    loading,
    activeStep,
    activeRoute: bestRoute,
    isValidAmountIn,
    isButtonDisabled,
    isConnectWalletsOpen,
    failedToFetchRoute,
    areWalletsConnected,
    onBackClick,
    onComplete,
    onTxComplete,
    onConfigClick,
    openSlippageModal,
    connectWalletsOpen,
    connectWalletsClose,
    setOpenSlippageModal,
    onChooseRouteButtonClick,
    setOperationToCurrentRoute,
    resetState,
    showPendingOperationDialog,
    showStuckTransactionDialog,
    allNecessaryWalletsConnected,
    modalWrapperMaxWidth,
    headerCustomText,
  };
};
