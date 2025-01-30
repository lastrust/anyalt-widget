import { Provider } from 'jotai';
import {
  AnyaltWidgetWrapper,
  defaultTheme,
  useModal,
} from './components/screens/widget/AnyaltWidget';
import { AppKitProvider } from './providers/RainbowKitProvider';
import { SolanaProvider } from './providers/SolanaProvider';
import { WalletsProviders } from './providers/WalletsProviders';
import { WidgetProvider } from './providers/WidgetProvider';
import './style.css';

export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  chainId?: number;
  decimals?: number;
  amount?: string;
  chainType: ChainType;
  logoUrl?: string;
}

export interface EstimateResponse {
  amountOut: string;
  priceInUSD: string;
}

export interface ExecuteResponse {
  approvalTxHash?: string;
  executeTxHash?: string;
  amountOut: string;
}

export interface WalletConnector {
  address: string;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: unknown) => Promise<string>;
  getChain: () => Promise<number>;
  switchChain: (chainId: number) => Promise<void>;
}

export { defaultTheme, useModal, WalletsProviders, WidgetProvider };

export type AnyaltWidgetProps = {
  isOpen: boolean;
  inputToken: Token;
  finalToken: Token;
  apiKey: string;
  onClose: () => void;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  executeCallBack: (token: Token) => Promise<ExecuteResponse>;
  walletConnector?: WalletConnector;
  minDepositAmount?: number;
};

export const AnyaltWidget = (props: AnyaltWidgetProps) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Provider>
      <AppKitProvider>
        <SolanaProvider>
          <AnyaltWidgetWrapper {...props} />
        </SolanaProvider>
      </AppKitProvider>
    </Provider>
  );
};
