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
import { useWalletModal } from '@solana/wallet-adapter-react-ui'; // Import the wallet modal hook
import { useAtomValue } from 'jotai';
import { FC, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { allChainsAtom, bestRouteAtom } from '../../../store/stateStore';
import { ChainType } from '../../../types/types';
import { WalletButton } from '../../molecules/buttons/WalletButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isSolanaConnected: boolean;
  isEvmConnected: boolean;
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
  isSolanaConnected,
  // isEvmConnected,
}) => {
  const {
    address: evmAddress,
    isConnected: isEvmConnected,
    chain,
  } = useAccount();

  const { openConnectModal } = useConnectModal();
  const { setVisible } = useWalletModal(); // Hook to control the Solana wallet modal
  const activeRoute = useAtomValue(bestRouteAtom);
  const allChains = useAtomValue(allChainsAtom);

  const areWalletsConnected = useMemo(() => {
    let isSolanaRequired = false;
    let isEvmRequired = false;
    activeRoute?.swaps.forEach((swap) => {
      if (
        swap.from.blockchain === 'SOLANA' ||
        swap.to.blockchain === 'SOLANA'
      ) {
        isSolanaRequired = true;
      }
      const fromChain = allChains.find(
        (chain) => chain.name === swap.from.blockchain,
      );
      const toChain = allChains.find(
        (chain) => chain.name === swap.to.blockchain,
      );
      if (
        fromChain?.chainType === ChainType.EVM ||
        toChain?.chainType === ChainType.EVM
      ) {
        isEvmRequired = true;
      }
    });
    let isWalletConnected = true;
    if (isSolanaRequired && !isSolanaConnected) {
      isWalletConnected = false;
    }
    if (isEvmRequired && !isEvmConnected) {
      isWalletConnected = false;
    }
    return isWalletConnected;
  }, [isSolanaConnected, isEvmConnected, activeRoute]);

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
              : 'Connect wallets to proceed to the next step.'}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
