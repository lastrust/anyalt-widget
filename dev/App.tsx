import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnyaltWidget, defaultTheme } from '../src/AnyaltWidget';
import { OpenModalButton } from '../src/components/atoms/buttons/OpenModalButton';
import { useModal } from '../src/hooks/useModal';
import { ChainType } from '../src/types/types';

const App = () => {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <ChakraProvider theme={defaultTheme}>
      <Center h={'100vh'}>
        <Box maxW={'600px'}>
          <OpenModalButton onOpen={onOpen} />
          <AnyaltWidget
            logo="test"
            walletConnector={{}}
            inputToken={{
              address: '0x123',
              chainId: 1,
              chainType: ChainType.EVM,
            }}
            isOpen={isOpen}
            onClose={onClose}
          />
        </Box>
      </Center>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
