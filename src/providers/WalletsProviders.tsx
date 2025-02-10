import { ReactNode } from 'react';
import { AppKitProvider } from './RainbowKitProvider';
import { SolanaProvider } from './SolanaProvider';

type Props = {
  children: ReactNode;
  solanaRpcUrl?: string;
};

export const WalletsProviders = ({ children, solanaRpcUrl }: Props) => {
  return (
    <AppKitProvider>
      <SolanaProvider solanaRpcUrl={solanaRpcUrl}>{children}</SolanaProvider>
    </AppKitProvider>
  );
};
