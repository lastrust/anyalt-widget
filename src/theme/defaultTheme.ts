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
      secondary: {
        100: '#919eab',
        1: '#000000',
        2: 'rgba(255, 255, 255, 0.80)',
        3: 'rgba(255, 255, 255, 0.40)',
        5: '#ffffff',
        12: '#919eab1f',
        4: '#919eab0a',
      },
      tertiary: {
        100: '#008080',
        20: '#00808033',
      },
      quaternary: '#0C0600',
      quinary: '#E53030',
      white: '#FFFFFF',
      border: {
        primary: 'rgba(145, 158, 171, 0.12)',
      },
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
