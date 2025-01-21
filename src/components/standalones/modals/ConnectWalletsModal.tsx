import {
  Button,
  CloseButton,
  Flex,
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
import { useWalletModal } from '@solana/wallet-adapter-react-ui'; // Import the wallet modal hook
import { FC } from 'react';
import { useAccount } from 'wagmi';
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
  },
  {
    walletType: 'Solana wallets',
    network: 'solana',
  },
];

export const ConnectWalletsModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  onConfirm,
}) => {
  const { openConnectModal } = useConnectModal();
  const { setVisible } = useWalletModal(); // Hook to control the Solana wallet modal
  const { connected: isSolanaConnected } = useWallet();
  const { isConnected: isEvmConnected } = useAccount();

  const areWalletsConnected = isSolanaConnected && isEvmConnected;

  // Function to handle wallet type click
  const handleWalletClick = (walletType: string) => {
    if (walletType === 'EVM wallets') {
      openConnectModal?.();
    } else if (walletType === 'Solana wallets') {
      setVisible(true); // Open Solana wallet modal
    }
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
            {areWalletsConnected
              ? 'All wallets connected. You can proceed to the next step.'
              : 'Connect both wallets to proceed to the next step.'}
          </Text>
          <VStack spacing="12px" align="stretch">
            {WALLETS.map((wallet) => (
              <WalletButton
                key={wallet.walletType}
                walletType={wallet.walletType}
                network={wallet.network}
                onConnect={() => handleWalletClick(wallet.walletType)}
              />
            ))}
          </VStack>
          <Flex justify="flex-end" mt="24px">
            <Button
              bgColor="brand.tertiary.100"
              _hover={{ bgColor: 'brand.tertiary.20' }}
              isDisabled={!areWalletsConnected}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Next Step
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
