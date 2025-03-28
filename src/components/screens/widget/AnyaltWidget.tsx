import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { AnyaltWidgetProps } from '../../..';
import { showStuckTransactionDialogAtom } from '../../../store/stateStore';
import { Footer } from '../../molecules/footer/Footer';
import { Header } from '../../molecules/header/Header';
import { ConnectWalletsModal } from '../../standalones/modals/connectWalletsModal/ConnectWalletsModal';
import ModalWrapper from '../../standalones/modals/ModalWrapper';
import { usePendingOperation } from '../../standalones/pendingOperationDialog/usePendingOperation';
import Stepper from '../../standalones/stepper/Stepper';
import { ChoosingRouteStep } from '../../standalones/steps/ChoosingRouteStep';
import { SelectTokenStep } from '../../standalones/steps/SelectTokenStep';
import { SuccessfulDepositStep } from '../../standalones/steps/SuccessfulDepositStep';
import { TransactionStep } from '../../standalones/steps/TransactionStep';
import { HandlerTransactions } from './TransactionHandler';
import { useAnyaltWidget } from './useAnyaltWidget';
export { useModal } from '../../../hooks/useModal';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from '../../../theme/defaultTheme';
export { OpenModalButton } from '../../atoms/buttons/OpenModalButton';

export const AnyaltWidgetWrapper = ({
  isOpen,
  onClose,
  apiKey,
  swapResultToken,
  finalToken,
  estimateCallback,
  executeCallBack,
  walletConnector,
  widgetTemplate = 'DEPOSIT_TOKEN',
  minDepositAmount = 0,
}: AnyaltWidgetProps) => {
  const {
    loading,
    activeStep,
    setOperationToCurrentRoute,
    activeRoute,
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
    resetState,
  } = useAnyaltWidget({
    apiKey,
    swapResultToken,
    finalToken,
    minDepositAmount,
    estimateCallback,
    walletConnector,
    widgetTemplate,
    onClose,
  });

  const { showPendingOperationDialog, allNecessaryWalletsConnected } =
    usePendingOperation({ closeConnectWalletsModal: connectWalletsClose });

  const showStuckTransactionDialog = useAtomValue(
    showStuckTransactionDialogAtom,
  );

  // Memoize values that determine rendering to prevent unnecessary re-renders
  const maxWidth = useMemo(() => {
    if (showPendingOperationDialog || showStuckTransactionDialog) {
      return '976px';
    }
    if (activeStep === 0 || activeStep === 3) {
      return '512px';
    }
    return '976px';
  }, [showPendingOperationDialog, showStuckTransactionDialog, activeStep]);

  const headerCustomText = useMemo(() => {
    if (showPendingOperationDialog || showStuckTransactionDialog) {
      return 'Transaction';
    }
    return undefined;
  }, [showPendingOperationDialog, showStuckTransactionDialog]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidthCustom={maxWidth}>
      <Header activeStep={activeStep} customText={headerCustomText} />
      <HandlerTransactions
        showPendingOperationDialog={showPendingOperationDialog}
        showStuckTransactionDialog={showStuckTransactionDialog}
        setOperationToCurrentRoute={setOperationToCurrentRoute}
        walletConnector={walletConnector}
        allNecessaryWalletsConnected={allNecessaryWalletsConnected}
        connectWalletsOpen={connectWalletsOpen}
        resetState={resetState}
      >
        <Stepper activeStep={activeStep}>
          <SelectTokenStep
            loading={loading}
            widgetTemplate={widgetTemplate}
            isValidAmountIn={isValidAmountIn}
            onConfigClick={onConfigClick}
            failedToFetchRoute={failedToFetchRoute}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
            isButtonDisabled={isButtonDisabled}
          />
          <ChoosingRouteStep
            loading={loading}
            activeRoute={activeRoute}
            walletConnector={walletConnector}
            failedToFetchRoute={failedToFetchRoute}
            areWalletsConnected={areWalletsConnected}
            onConfigClick={onConfigClick}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
            connectWalletsOpen={connectWalletsOpen}
            onChooseRouteButtonClick={onChooseRouteButtonClick}
          />
          <TransactionStep
            onBackClick={onBackClick}
            walletConnector={walletConnector}
            executeCallBack={executeCallBack}
            onTxComplete={onTxComplete}
            estimateCallback={estimateCallback}
          />
          <SuccessfulDepositStep
            onConfigClick={onConfigClick}
            onComplete={onComplete}
          />
        </Stepper>
      </HandlerTransactions>
      <Footer />
      <ConnectWalletsModal
        title="Connect Wallets"
        isOpen={isConnectWalletsOpen}
        onClose={connectWalletsClose}
        areWalletsConnected={areWalletsConnected}
        walletConnector={walletConnector}
      />
    </ModalWrapper>
  );
};
