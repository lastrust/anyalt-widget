import { Button, Circle, Flex, Text } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletButtonProps {
  walletType: string;
  network: string;
  onConnect: () => void;
}

export const WalletButton: FC<WalletButtonProps> = ({
  walletType,
  network,
  onConnect,
}) => {
  const { isConnected: isEvmConnected, address: evmAddress } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const {
    connected: isSolanaConnected,
    publicKey,
    disconnect: disconnectSolana,
  } = useWallet();

  const isEvmWallet = walletType === 'EVM wallets';
  const isSolanaWallet = walletType === 'Solana wallets';

  const isWalletConnected =
    (isEvmWallet && isEvmConnected) || (isSolanaWallet && isSolanaConnected);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleClick = () => {
    if (isWalletConnected) {
      if (isEvmWallet) {
        disconnectEvm();
      } else if (isSolanaWallet) {
        disconnectSolana();
      }
    } else {
      onConnect();
    }
  };

  const getDisplayAddress = () => {
    if (isEvmWallet && evmAddress) {
      return formatAddress(evmAddress);
    }
    if (isSolanaWallet && publicKey) {
      return formatAddress(publicKey.toString());
    }
    return network;
  };

  return (
    <Button
      w="100%"
      h="auto"
      p="16px"
      bg="brand.secondary.4"
      _hover={{ bg: 'brand.secondary.12' }}
      onClick={handleClick}
    >
      <Flex w="100%" justify="space-between" align="center">
        <Flex direction="column" align="flex-start" gap="4px">
          <Flex align="center" gap="8px">
            <Text color="brand.secondary.2" fontSize="16px">
              {walletType}
            </Text>
            {isWalletConnected && <Circle size="8px" bg="brand.tertiary.100" />}
          </Flex>
          <Text color="brand.secondary.3" fontSize="14px">
            {getDisplayAddress()}
          </Text>
        </Flex>
      </Flex>
    </Button>
  );
};
