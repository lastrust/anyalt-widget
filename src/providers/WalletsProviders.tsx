import { ReactNode } from 'react';
import { AppKitProvider } from './RainbowKitProvider';
import { SolanaProvider } from './SolanaProvider';

type Props = {
  children: ReactNode;
};

export const WalletsProviders = ({ children }: Props) => {
  return (
    <AppKitProvider>
      <SolanaProvider>{children}</SolanaProvider>
    </AppKitProvider>
  );
};
