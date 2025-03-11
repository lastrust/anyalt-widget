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
      border: {
        tag: '#008080',
        active: '#008080',
        bestRoute: '#008080',
        secondary: '#919eab1f',
        error: '#E53030',
        primary: 'rgba(145, 158, 171, 0.12)',
      },
      bg: {
        primary: '#919eab1f',
        active: '#008080',
        hover: '#919eab1f',
        error: 'E530301a',
        tag: 'transparent',
        modal: '#0C0600',
        cardBg: '#919eab0a',
        selectToken: 'rgba(0, 0, 0, 0.5)',
        skeleton: '#919eab',
      },
      text: {
        primary: '#fff',
        warning: '#f9e154',
        error: '#E53030',
        active: '#008080',
        secondary: {
          0: '#ffffff',
          1: 'rgba(255, 255, 255, 0.80)',
          2: 'rgba(255, 255, 255, 0.40)',
          3: 'rgba(255, 255, 255, 0.08)',
          4: '#919eab',
        },
      },
      buttons: {
        close: {
          primary: '#919eab',
        },
        back: {
          primary: '#fff',
        },
        accordion: {
          primary: '#fff',
        },
        action: {
          bg: '#008080',
          bgFaded: '#00808033',
          hover: '#006666',
          disabled: '00808033',
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
