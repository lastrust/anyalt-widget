import { HStack, Text, VStack } from '@chakra-ui/react';
import { WalletConnector } from '../../..';
import { LINKS } from '../../../constants/links';
import { WalletAddressButton } from '../../molecules/buttons/WalletAddressButton';

type Props = {
  showConnectedWallets: boolean;
  isConnected: boolean;
  isEvmWalletConnected: boolean;
  isSolanaWalletConnected: boolean;
  isBitcoinWalletConnected: boolean;
  evmAddress?: string;
  solanaAddress?: string;
  bitcoinAccount?: string;
  walletConnector?: WalletConnector;
  connectWalletsOpen?: () => void;
};

export const WalletsGroup = ({
  evmAddress,
  solanaAddress,
  bitcoinAccount,
  walletConnector,
  isConnected,
  isEvmWalletConnected,
  isSolanaWalletConnected,
  isBitcoinWalletConnected,
  connectWalletsOpen,
  showConnectedWallets,
}: Props) => {
  if (!showConnectedWallets) return null;

  return (
    <HStack alignItems={'center'}>
      {isConnected && (
        <Text color="brand.text.active" textStyle={'regular.2'}>
          Connected:
        </Text>
      )}
      <VStack gap={'8px'} alignItems={'flex-start'}>
        <WalletAddressButton
          alt="EVM"
          imgURL={LINKS.wallets.evm}
          onClick={connectWalletsOpen}
          isConnected={isEvmWalletConnected}
        >
          {evmAddress || walletConnector?.address}
        </WalletAddressButton>
        <WalletAddressButton
          alt="SOL"
          imgURL={LINKS.wallets.solana}
          onClick={connectWalletsOpen}
          isConnected={isSolanaWalletConnected}
        >
          {solanaAddress}
        </WalletAddressButton>
        <WalletAddressButton
          alt="BTC"
          imgURL={LINKS.wallets.bitcoin}
          onClick={connectWalletsOpen}
          isConnected={isBitcoinWalletConnected}
        >
          {bitcoinAccount}
        </WalletAddressButton>
      </VStack>
    </HStack>
  );
};
