import {
  AnyaltWidgetWrapper,
  defaultTheme,
  useModal,
} from './components/screens/widget/AnyaltWidget';
import { AppKitProvider } from './providers/RainbowKitProvider';
import { SolanaProvider } from './providers/SolanaProvider';

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

import { Provider } from 'jotai';
import { WidgetProvider } from './providers/WidgetProvider';
import './style.css';

export { defaultTheme, useModal, WidgetProvider };

export type AnyaltWidgetProps = {
  isOpen: boolean;
  inputToken: Token;
  finalToken: Token;
  walletConnector: unknown;
  apiKey: string;
  onClose: () => void;
  estimateCallback: (amountIn: number) => Promise<EstimateResponse>;
  executeCallBack: (amountIn: number) => Promise<ExecuteResponse>;
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
