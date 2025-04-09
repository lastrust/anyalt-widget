import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  allRoutesAtom,
  anyaltInstanceAtom,
  selectedRouteAtom,
  showPendingRouteDialogAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';

import { AnyAlt } from '@anyalt/sdk';
import { WidgetTemplateType } from '../../..';
import { pendingRouteAtom } from '../../../store/stateStore';
import { mapBlockchainToChainType } from '../../../utils/chains';

type Props = {
  closeConnectWalletsModal: () => void;
};
export const usePendingRoute = ({ closeConnectWalletsModal }: Props) => {
  const [selectedRoute] = useAtom(selectedRouteAtom);
  const [showPendingRouteDialog, setShowPendingRouteDialog] = useAtom(
    showPendingRouteDialogAtom,
  );
  const [allNecessaryWalletsConnected, setAllNecessaryWalletsConnected] =
    useState(false);

  const [pendingRoute, setPendingRoute] = useAtom(pendingRouteAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const allRoutes = useAtomValue(allRoutesAtom);

  // Wallet stuff
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { publicKey: solanaPubKey, connected: isSolanaConnected } = useWallet();
  const { account: bitcoinAccount } = useBitcoinWallet();

  /**
   * Get pending operation from local storage and show the dialog
   * This would only happen when the widget was just opened
   * And there is a pending operation in local storage
   */
  useEffect(() => {
    const getPendingOperationById = async (
      anyalt: AnyAlt,
      operationId: string,
      widgetTemplate: WidgetTemplateType,
    ) => {
      const pendingRoute = await anyalt.getPendingOperation({
        operationId: operationId,
        operationType: widgetTemplate,
      });
      if (pendingRoute?.operationId) {
        setPendingRoute({
          missingWalletForSourceBlockchain: true,
          routeId: pendingRoute.operationId,
          swapSteps: pendingRoute.swapSteps!,
          outputAmount:
            pendingRoute.swapSteps![pendingRoute.swapSteps!.length - 1].payout,
          tags: [],
        });
      }
    };

    if (anyaltInstance) {
      const pendingOperationId =
        widgetTemplate === 'TOKEN_BUY'
          ? localStorage.getItem('tokenBuyOperationId')
          : localStorage.getItem('operationId');

      if (pendingOperationId) {
        getPendingOperationById(
          anyaltInstance,
          pendingOperationId,
          widgetTemplate,
        );
      }
    }
  }, [setPendingRoute, anyaltInstance, widgetTemplate]);

  /**
   * Get pending operation from wallets and show the dialog
   * This would only happen after the user has connected their wallets
   * And there is a pending operation in our db related to these wallets
   */
  useEffect(() => {
    const getPendingOperationByWallets = async (
      anyalt: AnyAlt,
      walletAddresses: string[],
    ) => {
      const pendingOperation = await anyalt.getPendingOperation({
        walletAddresses,
        operationType: widgetTemplate,
      });

      if (pendingOperation?.operationId) {
        setPendingRoute({
          missingWalletForSourceBlockchain: true,
          routeId: pendingOperation.operationId,
          swapSteps: pendingOperation.swapSteps!,
          outputAmount:
            pendingOperation.swapSteps![pendingOperation.swapSteps!.length - 1]
              .payout,
          tags: [],
        });
      }
    };

    if (anyaltInstance) {
      const walletAddresses = [
        evmAddress,
        solanaPubKey?.toString(),
        bitcoinAccount?.address,
      ].filter((address) => typeof address === 'string');

      if (walletAddresses.length > 0) {
        getPendingOperationByWallets(anyaltInstance, walletAddresses);
      }
    }
  }, [
    setShowPendingRouteDialog,
    anyaltInstance,
    evmAddress,
    solanaPubKey,
    bitcoinAccount,
  ]);

  /**
   * This handles whether we should show the pending operation dialog or not
   * Pretty straightforward, if there is a pending operation and it's not the active route
   * Then show the dialog
   * If there is no pending operation or the pending operation is the active route
   * Then hide the dialog
   */
  useEffect(() => {
    if (
      pendingRoute?.routeId &&
      pendingRoute?.routeId !== selectedRoute?.routeId
    ) {
      closeConnectWalletsModal();
      setShowPendingRouteDialog(true);
    }
    if (!pendingRoute || pendingRoute?.routeId === selectedRoute?.routeId) {
      setShowPendingRouteDialog(false);
    }
  }, [
    showPendingRouteDialog,
    pendingRoute,
    allRoutes,
    closeConnectWalletsModal,
  ]);

  /**
   * This is a check to see if all necessary wallets are connected
   */
  useEffect(() => {
    if (pendingRoute) {
      const allChainTypes = pendingRoute.swapSteps.map((step) => [
        mapBlockchainToChainType(step.sourceToken.blockchain),
        mapBlockchainToChainType(step.destinationToken.blockchain),
      ]);

      const allUniqueChainTypes = Array.from(
        new Set(allChainTypes.flat(2)),
      ).filter((chainType) => chainType !== null);

      const allConnectedWallets = allUniqueChainTypes.map((chainType) => {
        switch (chainType) {
          case 'EVM':
            return isEvmConnected;
          case 'SOLANA':
            return isSolanaConnected;
          case 'BTC':
            return !!bitcoinAccount;
          default:
            return false;
        }
      });

      setAllNecessaryWalletsConnected(allConnectedWallets.every(Boolean));
    }
  }, [pendingRoute, evmAddress, solanaPubKey, bitcoinAccount]);

  return {
    showPendingRouteDialog,
    allNecessaryWalletsConnected,
  };
};
