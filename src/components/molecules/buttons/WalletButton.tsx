import { useProvider } from '@ant-design/web3';
import { Button, Circle, Flex, Text } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useMemo } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletConnector } from '../../..';

interface WalletButtonProps {
  walletType: string;
  network: string;
  isDisabled: boolean;
  onConnect: () => void;
  setWalletStatus: React.Dispatch<
    React.SetStateAction<
      | {
          walletType: string;
          network: string;
          isDisabled: boolean;
          isConnected: boolean;
        }[]
      | undefined
    >
  >;
  walletConnector?: WalletConnector;
}

export const WalletButton: FC<WalletButtonProps> = ({
  walletType,
  network,
  onConnect,
  isDisabled,
  walletConnector,
  setWalletStatus,
}) => {
  if (isDisabled) {
    return null;
  }

  const { account: bitcoinAccount, disconnect: disconnectBitcoin } =
    useProvider();
  const { isConnected: isEvmConnected, address: evmAddress } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const {
    connected: isSolanaConnected,
    publicKey,
    disconnect: disconnectSolana,
  } = useWallet();

  const isEvmWallet = walletType === 'EVM';
  const isSolanaWallet = walletType === 'Solana';
  const isBitcoinWallet = walletType === 'Bitcoin';

  const isWalletConnected = useMemo(() => {
    return (
      (isEvmWallet && isEvmConnected) ||
      (isSolanaWallet && isSolanaConnected) ||
      (isBitcoinWallet && bitcoinAccount != undefined)
    );
  }, [
    isEvmConnected,
    isSolanaConnected,
    bitcoinAccount,
    isEvmWallet,
    isSolanaWallet,
    isBitcoinWallet,
  ]);

  useEffect(() => {
    if (isEvmWallet && evmAddress) {
      setWalletStatus((prev) =>
        prev?.map((wallet) =>
          wallet.walletType === 'EVM'
            ? { ...wallet, isConnected: true }
            : wallet,
        ),
      );
    } else if (isSolanaWallet && publicKey) {
      setWalletStatus((prev) =>
        prev?.map((wallet) =>
          wallet.walletType === 'Solana'
            ? { ...wallet, isConnected: true }
            : wallet,
        ),
      );
    } else if (isBitcoinWallet && bitcoinAccount) {
      setWalletStatus((prev) =>
        prev?.map((wallet) =>
          wallet.walletType === 'Bitcoin'
            ? { ...wallet, isConnected: true }
            : wallet,
        ),
      );
    }
  }, [
    isEvmWallet,
    isSolanaWallet,
    isBitcoinWallet,
    evmAddress,
    publicKey,
    bitcoinAccount,
  ]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleClick = () => {
    if (walletConnector) {
      if (walletConnector?.isConnected) {
        walletConnector.disconnect();
      } else if (!walletConnector.isConnected) {
        walletConnector.connect();
      }
    }

    if (isWalletConnected) {
      if (isEvmWallet) {
        disconnectEvm();
        setWalletStatus((prev) =>
          prev?.map((wallet) =>
            wallet.walletType === 'EVM'
              ? { ...wallet, isConnected: false }
              : wallet,
          ),
        );
      } else if (isSolanaWallet) {
        disconnectSolana();
        setWalletStatus((prev) =>
          prev?.map((wallet) =>
            wallet.walletType === 'Solana'
              ? { ...wallet, isConnected: false }
              : wallet,
          ),
        );
      } else if (isBitcoinWallet) {
        disconnectBitcoin?.();
        setWalletStatus((prev) =>
          prev?.map((wallet) =>
            wallet.walletType === 'Bitcoin'
              ? { ...wallet, isConnected: false }
              : wallet,
          ),
        );
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
    if (isBitcoinWallet && bitcoinAccount) {
      return formatAddress(bitcoinAccount.address);
    }
    return network;
  };

  const getButtonStatus = () => {
    if (isEvmWallet && evmAddress) {
      return 'Disconnect EVM Wallet';
    }
    if (isSolanaWallet && publicKey) {
      return 'Disconnect Solana Wallet';
    }
    if (isBitcoinWallet && bitcoinAccount) {
      return 'Disconnect Bitcoin Wallet';
    }
    if (isEvmWallet) {
      return 'Connect EVM Wallet';
    }
    if (isSolanaWallet) {
      return 'Connect Solana Wallet';
    }
    if (isBitcoinWallet) {
      return 'Connect Bitcoin Wallet';
    }
    return 'Connect';
  };

  return (
    <Button
      w="100%"
      h="auto"
      p="16px"
      bg="brand.bg.cardBg"
      _hover={{ bg: 'brand.bg.hover' }}
      onClick={handleClick}
    >
      <Flex w="100%" justify="space-between" align="center">
        <Flex direction="column" align="flex-start" gap="4px">
          <Flex align="center" gap="8px">
            <Text color="brand.text.primary" fontSize="16px">
              {getButtonStatus()}
            </Text>
            <Circle
              size="8px"
              bg={isWalletConnected ? 'brand.border.active' : 'brand.bg.error'}
            />
          </Flex>
          <Text color="brand.text.secondary.2" fontSize="14px">
            {getDisplayAddress()}
          </Text>
        </Flex>
      </Flex>
    </Button>
  );
};
