import { Provider } from 'jotai';
import {
  AnyaltWidgetWrapper,
  defaultTheme,
  useModal,
} from './components/screens/widget/AnyaltWidget';
import { WalletsProviders } from './providers/WalletsProviders';
import { WidgetProvider } from './providers/WidgetProvider';
import { whiteTheme } from './theme/whiteTheme';
import { WidgetTemplateType } from './types/global';

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
  estimatedTimeInSeconds?: number;
  estimatedFeeInUSD?: string;
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

export {
  defaultTheme,
  useModal,
  WalletsProviders,
  whiteTheme,
  WidgetProvider,
  WidgetTemplateType,
};

export type AnyaltWidgetProps = {
  isOpen: boolean;
  apiKey: string;
  inputToken: Token;
  finalToken?: Token;
  minDepositAmount?: number;
  widgetTemplate?: WidgetTemplateType;
  walletConnector?: WalletConnector;
  onClose: () => void;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  executeCallBack: (token: Token) => Promise<ExecuteResponse>;
};

export const AnyaltWidget = (props: AnyaltWidgetProps) => {
  return (
    <Provider>
      <AnyaltWidgetWrapper {...props} />
    </Provider>
  );
};
