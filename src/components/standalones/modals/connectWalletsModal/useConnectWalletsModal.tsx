import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { ChainType, WalletConnector } from '../../../..';
import {
  allChainsAtom,
  bestRouteAtom,
  pendingRouteAtom,
  swapResultTokenAtom,
} from '../../../../store/stateStore';

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
  walletConnector?: WalletConnector;
};

export const useConnectWalletsModal = ({
  walletConnector,
}: UseConnectWalletsModalProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const swapResultToken = useAtomValue(swapResultTokenAtom);

  const { openConnectModal } = useConnectModal();
  const { setVisible } = useWalletModal(); // Hook to control the Solana wallet modal
  const [isBitcoinModalOpen, setIsBitcoinModalOpen] = useState(false);
  const [isEvmRequired, setIsEvmRequired] = useState(false);
  const [isSolanaRequired, setIsSolanaRequired] = useState(false);
  const [isBitcoinRequired, setIsBitcoinRequired] = useState(false);

  const bestRoute = useAtomValue(bestRouteAtom);
  const pendingRoute = useAtomValue(pendingRouteAtom);
  const allChains = useAtomValue(allChainsAtom);

  const [walletStatus, setWalletStatus] = useState<
    {
      walletType: string;
      network: string;
      isDisabled: boolean;
      isConnected: boolean;
    }[]
  >();

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
  }, [allChains, isEvmRequired, isSolanaRequired, isBitcoinRequired]);

  useEffect(() => {
    setWalletStatus(requiredWallets);
  }, [requiredWallets]);

  useEffect(() => {
    if (swapResultToken?.chain?.chainType === ChainType.EVM) {
      setIsEvmRequired(true);
    } else if (swapResultToken?.chain?.chainType === ChainType.SOLANA) {
      setIsSolanaRequired(true);
    }

    (pendingRoute?.swapSteps || [])
      .concat(...(bestRoute?.swapSteps || []))
      .forEach((swapStep) => {
        const fromBlockchain = swapStep.sourceToken.blockchain;
        const toBlockchain = swapStep.destinationToken.blockchain;

        const isSolanaFrom = fromBlockchain === 'SOLANA';
        const isSolanaTo = toBlockchain === 'SOLANA';
        if (isSolanaFrom || isSolanaTo) setIsSolanaRequired(true);

        const isBitcoinFrom = fromBlockchain === 'BTC';
        const isBitcoinTo = toBlockchain === 'BTC';
        if (isBitcoinFrom || isBitcoinTo) setIsBitcoinRequired(true);

        const toChain = allChains.find((chain) => chain.name === toBlockchain);
        const fromChain = allChains.find(
          (chain) => chain.name === fromBlockchain,
        );

        const isEvmFrom = fromChain?.chainType === ChainType.EVM;
        const isEvmTo = toChain?.chainType === ChainType.EVM;
        if (isEvmFrom || isEvmTo) setIsEvmRequired(true);
      });
  }, [bestRoute, allChains]);

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
      setVisible(true);
    } else if (walletType === 'Bitcoin') {
      setIsBitcoinModalOpen(true);
    }
  };

  const onBitcoinConnected = () => {
    setIsBitcoinModalOpen(false);
  };

  return {
    walletStatus,
    setWalletStatus,
    isWalletConnected,
    setIsWalletConnected,
    isBitcoinModalOpen,
    requiredWallets,
    setIsBitcoinModalOpen,
    onBitcoinConnected,
    handleWalletClick,
  };
};
