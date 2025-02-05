import { ConnectWalletsModal } from '../../standalones/modals/ConnectWalletsModal';
import ModalWrapper from '../../standalones/modals/ModalWrapper';
import CustomStepper from '../../standalones/stepper/Stepper';
import { Footer } from '../../standalones/widget/Footer';
import { Header } from '../../standalones/widget/Header';

export { useModal } from '../../../hooks/useModal';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from '../../../theme/defaultTheme';
export { OpenModalButton } from '../../atoms/buttons/OpenModalButton';

import { AnyaltWidgetProps } from '../../..';
import { useAnyaltWidget } from '../../../hooks/useAnyaltWidget';
import { ChoosingRouteStep } from '../../standalones/steps/ChoosingRouteStep';
import { CompleteStep } from '../../standalones/steps/CompleteStep';
import { SelectTokenStep } from '../../standalones/steps/SelectTokenStep';
import { TransactionStep } from '../../standalones/steps/TransactionStep';

export const AnyaltWidgetWrapper = ({
  isOpen,
  onClose,
  apiKey,
  inputToken,
  finalToken,
  estimateCallback,
  executeCallBack,
  walletConnector,
  minDepositAmount = 0,
}: AnyaltWidgetProps) => {
  const {
    loading,
    activeRoute,
    activeStep,
    onGetQuote,
    onChooseRouteButtonClick,
    onConfigClick,
    openSlippageModal,
    setOpenSlippageModal,
    isConnectWalletsOpen,
    connectWalletsClose,
    failedToFetchRoute,
    isValidAmountIn,
    connectWalletsOpen,
    onBackClick,
    onTxComplete,
    areWalletsConnected,
    setActiveStep,
  } = useAnyaltWidget({
    apiKey,
    inputToken,
    finalToken,
    minDepositAmount,
    estimateCallback,
    walletConnector,
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidthCustom={activeStep === 0 || activeStep === 3 ? '530px' : '1000px'}
    >
      <Header activeStep={activeStep} onBackClick={onBackClick} />
      <CustomStepper activeStep={activeStep}>
        <SelectTokenStep
          loading={loading}
          onGetQuote={onGetQuote}
          isValidAmountIn={isValidAmountIn}
          onConfigClick={onConfigClick}
          failedToFetchRoute={failedToFetchRoute}
          openSlippageModal={openSlippageModal}
          setOpenSlippageModal={setOpenSlippageModal}
        />
        <ChoosingRouteStep
          loading={loading}
          activeRoute={activeRoute}
          walletConnector={walletConnector}
          failedToFetchRoute={failedToFetchRoute}
          areWalletsConnected={areWalletsConnected}
          onGetQuote={onGetQuote}
          onConfigClick={onConfigClick}
          openSlippageModal={openSlippageModal}
          setOpenSlippageModal={setOpenSlippageModal}
          connectWalletsOpen={connectWalletsOpen}
          onChooseRouteButtonClick={onChooseRouteButtonClick}
        />
        <TransactionStep
          walletConnector={walletConnector}
          executeCallBack={executeCallBack}
          onTxComplete={onTxComplete}
        />
        <CompleteStep
          onConfigClick={onConfigClick}
          onClose={onClose}
          setActiveStep={setActiveStep}
        />
      </CustomStepper>
      <Footer />
      <ConnectWalletsModal
        title="Connect Wallet's"
        isOpen={isConnectWalletsOpen}
        onClose={connectWalletsClose}
        areWalletsConnected={areWalletsConnected}
        walletConnector={walletConnector}
      />
    </ModalWrapper>
  );
};
