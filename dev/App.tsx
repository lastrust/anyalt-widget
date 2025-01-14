import React from 'react';
import ReactDOM from 'react-dom/client';
import AnyaltWidget, { ChainType } from '../src/AnyaltWidget';
import { Box, Button, Center, ChakraProvider } from '@chakra-ui/react';

const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <ChakraProvider>
      <Center h={'100vh'}>
        <Box maxW={'600px'}>
          <Button onClick={handleOpen}>Open Anyalt Widget</Button>
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
