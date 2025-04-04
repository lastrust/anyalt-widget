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
      border: {
        active: '#333',
        tag: 'transparent',
        bestRoute: '#333',
        secondary: '#919eab1f',
        error: '#E53030',
        primary: 'rgba(145, 158, 171, 0.12)',
      },
      bg: {
        primary: '#919eab1f',
        hover: '#919eab1f',
        error: 'E530301a',
        tag: '#fff',
        modal: '#fff',
        cardBg: '#F2F3F4',
        selectToken: 'rgba(0, 0, 0, 0.5)',
        skeleton: '#919eab',
        bestRoute: '#F2F3F4',
        active: '#333333',
      },
      text: {
        primary: '#000000',
        warning: '#ffcc00',
        error: '#E53030',
        active: '#333',
        highlight: '#3777F7',
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
      tags: {
        route: '#999',
        fastest: {
          text: '#3777F7',
          bg: 'rgba(55, 119, 247, 0.10)',
        },
        bestReturn: {
          text: '#00A958',
          bg: 'rgba(0, 169, 88, 0.10)',
        },
        lowestFee: {
          text: '#FF2D99',
          bg: 'rgba(255, 45, 153, 0.10)',
        },
        leastTransactions: {
          text: '#FF9900',
          bg: 'background: rgba(255, 153, 0, 0.10)',
        },
      },
      buttons: {
        close: {
          primary: '#000000',
        },
        cancel: {
          bg: '#ff3f3', // TEMP
        },
        accordion: {
          primary: '#fff',
        },
        action: {
          bg: '#333',
          bgFaded: '#33333333',
          hover: '#999',
          disabled: '#33333333',
        },
        outline: {
          border: '#000000',
          text: '#000000',
          hover: 'rgba(0, 0, 0, 0.1)',
        },
        disabled: '#999999',
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
