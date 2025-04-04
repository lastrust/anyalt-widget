import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { SupportedToken } from '@anyalt/sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnector } from '../../..';
import {
  allRoutesAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  selectedRouteAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  swapResultTokenAtom,
  tokenFetchErrorAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';

export const useSelectToken = ({
  walletConnector,
  showConnectedWallets,
}: {
  walletConnector?: WalletConnector;
  showConnectedWallets: boolean;
}) => {
  const [openTokenSelect, setOpenTokenSelect] = useState<boolean>(false);

  const allRoutes = useAtomValue(allRoutesAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);

  const [, setSelectedToken] = useAtom(selectedTokenAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

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
    setSelectedToken(token);
    setOpenTokenSelect(false);
    callback();
  };

  const inTokenPrice = useMemo(() => {
    if (
      !selectedRoute ||
      !selectedTokenAmount ||
      selectedRoute?.swapSteps.length === 0
    )
      return '';
    const tokenPrice = selectedRoute?.swapSteps[0].sourceToken.tokenUsdPrice;

    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(selectedTokenAmount)).toFixed(2);
  }, [selectedRoute, selectedTokenAmount]);

  const outTokenPrice = useMemo(() => {
    if (!selectedRoute || selectedRoute.swapSteps.length === 0) return '';
    const lastStep =
      selectedRoute.swapSteps[selectedRoute.swapSteps.length - 1];
    const tokenPrice = lastStep.destinationToken.tokenUsdPrice;

    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(selectedRoute.outputAmount)).toFixed(2);
  }, [selectedRoute]);

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
    widgetTemplate,
    setOpenTokenSelect,
    finalTokenEstimate: lastMileTokenEstimate,
    protocolInputToken: swapResultToken,
    protocolFinalToken: lastMileToken,
    bestRoute: allRoutes,
    inTokenAmount: selectedTokenAmount,
  };
};
