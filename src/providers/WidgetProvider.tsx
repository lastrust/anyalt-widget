import { ChakraProvider, Theme } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { defaultTheme } from '../theme/defaultTheme';

type Props = {
  children: ReactNode;
  theme?: Partial<Theme>;
};

export const WidgetProvider = ({ children, theme = defaultTheme }: Props) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
