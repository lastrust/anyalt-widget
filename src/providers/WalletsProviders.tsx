import { ReactNode } from 'react';
import { BitcoinProvider } from './BitcoinProvider';
import { AppKitProvider } from './RainbowKitProvider';
import { SolanaProvider } from './SolanaProvider';

type Props = {
  children: ReactNode;
};

export const WalletsProviders = ({ children }: Props) => {
  return (
    <AppKitProvider>
      <SolanaProvider>
        <BitcoinProvider>{children}</BitcoinProvider>
      </SolanaProvider>
    </AppKitProvider>
  );
};
