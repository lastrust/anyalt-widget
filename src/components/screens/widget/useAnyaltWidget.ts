import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import {
  EstimateResponse,
  Token,
  WalletConnector,
  WidgetTemplateType,
} from '../../..';
import {
  allRoutesAtom,
  showStuckTransactionDialogAtom,
} from '../../../store/stateStore';
import { usePendingOperation } from '../../standalones/pendingOperationDialog/usePendingOperation';
import { useConfirmRoute } from './useConfirmRoute';
import { useControllWidget } from './useControllWidget';
import { useFetchRoutes } from './useFetchRoutes';
import { useSetRoute } from './useSetRoute';
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
  allRoutes: GetAllRoutesResponseItem[] | undefined;
  isValidAmountIn: boolean;
  isButtonDisabled: boolean;
  openSlippageModal: boolean;
  isConnectWalletsOpen: boolean;
  failedToFetchRoute: boolean;
  areWalletsConnected: boolean;
  showPendingRouteDialog: boolean;
  showStuckTransactionDialog: boolean;
  allNecessaryWalletsConnected: boolean;
  modalWrapperMaxWidth: string | undefined;
  headerCustomText: string | undefined;
  onBackClick: () => void;
  resetState: () => void;
  onComplete: () => void;
  onTxComplete: () => void;
  onConfigClick: () => void;
  connectWalletsOpen: () => void;
  connectWalletsClose: () => void;
  setOpenSlippageModal: (value: boolean) => void;
  onChooseRouteButtonClick: () => Promise<void>;
  setCurrentRoute: (route: GetAllRoutesResponseItem) => void;
  estimateOutPut: (
    route: GetAllRoutesResponseItem,
  ) => Promise<EstimateResponse>;
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
  const [allRoutes] = useAtom(allRoutesAtom);
  const showStuckTransactionDialog = useAtomValue(
    showStuckTransactionDialogAtom,
  );

  const {
    isOpen: isConnectWalletsOpen,
    onClose: connectWalletsClose,
    onOpen: connectWalletsOpen,
  } = useDisclosure();
  const { activeStep, setActiveStep, goToPrevious } = useSteps({
    index: 0,
  });

  const { showPendingRouteDialog, allNecessaryWalletsConnected } =
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
    estimateOutPut,
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
    isButtonDisabled,
    resetState,
    onConfigClick,
    onBackClick,
    onTxComplete,
    onComplete,
    openSlippageModal,
    setOpenSlippageModal,
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

  //TODO: Should be refactored to handle it to handle selected route. Probably can be deleted
  // useEffect(() => {
  //   if (selectedRoute) setAllRoutes(selectedRoute);
  // }, [selectedRoute]);

  const { setCurrentRoute } = useSetRoute({
    setActiveStep,
    setListOfTransactionsFromRoute,
  });

  return {
    loading,
    activeStep,
    allRoutes,
    isValidAmountIn,
    isButtonDisabled,
    headerCustomText,
    isConnectWalletsOpen,
    failedToFetchRoute,
    areWalletsConnected,
    modalWrapperMaxWidth,
    showPendingRouteDialog,
    showStuckTransactionDialog,
    allNecessaryWalletsConnected,
    onBackClick,
    onComplete,
    resetState,
    onTxComplete,
    onConfigClick,
    estimateOutPut,
    setCurrentRoute,
    openSlippageModal,
    connectWalletsOpen,
    connectWalletsClose,
    setOpenSlippageModal,
    onChooseRouteButtonClick,
  };
};
