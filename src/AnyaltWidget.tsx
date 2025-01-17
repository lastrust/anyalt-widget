import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Footer } from './components/organisms/Footer';
import { Header } from './components/organisms/Header';
import { SwappingWrapper } from './components/organisms/SwappingWrapper';
import { ConnectWalletsModal } from './components/standalones/modals/ConnectWalletsModal';
import ModalWrapper from './components/standalones/modals/ModalWrapper';
import { SelectSwap } from './components/standalones/selectSwap/SelectSwap';
import CustomStepper from './components/standalones/stepper/Stepper';
import { useSteps } from './components/standalones/stepper/useSteps';
import { AppKitProvider } from './providers/RainbowKitProvider';
import { SolanaProvider } from './providers/SolanaProvider';
import { Token } from './types/types';
import { RoutesWrapper } from './components/standalones/routesWrap/RoutesWrapper';

export { OpenModalButton } from './components/atoms/buttons/OpenModalButton';
export { useModal } from './hooks/useModal';
export { WidgetProvider } from './providers/WidgetProvider';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from './theme/defaultTheme';

// TODO: As it's going to be mutliple steps widget with deposit it must accept all needed data to show for the last mile tx.
// TODO: check and prepare all needed data for the last mile tx.
type Props = {
  logo: string;
  isOpen: boolean;
  inputToken?: Token;
  walletConnector: unknown;
  onClose: () => void;
};

export const AnyaltWidget = ({ isOpen, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const { activeStep, nextStep } = useSteps({ stepsAmount: 1 });
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();

  const handleConfirm = () => {
    setLoading(true);
    nextStep();
  };

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
              title={loading ? 'Calculation' : 'Select Deposit Token'}
              buttonText={
                loading ? 'Connect Wallet/s To Start Transaction' : 'Get Quote'
              }
              onButtonClick={onConfirmationOpen}
            >
              <SelectSwap loading={loading} />
            </SwappingWrapper>
            <SwappingWrapper
              title={loading ? 'Calculation' : 'Select Deposit Token'}
              secondTitle="Routes"
              secondSubtitle="Please select preferred route"
              buttonText={
                loading ? 'Connect Wallet/s To Start Transaction' : 'Get Quote'
              }
              onButtonClick={() => {
                setLoading(true);
                nextStep();
                console.log('clicking');
              }}
            >
              <RoutesWrapper loading={loading} />
            </SwappingWrapper>
          </CustomStepper>
          <Footer />
          <ConnectWalletsModal
            isOpen={isConfirmationOpen}
            onClose={onConfirmationClose}
            onConfirm={handleConfirm}
            title="Connect Wallet's"
          />
        </ModalWrapper>
      </SolanaProvider>
    </AppKitProvider>
  );
};
