import { Provider } from 'jotai';
import {
  AnyaltWidgetWrapper,
  defaultTheme,
  useModal,
} from './components/screens/widget/AnyaltWidget';
import { AppKitProvider } from './providers/RainbowKitProvider';
import { SolanaProvider } from './providers/SolanaProvider';
import { WidgetProvider } from './providers/WidgetProvider';
import './style.css';

export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
}

export interface Token {
  symbol: string;
  address: string;
  chainId?: number;
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
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: unknown) => Promise<string>;
  getChain: () => Promise<number>;
  switchChain: (chainId: number) => Promise<void>;
}

export { defaultTheme, useModal, WidgetProvider };

export type AnyaltWidgetProps = {
  isOpen: boolean;
  inputToken: Token;
  finalToken: Token;
  walletConnector: WalletConnector;
  apiKey: string;
  onClose: () => void;
  estimateCallback: (amount: string) => Promise<EstimateResponse>;
  executeCallBack: (amount: string) => Promise<ExecuteResponse>;
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
