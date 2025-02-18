import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { AnyaltWidgetProps } from '../../..';
import { inTokenAmountAtom, inTokenAtom } from '../../../store/stateStore';
import { Footer } from '../../molecules/footer/Footer';
import { Header } from '../../molecules/header/Header';
import { ConnectWalletsModal } from '../../standalones/modals/ConnectWalletsModal';
import ModalWrapper from '../../standalones/modals/ModalWrapper';
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
    onComplete,
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
  const inTokenAmount = useAtomValue(inTokenAmountAtom);
  const inToken = useAtomValue(inTokenAtom);

  const isButtonDisabled = useMemo(() => {
    return Number(inTokenAmount ?? 0) == 0 || inToken == null;
  }, [inTokenAmount, inToken]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      maxWidthCustom={activeStep === 0 || activeStep === 3 ? '512px' : '976px'}
    >
      <Header activeStep={activeStep} />
      <Stepper activeStep={activeStep}>
        <SelectTokenStep
          loading={loading}
          onGetQuote={onGetQuote}
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
        />
        <CompleteStep onConfigClick={onConfigClick} onComplete={onComplete} />
      </Stepper>
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
