import { ChakraProvider, extendTheme, Theme } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { defaultTheme } from '../theme/defaultTheme';
import { WalletsProviders } from './WalletsProviders';

type Props = {
  theme?: Partial<Theme>;
  children: ReactNode;
};

const chakraTheme = extendTheme(defaultTheme);

export const WidgetProvider = ({ children, theme = chakraTheme }: Props) => {
  return (
    <ChakraProvider theme={theme}>
      <WalletsProviders>{children}</WalletsProviders>
    </ChakraProvider>
  );
};
