import React, { FC } from 'react';
import { Header } from './components/organisms/Header';
import { Container } from './components/organisms/Container';
import { Footer } from './components/organisms/Footer';
import {
  Box,
  ChakraProvider,
  Theme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';
import { defaultTheme } from './theme/defaultTheme';

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
    <ChakraProvider theme={theme}>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="brand.primary" maxW="528px">
          <ModalCloseButton color="white" />
          <Box padding="40px">
            <Header />
            <Container />
            <Footer />
          </Box>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default AnyaltWidget;
