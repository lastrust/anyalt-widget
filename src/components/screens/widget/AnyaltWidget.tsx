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
      size={activeStep === 0 || activeStep === 3 ? 'lg' : '5xl'}
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
          onConfigClick={onConfigClick}
          failedToFetchRoute={failedToFetchRoute}
          activeRoute={activeRoute}
          areWalletsConnected={areWalletsConnected}
          onChooseRouteButtonClick={onChooseRouteButtonClick}
          loading={loading}
          openSlippageModal={openSlippageModal}
          setOpenSlippageModal={setOpenSlippageModal}
          connectWalletsOpen={connectWalletsOpen}
        />
        <TransactionStep
          onConfigClick={onConfigClick}
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
      />
    </ModalWrapper>
  );
};
