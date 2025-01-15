import React from 'react';
import ReactDOM from 'react-dom/client';
import AnyaltWidget, { ChainType } from '../src/AnyaltWidget';
import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import { OpenModalButton } from '../src/components/atoms/OpenModalButton';
import { useModal } from '../src/hooks/useModal';

const App = () => {
  const { isOpen, handleOpen, handleClose } = useModal();

  return (
    <ChakraProvider>
      <Center h={'100vh'}>
        <Box maxW={'600px'}>
          <OpenModalButton onOpen={handleOpen} />
          <AnyaltWidget
            logo="test"
            walletConnector={{}}
            inputToken={{
              address: '0x123',
              chainId: 1,
              chainType: ChainType.EVM,
            }}
            isOpen={isOpen}
            onClose={handleClose}
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
