import { useEffect } from 'react';
import { AnyaltWidgetProps, ChainType } from '../../..';
import { Footer } from '../../molecules/footer/Footer';
import { Header } from '../../molecules/header/Header';
import { ConnectWalletsModal } from '../../standalones/modals/ConnectWalletsModal';
import ModalWrapper from '../../standalones/modals/ModalWrapper';
import { PendingOperation } from '../../standalones/pendingOperation';
import Stepper from '../../standalones/stepper/Stepper';
import { ChoosingRouteStep } from '../../standalones/steps/ChoosingRouteStep';
import { CompleteStep } from '../../standalones/steps/CompleteStep';
import { SelectTokenStep } from '../../standalones/steps/SelectTokenStep';
import { TransactionStep } from '../../standalones/steps/TransactionStep';
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
  inputToken,
  finalToken,
  estimateCallback,
  executeCallBack,
  walletConnector,
  isTokenBuyTemplate = false,
  minDepositAmount = 0,
}: AnyaltWidgetProps) => {
  const {
    loading,
    activeStep,
    activeRoute,
    pendingOperation,
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
    showPendingOperationDialog,
  } = useAnyaltWidget({
    apiKey,
    inputToken,
    finalToken,
    minDepositAmount,
    estimateCallback,
    walletConnector,
    isTokenBuyTemplate,
    onClose,
  });

  useEffect(() => {
    console.debug('ACtiveswap', activeStep);
  }, [activeStep]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidthCustom={
        (activeStep === 0 || activeStep === 3) && !showPendingOperationDialog
          ? '512px'
          : '976px'
      }
    >
      <Header activeStep={activeStep} />
      {showPendingOperationDialog ? (
        <PendingOperation
          pendingOperation={pendingOperation!}
          destinationToken={{
            ...pendingOperation!.swapSteps![
              pendingOperation!.swapSteps!.length - 1
            ].destinationToken!,
            address:
              pendingOperation!.swapSteps![
                pendingOperation!.swapSteps!.length - 1
              ].destinationToken!.contractAddress,
            chainType: pendingOperation!.swapSteps![
              pendingOperation!.swapSteps!.length - 1
            ].destinationToken!.chainType as ChainType,
          }}
        />
      ) : (
        <Stepper activeStep={showPendingOperationDialog ? 0 : activeStep}>
          <SelectTokenStep
            loading={loading}
            isTokenBuyTemplate={isTokenBuyTemplate}
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
          <CompleteStep onConfigClick={onConfigClick} onComplete={onComplete} />
        </Stepper>
      )}
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
