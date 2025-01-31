import { ChakraProvider, extendTheme, Theme } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { defaultTheme } from '../theme/defaultTheme';
import { AppKitProvider } from './RainbowKitProvider';
import { SolanaProvider } from './SolanaProvider';

type Props = {
  theme?: Partial<Theme>;
  children: ReactNode;
};

const chakraTheme = extendTheme(defaultTheme);

export const WidgetProvider = ({ children, theme = chakraTheme }: Props) => {
  return (
    <AppKitProvider>
      <SolanaProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </SolanaProvider>
    </AppKitProvider>
  );
};
