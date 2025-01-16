import { useState } from 'react';
import { Footer } from './components/organisms/Footer';
import { Header } from './components/organisms/Header';
import { SwappingWrapper } from './components/organisms/SelectDepositToken';
import ModalWrapper from './components/standalones/ModalWrapper';
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
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <Header />
      <SwappingWrapper
        loading={loading}
        title={loading ? 'Calculation' : 'Select Deposit Token'}
        buttonText="Connect Wallet/s To Start Transaction"
        onButtonClick={() => {
          setLoading(true);
          console.log('clicking');
        }}
      />
      <Footer />
    </ModalWrapper>
  );
};
