import { AnyaltWidgetProps } from '../../..';
import { Footer } from '../../molecules/footer/Footer';
import { Header } from '../../molecules/header/Header';
import { ConnectWalletsModal } from '../../standalones/modals/connectWalletsModal/ConnectWalletsModal';
import ModalWrapper from '../../standalones/modals/ModalWrapper';
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
    activeRoute,
    isValidAmountIn,
    headerCustomText,
    isButtonDisabled,
    failedToFetchRoute,
    areWalletsConnected,
    isConnectWalletsOpen,
    modalWrapperMaxWidth,
    onBackClick,
    onComplete,
    resetState,
    onTxComplete,
    onConfigClick,
    setCurrentRoute,
    openSlippageModal,
    connectWalletsOpen,
    connectWalletsClose,
    setOpenSlippageModal,
    onChooseRouteButtonClick,
    showStuckTransactionDialog,
    showPendingOperationDialog,
    allNecessaryWalletsConnected,
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

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidthCustom={modalWrapperMaxWidth}
    >
      <Header activeStep={activeStep} customText={headerCustomText} />
      <HandlerTransactions
        walletConnector={walletConnector}
        showPendingOperationDialog={showPendingOperationDialog}
        showStuckTransactionDialog={showStuckTransactionDialog}
        allNecessaryWalletsConnected={allNecessaryWalletsConnected}
        resetState={resetState}
        connectWalletsOpen={connectWalletsOpen}
        setCurrentRoute={setCurrentRoute}
      >
        <Stepper activeStep={activeStep}>
          <SelectTokenStep
            loading={loading}
            widgetTemplate={widgetTemplate}
            isValidAmountIn={isValidAmountIn}
            isButtonDisabled={isButtonDisabled}
            failedToFetchRoute={failedToFetchRoute}
            onConfigClick={onConfigClick}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
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
            walletConnector={walletConnector}
            onBackClick={onBackClick}
            onTxComplete={onTxComplete}
            executeCallBack={executeCallBack}
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
        walletConnector={walletConnector}
        onClose={connectWalletsClose}
        areWalletsConnected={areWalletsConnected}
      />
    </ModalWrapper>
  );
};
