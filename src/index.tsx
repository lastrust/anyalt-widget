import { AnyaltWidgetWrapper } from './components/screens/widget/AnyaltWidget';
import { AppKitProvider } from './providers/RainbowKitProvider';
import { SolanaProvider } from './providers/SolanaProvider';
import { EstimateResponse, ExecuteResponse, Token } from './types/types';

import { Provider } from 'jotai';
import './style.css';

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
