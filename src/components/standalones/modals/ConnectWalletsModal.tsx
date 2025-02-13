import { Connector } from '@ant-design/web3';
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
import { FC, useEffect, useMemo, useState } from 'react';
import { ChainType, WalletConnector } from '../../..';
import { allChainsAtom, bestRouteAtom } from '../../../store/stateStore';
import { WalletButton } from '../../molecules/buttons/WalletButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  areWalletsConnected: boolean;
  walletConnector?: WalletConnector;
}

const WALLETS = [
  {
    walletType: 'EVM',
    network: 'Ethereum',
    isDisabled: false,
  },
  {
    walletType: 'Solana',
    network: 'solana',
    isDisabled: false,
  },
  {
    walletType: 'Bitcoin',
    network: 'bitcoin',
    isDisabled: false,
  },
];

export const ConnectWalletsModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  areWalletsConnected,
  walletConnector,
}) => {
  const { openConnectModal } = useConnectModal();
  const { setVisible } = useWalletModal(); // Hook to control the Solana wallet modal
  const [isBitcoinModalOpen, setIsBitcoinModalOpen] = useState(false);
  const [isEvmRequired, setIsEvmRequired] = useState(false);
  const [isSolanaRequired, setIsSolanaRequired] = useState(false);
  const [isBitcoinRequired, setIsBitcoinRequired] = useState(false);

  const bestRoute = useAtomValue(bestRouteAtom);
  const allChains = useAtomValue(allChainsAtom);
  const requiredWallets = useMemo(() => {
    return WALLETS.filter((wallet) => {
      if (wallet.walletType === 'EVM') {
        return isEvmRequired;
      } else if (wallet.walletType === 'Solana') {
        return isSolanaRequired;
      } else if (wallet.walletType === 'Bitcoin') {
        return isBitcoinRequired;
      }
      return false;
    });
  }, [bestRoute, allChains]);

  useEffect(() => {
    bestRoute?.swaps.forEach((swap) => {
      const fromBlockchain = swap.from.blockchain;
      const toBlockchain = swap.to.blockchain;
      const isSolanaFrom = fromBlockchain === 'SOLANA';
      const isSolanaTo = toBlockchain === 'SOLANA';
      const isBitcoinFrom = fromBlockchain === 'BTC';
      const isBitcoinTo = toBlockchain === 'BTC';

      if (isSolanaFrom || isSolanaTo) setIsSolanaRequired(true);
      if (isBitcoinFrom || isBitcoinTo) setIsBitcoinRequired(true);

      const fromChain = allChains.find(
        (chain) => chain.name === fromBlockchain,
      );
      const toChain = allChains.find((chain) => chain.name === toBlockchain);

      if (
        fromChain?.chainType === ChainType.EVM ||
        toChain?.chainType === ChainType.EVM
      ) {
        setIsEvmRequired(true);
      }
    });
  }, [bestRoute, allChains]);

  // Function to handle wallet type click
  const handleWalletClick = (walletType: string) => {
    console.log('walletType', walletType);
    if (walletConnector) {
      if (walletConnector?.isConnected) {
        walletConnector.disconnect();
      } else if (!walletConnector.isConnected) {
        walletConnector.connect();
      }
    }

    if (walletType === 'EVM') {
      openConnectModal?.();
    } else if (walletType === 'Solana') {
      setVisible(true); // Open Solana wallet modal
    } else if (walletType === 'Bitcoin') {
      setIsBitcoinModalOpen(true); // Open Bitcoin wallet modal
    }
  };

  const onBitcoinConnected = () => {
    setIsBitcoinModalOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay backdropFilter="blur(4px)" zIndex={1000} />
      <ModalContent
        bg="brand.primary"
        p="24px"
        containerProps={{ zIndex: 1000 }}
      >
        <ModalHeader
          color="brand.text.primary"
          p="0"
          mb="24px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
          <CloseButton onClick={onClose} color="brand.secondary.100" />
        </ModalHeader>
        <ModalBody p="0">
          <Text color="brand.secondary.2" mb="16px">
            {areWalletsConnected
              ? 'All wallets connected. You can proceed to the next step.'
              : 'Connect wallets to proceed to the next step.'}
          </Text>
          <VStack spacing="12px" align="stretch">
            {requiredWallets.map((wallet) => (
              <WalletButton
                key={wallet.walletType}
                walletType={wallet.walletType}
                network={wallet.network}
                onConnect={() => handleWalletClick(wallet.walletType)}
                isDisabled={wallet.isDisabled || false}
                walletConnector={walletConnector}
              />
            ))}
          </VStack>
          <Connector
            children={<></>}
            modalProps={{
              open: isBitcoinModalOpen,
              onCancel: () => setIsBitcoinModalOpen(false),
              group: false,
              mode: 'simple',
            }}
            onConnected={onBitcoinConnected}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
