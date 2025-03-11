import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { textStyles } from './textStyles';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const whiteTheme = extendTheme({
  config,
  colorScheme: 'dark',
  theme: 'dark',
  fonts: {
    heading: '"Rethink Sans", sans-serif',
    body: '"Rethink Sans", sans-serif',
  },
  textStyles,
  styles: {
    global: {
      body: {
        bg: '#ffffff',
        color: 'black',
        fontFamily: '"Rethink Sans", sans-serif',
      },
    },
  },
  images: {
    logo: 'https://www.anyalt.finance/anyalt-logo-black.png',
  },
  colors: {
    brand: {
      primary: '#ffffff',
      secondary: {
        1: '#000000',
        2: '#999',
        3: '#999',
        4: '#F2F3F4',
        5: '#ffffff',
        6: '#F2F3F4',
        7: 'rgba(0, 0, 0, 0.5)',
        8: '#919eab1f',
        9: '#919eab',
      },
      tertiary: {
        1: '#333',
        2: '#999',
        3: '#00808033',
      },
      quaternary: {
        1: '#fff',
      },
      quinary: {
        1: '#E53030',
        2: '#E530301a',
      },
      border: {
        primary: 'rgba(145, 158, 171, 0.12)',
        tag: 'transparent',
        bestRoute: '#333',
      },
      bg: {
        tag: '#fff',
      },
      text: {
        primary: '#000000',
        warning: '#ffcc00',
      },
      footer: {
        text: '#333',
      },
      buttons: {
        close: {
          primary: '#000000',
        },
        accordion: {
          primary: '#fff',
        },
        disabled: 'rgba(255, 255, 255, 0.5)',
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
