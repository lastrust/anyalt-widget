import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { OpenModalButton } from '../src/components/atoms/buttons/OpenModalButton';
import { defaultTheme } from '../src/components/screens/widget/AnyaltWidget';
import { useModal } from '../src/hooks/useModal';
import { AnyaltWidget } from '../src/index';
import { ChainType, EstimateResponse, ExecuteResponse } from '../src/types/types';

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

  const executeCallBack = async (amountIn: number): Promise<ExecuteResponse> => {
    console.log('amountIn: ', amountIn);
    return {
      approvalTxHash: '0x123',
      executeTxHash: '0x123',
      amountOut: '10.19',
    };
  }

  return (
    <ChakraProvider theme={defaultTheme}>
      <Center h={'100vh'}>
        <Box maxW={'600px'}>
          <OpenModalButton onOpen={onOpen} />
          <AnyaltWidget
            walletConnector={{}}
            inputToken={{
              symbol: 'USDT',
              address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
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
            executeCallBack={executeCallBack}
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
