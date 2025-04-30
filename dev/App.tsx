import { Box, Center } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { OpenModalButton } from '../src/components/atoms/buttons/OpenModalButton';
import { useModal } from '../src/hooks/useModal';
import {
  AnyaltWidget,
  ChainType,
  EstimateResponse,
  ExecuteResponse,
  Token,
  whiteTheme,
  WidgetProvider,
} from '../src/index';

import '@fontsource/rethink-sans/400.css';
import '@fontsource/rethink-sans/500.css';
import '@fontsource/rethink-sans/600.css';

// import '@fontsource/poppins/400.css';
// import '@fontsource/poppins/500.css';
// import '@fontsource/poppins/600.css';

import '@rainbow-me/rainbowkit/styles.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient();

const USDT_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
const AAVE_USDT_ADDRESS = '0x6ab707Aca953eDAeFBc4fD23bA73294241490620';
const AAVE_L3_POOL_ADDRESS = '0x794a61358D6845594F94dc1DB02A252b5b4814aD';

const usdtToken: Token = {
  symbol: 'USDT',
  address: USDT_ADDRESS,
  chainId: 42161,
  name: 'USDT',
  chainType: ChainType.EVM,
};

const popkittyToken: Token = {
  name: 'Popkitty',
  symbol: 'POPKITTY',
  address: 'GB8V6tFBN6QZCEFdEjsntGu7kT8C5cHHn13dcwgtnPZU',
  chainType: ChainType.SOLANA,
  logoUrl:
    'https://img-v1.raydium.io/icon/GB8V6tFBN6QZCEFdEjsntGu7kT8C5cHHn13dcwgtnPZU.png',
};

const aarnaToken: Token = {
  symbol: 'Aarnâ Afi802',
  address: '0x123',
  chainId: 42161,
  chainType: ChainType.EVM,
  logoUrl: 'https://engine.aarna.ai/static/logo-only.svg',
  name: 'Aarna Afi802',
  decimals: 18,
};

const baseETH: Token = {
  symbol: 'ETH',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 8453,
  chainType: ChainType.EVM,
  logoUrl: 'https://rango.vip/tokens/ALL/ETH.png',
  name: 'Ethereum',
  decimals: 18,
};

const brettToken: Token = {
  symbol: 'BRETT',
  address: '0x532f27101965dd16442e59d40670faf5ebb142e4',
  chainId: 8453,
  chainType: ChainType.EVM,
  logoUrl:
    'https://tokens.debridge.finance/Logo/8453/0x532f27101965dd16442e59d40670faf5ebb142e4/small/token-logo.png',
  name: 'Brett',
  decimals: 18,
};

const App = () => {
  const { isOpen, onOpen, onClose } = useModal();
  const isTokenBuyTemplate = true;

  const estimateCallback = async (token: Token): Promise<EstimateResponse> => {
    return {
      amountOut: (parseFloat(token.amount ?? '0') * 10).toFixed(2),
      priceInUSD: '2423.530000000',
      estimatedTimeInSeconds: 10,
      estimatedFeeInUSD: '0.01',
    };
  };

  const executeCallBack = async (token: Token): Promise<ExecuteResponse> => {
    return new Promise((resolve, reject) => {
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
      <WidgetProvider theme={whiteTheme}>
        <Center h={'100vh'}>
          <Box maxW={'600px'}>
            <OpenModalButton onOpen={onOpen} />
            <AnyaltWidget
              widgetTemplate={'DEPOSIT_TOKEN'}
              swapResultToken={usdtToken}
              // swapResultToken={brettToken}
              finalToken={aarnaToken}
              apiKey={'pk_0xCYxjM8dFF0Vii7syrgpR6U4'}
              isOpen={isOpen}
              onClose={onClose}
              estimateCallback={estimateCallback}
              executeCallBack={executeCallBack}
              minDepositAmount={0}
            />
          </Box>
        </Center>
      </WidgetProvider>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
