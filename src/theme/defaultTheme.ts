import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const defaultTheme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: '#121212',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      primary: '#121212',
      secondary: '#919eab1f',
    },
  },
  components: {
    Box: {
      baseStyle: {
        borderColor: '#919eab1f',
      },
    },
  },
});
