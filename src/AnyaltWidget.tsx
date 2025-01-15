import { FC } from 'react';
import { Container } from './components/organisms/Container';
import { Footer } from './components/organisms/Footer';
import { Header } from './components/organisms/Header';
import ModalWrapper from './components/standalones/ModalWrapper';

export { ChakraProvider as UIProvider } from '@chakra-ui/react';
export { OpenModalButton } from './components/atoms/OpenModalButton';
export { useModal } from './hooks/useModal';
export { defaultTheme } from './theme/defaultTheme';

export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
}

export interface Token {
  address: string;
  chainId: number;
  chainType: ChainType;
}

interface AnyaltWidgetProps {
  logo: string;
  walletConnector: unknown;
  inputToken: Token;
  isOpen: boolean;
  onClose: () => void;
}

const AnyaltWidget: FC<AnyaltWidgetProps> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <Header />
      <Container />
      <Footer />
    </ModalWrapper>
  );
};

export default AnyaltWidget;
