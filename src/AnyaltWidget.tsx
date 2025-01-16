import { useState } from 'react';
import { Footer } from './components/organisms/Footer';
import { Header } from './components/organisms/Header';
import { SwappingWrapper } from './components/organisms/SwappingWrapper';
import ModalWrapper from './components/standalones/ModalWrapper';
import { useSteps } from './components/standalones/stepper/useSteps';
import { Token } from './types/types';

export { OpenModalButton } from './components/atoms/OpenModalButton';
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
  inputToken: Token;
  walletConnector: unknown;
  onClose: () => void;
};

export const AnyaltWidget = ({ isOpen, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const { activeStep, nextStep } = useSteps({ stepsAmount: 1 });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      size={activeStep === 1 ? '4xl' : 'lg'}
    >
      <Header />
      <SwappingWrapper
        activeStep={activeStep}
        loading={loading}
        title={loading ? 'Calculation' : 'Select Deposit Token'}
        buttonText={
          loading ? 'Connect Wallet/s To Start Transaction' : 'Get Quote'
        }
        onButtonClick={() => {
          setLoading(true);
          nextStep();
          console.log('clicking');
        }}
      />
      <Footer />
    </ModalWrapper>
  );
};
