import { ReactNode } from 'react';
import { BitcoinProvider } from './BitcoinProvider';
import { AppKitProvider } from './RainbowKitProvider';
import { SolanaProvider } from './SolanaProvider';

type Props = {
  children: ReactNode;
  solanaRpcUrl?: string;
};

export const WalletsProviders = ({ children, solanaRpcUrl }: Props) => {
  return (
    <AppKitProvider>
      <SolanaProvider solanaRpcUrl={solanaRpcUrl}>
        <BitcoinProvider>{children}</BitcoinProvider>
      </SolanaProvider>
    </AppKitProvider>
  );
};
