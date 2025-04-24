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
import { HandleTransactions } from './HandleTransactions';
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
    allRoutes,
    activeStep,
    isValidAmountIn,
    headerCustomText,
    isButtonDisabled,
    failedToFetchRoute,
    areWalletsConnected,
    isConnectWalletsOpen,
    modalWrapperMaxWidth,
    showPendingRouteDialog,
    shouldFetchCryptoRoutes,
    showStuckTransactionDialog,
    allNecessaryWalletsConnected,
    onBackClick,
    onComplete,
    resetState,
    estimateOutPut,
    onTxComplete,
    onConfigClick,
    setCurrentRoute,
    openSlippageModal,
    connectWalletsOpen,
    connectWalletsClose,
    setOpenSlippageModal,
    onChooseRouteButtonClick,
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
      <HandleTransactions
        walletConnector={walletConnector}
        showPendingRouteDialog={showPendingRouteDialog}
        shouldFetchCryptoRoutes={shouldFetchCryptoRoutes}
        showStuckTransactionDialog={showStuckTransactionDialog}
        allNecessaryWalletsConnected={allNecessaryWalletsConnected}
        resetState={resetState}
        setCurrentRoute={setCurrentRoute}
        connectWalletsOpen={connectWalletsOpen}
        onChooseRouteButtonClick={onChooseRouteButtonClick}
      >
        <Stepper activeStep={activeStep}>
          <SelectTokenStep
            loading={loading}
            activeStep={activeStep}
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
            activeStep={activeStep}
            allRoutes={allRoutes}
            walletConnector={walletConnector}
            failedToFetchRoute={failedToFetchRoute}
            areWalletsConnected={areWalletsConnected}
            onConfigClick={onConfigClick}
            estimateOutPut={estimateOutPut}
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
      </HandleTransactions>
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
