import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { walletConfig } from '../constants/configs';

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={walletConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#008080',
          borderRadius: 'medium',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
