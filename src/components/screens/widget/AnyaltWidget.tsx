import { ConnectWalletsModal } from '../../standalones/modals/ConnectWalletsModal';
import ModalWrapper from '../../standalones/modals/ModalWrapper';
import CustomStepper from '../../standalones/stepper/Stepper';
import { SelectSwap } from '../../standalones/swap/SelectSwap';
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
import { RoutesWrapper } from '../../standalones/wrappers/RoutesWrapper';
import { SwappingWrapper } from '../../standalones/wrappers/SwappingWrapper';
import { TransactionSwap } from '../../standalones/wrappers/TransactionSwap';

export const AnyaltWidgetWrapper = ({
  isOpen,
  onClose,
  apiKey,
  inputToken,
  finalToken,
  estimateCallback,
  minDepositAmount = 0,
}: AnyaltWidgetProps) => {
  const {
    loading,
    activeRoute,
    activeStep,
    onGetQuote,
    onChooseRouteButtonClick,
    onConfigClick,
    isSolanaConnected,
    isEvmConnected,
    openSlippageModal,
    setOpenSlippageModal,
    isConnectWalletsOpen,
    connectWalletsClose,
    failedToFetchRoute,
    isValidAmountIn,
    connectWalletsConfirm,
    connectWalletsOpen,
    goToPrevious
  } = useAnyaltWidget({
    estimateCallback,
    inputToken,
    finalToken,
    apiKey,
    minDepositAmount,
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      size={activeStep === 0 ? 'lg' : '5xl'}
    >
      <Header>{activeStep === 2 ? 'Transaction' : 'Start Transaction'}</Header>
      <CustomStepper activeStep={activeStep}>
        <SwappingWrapper
          title={'Select Deposit Token'}
          onConfigClick={onConfigClick}
          failedToFetchRoute={failedToFetchRoute}
        >
          <SelectSwap
            buttonText={'Get Quote'}
            onButtonClick={onGetQuote}
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
            isValidAmountIn={isValidAmountIn}
          />
        </SwappingWrapper>
        <SwappingWrapper
          title={'Calculation'}
          secondTitle="Routes"
          secondSubtitle="Please select preferred route"
          onConfigClick={onConfigClick}
          failedToFetchRoute={failedToFetchRoute}
        >
          <RoutesWrapper
            buttonText={
              activeRoute
                ? isSolanaConnected && isEvmConnected
                  ? 'Start Transaction'
                  : 'Connect Wallet/s To Start Transaction'
                : 'Get Quote'
            }
            onButtonClick={onChooseRouteButtonClick}
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
            showConnectedWallets={true}
            handleWalletsOpen={connectWalletsOpen}
          />
        </SwappingWrapper>
        <SwappingWrapper
          failedToFetchRoute={false}
          onConfigClick={onConfigClick}
        >
          <TransactionSwap goToPrevious={goToPrevious}/>
        </SwappingWrapper>
      </CustomStepper>
      <Footer />
      <ConnectWalletsModal
        isSolanaConnected={isSolanaConnected}
        isEvmConnected={isEvmConnected}
        isOpen={isConnectWalletsOpen}
        onClose={() => {
          connectWalletsClose();
        }}
        onConfirm={connectWalletsConfirm}
        title="Connect Wallet's"
      />
    </ModalWrapper>
  );
};
