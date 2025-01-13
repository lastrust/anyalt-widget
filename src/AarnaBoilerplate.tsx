import React, { FC } from "react";
import { Header } from "./components/organisms/Header";
import { Container } from "./components/organisms/Container";
import { Footer } from "./components/organisms/Footer";
import { Box, ChakraProvider } from '@chakra-ui/react'

export enum ChainType {
  EVM = "EVM",
  SOLANA = "SOLANA",
}

export interface Token {
  address: string;
  chainId: number;
  chainType: ChainType;
}

interface AarnaBoilerplateProps {
  logo: string;
  walletConnector: any;
  inputToken: Token;
}

const AarnaBoilerplate: FC<AarnaBoilerplateProps> = ({ 
  logo,
  walletConnector,
  inputToken,
}) => {
  return (
    <ChakraProvider>
      <Box
        padding="40px"
        border="1px solid #919eab1f"
        borderRadius="12px"
        minWidth="528px"
        bgColor="#121212"
      >
        <Header />
        <Container />
        <Footer />
      </Box>
    </ChakraProvider>
  );
};

export default AarnaBoilerplate;
