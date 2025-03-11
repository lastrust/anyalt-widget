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
        9: '#919eab',
      },
      tertiary: {
        1: '#008080',
        2: '#006666',
        3: '#00808033',
      },
      quinary: {
        1: '#E53030',
        2: '#E530301a',
      },
      border: {
        primary: 'rgba(145, 158, 171, 0.12)',
        secondary: '#919eab1f',
        tag: '#008080',
        bestRoute: '#008080',
      },
      bg: {
        primary: '#919eab1f',
        hover: '#919eab1f',
        tag: 'transparent',
        modal: '#0C0600',
        cardBg: '#919eab0a',
        selectToken: 'rgba(0, 0, 0, 0.5)',
      },
      text: {
        primary: '#fff',
        warning: '#f9e154',
        secondary: {
          0: '#ffffff',
          1: 'rgba(255, 255, 255, 0.80)',
          2: 'rgba(255, 255, 255, 0.40)',
          3: 'rgba(255, 255, 255, 0.08)',
        },
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
      footer: {
        text: '#fff',
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
