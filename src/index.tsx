import { AnyaltWidgetWrapper } from './components/screens/widget/AnyaltWidget';
import { AppKitProvider } from './providers/RainbowKitProvider';
import { SolanaProvider } from './providers/SolanaProvider';
import { EstimateResponse, Token } from './types/types';

import './style.css';

export type AnyaltWidgetProps = {
  isOpen: boolean;
  inputToken: Token;
  finalToken: Token;
  walletConnector: unknown;
  apiKey: string;
  onClose: () => void;
  estimateCallback: (amountIn: number) => Promise<EstimateResponse>;
  minDepositAmount?: number;
};

export const AnyaltWidget = (props: AnyaltWidgetProps) => {
  return (
    <AppKitProvider>
      <SolanaProvider>
        <AnyaltWidgetWrapper {...props} />
      </SolanaProvider>
    </AppKitProvider>
  );
};
