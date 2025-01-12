import React, { FC, ReactNode } from "react";
import { Provider } from "./components/ui/provider";
import { Button } from "./components/ui/button";

enum ChainType {
  EVM = "EVM",
  SOLANA = "SOLANA",
}

interface Token {
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
    <Provider>
      <Button
        bgColor="teal.500"
        variant="solid"
        size="lg"
        borderRadius="10px"
        fontWeight="bold"
        color="white"
        padding="10px 20px"
      >
        Aarna Boilerplate
      </Button>
    </Provider>
  );
};

export default AarnaBoilerplate;
