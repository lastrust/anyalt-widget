import { useProvider } from '@ant-design/web3';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui'; // Import the wallet modal hook
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ChainType, WalletConnector } from '../../..';
import { allChainsAtom, bestRouteAtom } from '../../../store/stateStore';

const WALLETS = [
  {
    walletType: 'EVM',
    network: 'Ethereum',
    isDisabled: false,
    isConnected: false,
  },
  {
    walletType: 'Solana',
    network: 'solana',
    isDisabled: false,
    isConnected: false,
  },
  {
    walletType: 'Bitcoin',
    network: 'bitcoin',
    isDisabled: false,
    isConnected: false,
  },
];

type UseConnectWalletsModalProps = {
  onClose: () => void;
  walletConnector?: WalletConnector;
};

export const useConnectWalletsModal = ({
  onClose,
  walletConnector,
}: UseConnectWalletsModalProps) => {
  const { openConnectModal } = useConnectModal();
  const { setVisible } = useWalletModal(); // Hook to control the Solana wallet modal
  const { address: evmAddress } = useAccount();
  const { connected: isSolanaConnected } = useWallet();
  const { account: bitcoinAccount } = useProvider();
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
  }, [
    bestRoute,
    allChains,
    isEvmRequired,
    isSolanaRequired,
    isBitcoinRequired,
  ]);

  const getWalletConnectionStatus = useMemo(() => {
    return {
      EVM: {
        connected: isEvmRequired ? Boolean(evmAddress) : false,
        required: isEvmRequired,
      },
      Solana: {
        connected: isSolanaRequired ? isSolanaConnected : false,
        required: isSolanaRequired,
      },
      Bitcoin: {
        connected: isBitcoinRequired ? Boolean(bitcoinAccount?.address) : false,
        required: isBitcoinRequired,
      },
    };
  }, [
    evmAddress,
    isSolanaConnected,
    bitcoinAccount,
    isEvmRequired,
    isSolanaRequired,
    isBitcoinRequired,
  ]);

  const areAllRequiredWalletsConnected = useMemo(() => {
    return Object.values(getWalletConnectionStatus)
      .filter((wallet) => wallet.required)
      .every((wallet) => wallet.connected);
  }, [getWalletConnectionStatus]);

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

  useEffect(() => {
    if (areAllRequiredWalletsConnected) {
      onClose();
    }
  }, [areAllRequiredWalletsConnected, onClose]);

  // Function to handle wallet type click
  const handleWalletClick = (walletType: string) => {
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

  return {
    isBitcoinModalOpen,
    requiredWallets,
    setIsBitcoinModalOpen,
    onBitcoinConnected,
    handleWalletClick,
  };
};
