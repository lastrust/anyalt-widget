import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnyaltWidget, defaultTheme } from '../src/AnyaltWidget';
import { OpenModalButton } from '../src/components/atoms/buttons/OpenModalButton';
import { useModal } from '../src/hooks/useModal';
import { ChainType, EstimateResponse } from '../src/types/types';

const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  const estimateCallback = async (amountIn: number): Promise<EstimateResponse> => {
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
              address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
              chainId: 1,
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
            minAmountIn={100}
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
