import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { OpenModalButton } from '../src/components/atoms/buttons/OpenModalButton';
import { defaultTheme } from '../src/components/screens/widget/AnyaltWidget';
import { useModal } from '../src/hooks/useModal';
import { AnyaltWidget } from '../src/index';
import { ChainType, EstimateResponse } from '../src/types/types';

const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  const estimateCallback = async (
    amountIn: number,
  ): Promise<EstimateResponse> => {
    return {
      amountOut: '10.19',
      priceInUSD: '2423.53',
    };
  };

  return (
    <ChakraProvider theme={defaultTheme}>
      <Center h={'100vh'}>
        <Box maxW={'600px'}>
          <OpenModalButton onOpen={onOpen} />
          <AnyaltWidget
            walletConnector={{}}
            inputToken={{
              symbol: 'USDC',
              address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
              chainId: 42161,
              chainType: ChainType.EVM,
            }}
            finalToken={{
              symbol: 'Aarnâ Afi802',
              address: '0x123',
              chainId: 1,
              chainType: ChainType.EVM,
              logoUrl: 'https://engine.aarna.ai/static/logo-only.svg',
            }}
            apiKey={'pk_0xCYxjM8dFF0Vii7syrgpR6U4'}
            isOpen={isOpen}
            onClose={onClose}
            estimateCallback={estimateCallback}
            minDepositAmount={0}
          />
        </Box>
      </Center>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
