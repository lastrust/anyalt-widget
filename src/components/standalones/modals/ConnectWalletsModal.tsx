import {
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { WalletButton } from '../../molecules/buttons/WalletButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const WALLETS = [
  {
    walletType: 'EVM wallets',
    network: 'Ethereum',
    icon: '/ethereum-icon.svg', // You'll need to add these icons to your assets
  },
  {
    walletType: 'Solana wallets',
    network: 'solana',
    icon: '/metamask-icon.svg',
  },
];

export const ConnectWalletsModal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  const { openConnectModal } = useConnectModal();
  const { connect, connected } = useWallet();

  const handleWalletClick = async (walletType: string) => {
    if (walletType === 'EVM wallets') {
      openConnectModal?.();
    } else if (walletType === 'Solana wallets' && !connected) {
      try {
        await connect();
      } catch (error) {
        console.error(error);
        throw new Error('Failed to connect Solana wallet');
      }
    }
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="brand.primary" p="24px">
        <ModalHeader
          color="white"
          p="0"
          mb="24px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
          <CloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody p="0">
          <Text color="brand.secondary.2" mb="16px">
            Connect with one of the available wallet providers or create a new
            wallet
          </Text>
          <VStack spacing="12px" align="stretch">
            {WALLETS.map((wallet) => (
              <WalletButton
                key={wallet.walletType}
                walletType={wallet.walletType}
                network={wallet.network}
                icon={wallet.icon}
                onConnect={() => handleWalletClick(wallet.walletType)}
              />
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
