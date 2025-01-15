import React, { FC } from 'react';
import { Header } from './components/organisms/Header';
import { Container } from './components/organisms/Container';
import { Footer } from './components/organisms/Footer';
import { ChakraProvider, Theme } from '@chakra-ui/react';
import { defaultTheme } from './theme/defaultTheme';
import ModalWrapper from './components/standalones/ModalWrapper';

export { OpenModalButton } from './components/atoms/OpenModalButton';
export { useModal } from './hooks/useModal';
export { ChakraProvider as UIProvider } from '@chakra-ui/react';
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
  theme?: Partial<Theme>;
  isOpen: boolean;
  onClose: () => void;
}


const AnyaltWidget: FC<AnyaltWidgetProps> = ({
  theme = defaultTheme,
  isOpen,
  onClose,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <Header />
      <Container />
      <Footer />
    </ModalWrapper>
  );
};

export default AnyaltWidget;
