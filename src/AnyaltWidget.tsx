import { Footer } from './components/organisms/Footer';
import { Header } from './components/organisms/Header';
import { SwappingWrapper } from './components/organisms/SwappingWrapper';
import { ConnectWalletsModal } from './components/standalones/modals/ConnectWalletsModal';
import ModalWrapper from './components/standalones/modals/ModalWrapper';
import CustomStepper from './components/standalones/stepper/Stepper';
import { SelectSwap } from './components/standalones/swap/SelectSwap';
import { AppKitProvider } from './providers/RainbowKitProvider';
import { SolanaProvider } from './providers/SolanaProvider';
import { EstimateResponse, Token } from './types/types';

export { OpenModalButton } from './components/atoms/buttons/OpenModalButton';
export { useModal } from './hooks/useModal';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from './theme/defaultTheme';

import { RoutesWrapper } from './components/standalones/routeWrap/RoutesWrapper';
import { useAnyaltWidget } from './hooks/useAnyaltWidget';
import './style.css';

// TODO: As it's going to be mutliple steps widget with deposit it must accept all needed data to show for the last mile tx.
// TODO: check and prepare all needed data for the last mile tx.
type Props = {
  isOpen: boolean;
  inputToken: Token;
  finalToken: Token;
  walletConnector: unknown;
  apiKey: string;
  onClose: () => void;
  estimateCallback: (amountIn: number) => Promise<EstimateResponse>;
};

export const AnyaltWidget = ({
  isOpen,
  onClose,
  apiKey,
  inputToken,
  finalToken,
  estimateCallback,
}: Props) => {
  const {
    loading,
    activeRoute,
    activeStep,
    onCalculateButtonClick,
    onChooseRouteButtonClick,
    onConfigClick,
    goToNext,
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
    <AppKitProvider>
      <SolanaProvider>
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
                  ? 'Connect Wallet/s To Start Transaction'
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
            isOpen={isConnectWalletsOpen}
            onClose={() => {
              connectWalletsClose();
              goToNext();
            }}
            onConfirm={connectWalletsClose}
            title="Connect Wallet's"
          />
        </ModalWrapper>
      </SolanaProvider>
    </AppKitProvider>
  );
};
