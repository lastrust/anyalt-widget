import { ChakraProvider, Theme } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { defaultTheme } from '../theme/defaultTheme';
import { AppKitProvider } from './RainbowKitProvider';
import { SolanaProvider } from './SolanaProvider';

type Props = {
  children: ReactNode;
  theme?: Partial<Theme>;
};

export const WidgetProvider = ({ children, theme = defaultTheme }: Props) => {
  return (
    <AppKitProvider>
      <SolanaProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </SolanaProvider>
    </AppKitProvider>
  );
};
