import React, { FC } from 'react';
import { Header } from './components/organisms/Header';
import { Container } from './components/organisms/Container';
import { Footer } from './components/organisms/Footer';
import { Box, ChakraProvider, Theme } from '@chakra-ui/react';
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
  walletConnector: any;
  inputToken: Token;
  theme?: Partial<Theme>;
}

const AnyaltWidget: FC<AnyaltWidgetProps> = ({ theme = defaultTheme }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box
        padding="40px"
        border="1px solid"
        borderRadius="12px"
        minWidth="528px"
        bgColor="brand.primary"
      >
        <Header />
        <Container />
        <Footer />
      </Box>
    </ChakraProvider>
  );
};

export default AnyaltWidget;
