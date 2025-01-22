import { Footer } from '../organisms/Footer';
import { Header } from '../organisms/Header';
import { ConnectWalletsModal } from '../standalones/modals/ConnectWalletsModal';
import ModalWrapper from '../standalones/modals/ModalWrapper';
import CustomStepper from '../standalones/stepper/Stepper';
import { SelectSwap } from '../standalones/swap/SelectSwap';

export { useModal } from '../../hooks/useModal';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from '../../theme/defaultTheme';
export { OpenModalButton } from '../atoms/buttons/OpenModalButton';

import { AnyaltWidgetProps } from '../..';
import { useAnyaltWidget } from '../../hooks/useAnyaltWidget';
import { SwappingWrapper } from '../organisms/SwappingWrapper/index';
import { RoutesWrapper } from '../standalones/routeWrap/RoutesWrapper';

export const AnyaltWidgetWrapper = ({
  isOpen,
  onClose,
  apiKey,
  inputToken,
  finalToken,
  estimateCallback,
  minAmountIn = 0,
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
    routeFailed,
    isValidAmountIn,
  } = useAnyaltWidget({
    estimateCallback,
    inputToken,
    finalToken,
    apiKey,
    minAmountIn,
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      size={activeStep === 1 ? '4xl' : 'lg'}
    >
      <Header />
      <CustomStepper activeStep={activeStep}>
        <SwappingWrapper
          loading={loading}
          title={'Select Deposit Token'}
          buttonText={'Get Quote'}
          onButtonClick={onGetQuote}
          onConfigClick={onConfigClick}
          routeFailed={routeFailed}
        >
          <SelectSwap
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
            isValidAmountIn={isValidAmountIn}
          />
        </SwappingWrapper>
        <SwappingWrapper
          loading={loading}
          title={'Calculation'}
          secondTitle="Routes"
          secondSubtitle="Please select preferred route"
          buttonText={
            activeRoute
              ? isSolanaConnected && isEvmConnected
                ? 'Start Transaction'
                : 'Connect Wallet/s To Start Transaction'
              : 'Get Quote'
          }
          onButtonClick={onChooseRouteButtonClick}
          onConfigClick={onConfigClick}
          routeFailed={routeFailed}
        >
          <RoutesWrapper
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
          />
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
        onConfirm={connectWalletsClose}
        title="Connect Wallet's"
      />
    </ModalWrapper>
  );
};
