import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import '@fontsource/rethink-sans/400.css';
import '@fontsource/rethink-sans/500.css';
import '@fontsource/rethink-sans/600.css';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const defaultTheme = extendTheme({
  config,
  fonts: {
    heading: '"Rethink Sans", sans-serif',
    body: '"Rethink Sans", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#121212',
        color: 'white',
        fontFamily: '"Rethink Sans", sans-serif',
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
