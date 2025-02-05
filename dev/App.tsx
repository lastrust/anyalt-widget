import { Box, Center } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { OpenModalButton } from '../src/components/atoms/buttons/OpenModalButton';
import { useModal } from '../src/hooks/useModal';
import {
  AnyaltWidget,
  ChainType,
  defaultTheme,
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletsProviders,
  WidgetProvider,
} from '../src/index';

import '@fontsource/rethink-sans/400.css';
import '@fontsource/rethink-sans/500.css';
import '@fontsource/rethink-sans/600.css';
import '@rainbow-me/rainbowkit/styles.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient();

const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  const estimateCallback = async (token: Token): Promise<EstimateResponse> => {
    console.log('token: ');
    return {
      amountOut: '10.19',
      priceInUSD: '2423.53',
    };
  };

  const executeCallBack = async (token: Token): Promise<ExecuteResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          approvalTxHash: '0x123',
          executeTxHash: '0x123',
          amountOut: '10.19',
        });
      }, 10000);
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider theme={defaultTheme}>
        <WalletsProviders>
          <Center h={'100vh'}>
            <Box maxW={'600px'}>
              <OpenModalButton onOpen={onOpen} />
              <AnyaltWidget
                inputToken={{
                  symbol: 'USDT',
                  address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
                  chainId: 42161,
                  chainType: ChainType.EVM,
                  name: 'Arbitrum',
                  decimals: 18,
                }}
                finalToken={{
                  symbol: 'Aarnâ Afi802',
                  address: '0x123',
                  chainId: 1,
                  chainType: ChainType.EVM,
                  logoUrl: 'https://engine.aarna.ai/static/logo-only.svg',
                  name: 'Arbitrum',
                  decimals: 18,
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
        </WalletsProviders>
      </WidgetProvider>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
