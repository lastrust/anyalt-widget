import { ChakraProvider, extendTheme, Theme } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { defaultTheme } from '../theme/defaultTheme';
import { WalletsProviders } from './WalletsProviders';

type Props = {
  theme?: Partial<Theme>;
  children: ReactNode;
  solanaRpcUrl?: string;
};

const chakraTheme = extendTheme(defaultTheme);

export const WidgetProvider = ({
  children,
  theme = chakraTheme,
  solanaRpcUrl,
}: Props) => {
  return (
    <ChakraProvider theme={theme}>
      <WalletsProviders solanaRpcUrl={solanaRpcUrl}>
        {children}
      </WalletsProviders>
    </ChakraProvider>
  );
};
