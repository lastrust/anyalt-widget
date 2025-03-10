import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { textStyles } from './textStyles';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const defaultTheme = extendTheme({
  config,
  colorScheme: 'dark',
  theme: 'dark',
  fonts: {
    heading: '"Rethink Sans", "Poppins", sans-serif',
    body: '"Rethink Sans", "Poppins", sans-serif',
  },
  textStyles,
  styles: {
    global: {
      body: {
        bg: '#121212',
        color: 'white',
        fontFamily: '"Rethink Sans", "Poppins", sans-serif',
      },
    },
  },
  images: {
    logo: 'https://www.anyalt.finance/anyalt-logo.png',
  },
  colors: {
    brand: {
      primary: '#121212',
      secondary: {
        100: '#919eab',
        1: '#000000',
        2: 'rgba(255, 255, 255, 0.80)',
        3: 'rgba(255, 255, 255, 0.40)',
        4: '#919eab0a',
        5: '#ffffff',
        6: 'rgba(255, 255, 255, 0.08)',
        7: 'rgba(0, 0, 0, 0.5)',
        12: '#919eab1f',
      },
      tertiary: {
        100: '#008080',
        90: '#006666',
        20: '#00808033',
        30: '#0080801a',
      },
      quaternary: '#0C0600',
      quinary: {
        100: '#E53030',
        10: '#E530301a',
      },
      white: '#FFFFFF',
      border: {
        primary: 'rgba(145, 158, 171, 0.12)',
        tag: '#008080',
        bestRoute: '#008080',
      },
      bg: {
        tag: 'transparent',
      },
      text: {
        primary: '#fff',
        warning: '#f9e154',
      },
      footer: {
        text: '#fff',
      },
      buttons: {
        close: {
          primary: '#fff',
        },
        back: {
          primary: '#fff',
        },
        accordion: {
          primary: '#fff',
        },
        disabled: '#0B3E3E',
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
