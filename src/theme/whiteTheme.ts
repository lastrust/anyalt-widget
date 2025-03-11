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
      tertiary: {
        1: '#333',
        2: '#999',
        3: '#00808033',
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
        primary: '#919eab1f',
        hover: '#919eab1f',
        tag: '#fff',
        modal: '#fff',
        cardBg: '#F2F3F4',
        selectToken: 'rgba(0, 0, 0, 0.5)',
        skeleton: '#919eab',
      },
      text: {
        primary: '#000000',
        warning: '#ffcc00',
        secondary: {
          0: '#ffffff',
          1: '#999',
          2: '#999',
          3: '#F2F3F4',
          4: '#919eab',
        },
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
