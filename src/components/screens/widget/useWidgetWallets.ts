import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ChainType, WalletConnector } from '../../..';
import {
  allChainsAtom,
  bestRouteAtom,
  swapResultTokenAtom,
} from '../../../store/stateStore';

type Props = {
  walletConnector: WalletConnector | undefined;
  isConnectWalletsOpen: boolean;
  connectWalletsClose: () => void;
};

export const useWidgetWallets = ({
  walletConnector,
  isConnectWalletsOpen,
  connectWalletsClose,
}: Props) => {
  const allChains = useAtomValue(allChainsAtom);
  const bestRoute = useAtomValue(bestRouteAtom);
  const swapResultTokenGlobal = useAtomValue(swapResultTokenAtom);

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { account: bitcoinAccount } = useBitcoinWallet();

  const getChain = (blockchain: string) =>
    allChains.find((chain) => chain.name === blockchain);

  const areWalletsConnected = useMemo(() => {
    let isSolanaRequired = false;
    let isEvmRequired = false;
    let isBitcoinRequired = false;

    if (walletConnector && walletConnector.isConnected) {
      return walletConnector.isConnected;
    }

    // Set chain flags for last mile tx
    if (swapResultTokenGlobal?.chain?.chainType === ChainType.EVM) {
      isEvmRequired = true;
    } else if (swapResultTokenGlobal?.chain?.chainType === ChainType.SOLANA) {
      isSolanaRequired = true;
    }

    bestRoute?.swapSteps.forEach((swapStep) => {
      const fromBlockchain = swapStep.sourceToken.blockchain;
      const toBlockchain = swapStep.destinationToken.blockchain;
      const isSolanaFrom = fromBlockchain === 'SOLANA';
      const isSolanaTo = toBlockchain === 'SOLANA';
      const isBitcoinFrom = fromBlockchain === 'BTC';
      const isBitcoinTo = toBlockchain === 'BTC';

      if (isSolanaFrom || isSolanaTo) isSolanaRequired = true;
      if (isBitcoinFrom || isBitcoinTo) isBitcoinRequired = true;

      const fromChain = getChain(fromBlockchain);
      const toChain = getChain(toBlockchain);

      if (
        fromChain?.chainType === ChainType.EVM ||
        toChain?.chainType === ChainType.EVM
      ) {
        isEvmRequired = true;
      }
    });

    let isWalletConnected = true;
    if (isSolanaRequired && !isSolanaConnected) isWalletConnected = false;
    if (isEvmRequired && !isEvmConnected) isWalletConnected = false;
    if (isBitcoinRequired && !bitcoinAccount) isWalletConnected = false;

    return isWalletConnected;
  }, [isSolanaConnected, isEvmConnected, bestRoute, bitcoinAccount]);

  useEffect(() => {
    if (areWalletsConnected && isConnectWalletsOpen) {
      connectWalletsClose();
    }
  }, [areWalletsConnected]);

  

  return {
    evmAddress,
    solanaAddress,
    bitcoinAccount,
    areWalletsConnected,
    getChain,
  };
};
