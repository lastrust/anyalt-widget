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
}: AnyaltWidgetProps) => {
  const {
    loading,
    activeRoute,
    activeStep,
    onCalculateButtonClick,
    onChooseRouteButtonClick,
    onConfigClick,
    isSolanaConnected,
    isEvmConnected,
    openSlippageModal,
    setOpenSlippageModal,
    isConnectWalletsOpen,
    connectWalletsClose,
  } = useAnyaltWidget({
    estimateCallback,
    inputToken,
    finalToken,
    apiKey,
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
          title={loading ? 'Calculation' : 'Select Deposit Token'}
          buttonText={'Get Quote'}
          onButtonClick={onCalculateButtonClick}
          onConfigClick={onConfigClick}
        >
          <SelectSwap
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
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
