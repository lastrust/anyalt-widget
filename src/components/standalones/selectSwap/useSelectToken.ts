import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { SupportedToken } from '@anyalt/sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnector } from '../../..';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  tokenFetchErrorAtom,
} from '../../../store/stateStore';

export const useSelectToken = ({
  walletConnector,
  showConnectedWallets,
}: {
  walletConnector?: WalletConnector;
  showConnectedWallets: boolean;
}) => {
  const [openTokenSelect, setOpenTokenSelect] = useState<boolean>(false);

  const [, setInToken] = useAtom(inTokenAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const bestRoute = useAtomValue(bestRouteAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);

  const tokenFetchError = useAtomValue(tokenFetchErrorAtom);

  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { account: bitcoinAccount } = useBitcoinWallet();

  const isConnected = useMemo(() => {
    return Boolean(
      isEvmConnected ||
        isSolanaConnected ||
        walletConnector?.isConnected ||
        bitcoinAccount,
    );
  }, [
    isEvmConnected,
    isSolanaConnected,
    walletConnector?.isConnected,
    bitcoinAccount,
  ]);

  const onTokenSelect = (token: SupportedToken, callback: () => void) => {
    setInToken(token);
    setOpenTokenSelect(false);
    callback();
  };

  const inTokenPrice = useMemo(() => {
    if (!bestRoute || !inTokenAmount || bestRoute.swapSteps.length === 0)
      return '';
    const tokenPrice = bestRoute.swapSteps[0].sourceToken.tokenUsdPrice;

    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(inTokenAmount)).toFixed(2);
  }, [bestRoute, inTokenAmount]);

  const outTokenPrice = useMemo(() => {
    if (!bestRoute || bestRoute.swapSteps.length === 0) return '';
    const lastStep = bestRoute.swapSteps[bestRoute.swapSteps.length - 1];
    const tokenPrice = lastStep.destinationToken.tokenUsdPrice;

    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(bestRoute.outputAmount)).toFixed(2);
  }, [bestRoute]);

  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  const isEvmWalletConnected = useMemo(() => {
    return (
      showConnectedWallets &&
      Boolean(isEvmConnected || walletConnector?.isConnected)
    );
  }, [isEvmConnected, walletConnector?.isConnected, showConnectedWallets]);

  const isSolanaWalletConnected = useMemo(() => {
    return showConnectedWallets && isSolanaConnected;
  }, [isSolanaConnected, showConnectedWallets]);

  const isBitcoinWalletConnected = useMemo(() => {
    return showConnectedWallets && Boolean(bitcoinAccount);
  }, [bitcoinAccount, showConnectedWallets]);

  return {
    isConnected,
    inTokenPrice,
    tokenFetchError,
    isEvmWalletConnected,
    isSolanaWalletConnected,
    isBitcoinWalletConnected,
    solanaAddress,
    evmAddress,
    bitcoinAccount,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    isTokenBuyTemplate,
    setOpenTokenSelect,
    finalTokenEstimate,
    protocolInputToken,
    protocolFinalToken,
    bestRoute,
    inTokenAmount,
  };
};
