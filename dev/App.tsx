import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnyaltWidget, defaultTheme } from '../src/AnyaltWidget';
import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import { OpenModalButton } from '../src/components/atoms/OpenModalButton';
import { useModal } from '../src/hooks/useModal';
import { ChainType } from '../src/types/types';
import { AnyAlt } from '@anyalt/sdk';

export const anyaltInstance = new AnyAlt('pk_0xCYxjM8dFF0Vii7syrgpR6U4');

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
            anyaltInstance={anyaltInstance}
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
