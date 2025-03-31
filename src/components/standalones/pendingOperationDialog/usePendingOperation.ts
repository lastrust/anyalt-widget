import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  anyaltInstanceAtom,
  bestRouteAtom,
  showPendingOperationDialogAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';

import { AnyAlt } from '@anyalt/sdk';
import { pendingOperationAtom } from '../../../store/stateStore';
import { mapBlockchainToChainType } from '../../../utils/chains';

type Props = {
  closeConnectWalletsModal: () => void;
};
export const usePendingOperation = ({ closeConnectWalletsModal }: Props) => {
  const [showPendingOperationDialog, setShowPendingOperationDialog] = useAtom(
    showPendingOperationDialogAtom,
  );
  const [allNecessaryWalletsConnected, setAllNecessaryWalletsConnected] =
    useState(false);

  const [pendingOperation, setPendingOperation] = useAtom(pendingOperationAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const activeRoute = useAtomValue(bestRouteAtom);

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
    ) => {
      const pendingOperation = await anyalt.getPendingOperation({
        operationId: operationId,
      });
      if (pendingOperation?.operationId) {
        setPendingOperation({
          missingWalletForSourceBlockchain: true,
          operationId: pendingOperation.operationId,
          swapSteps: pendingOperation.swapSteps!,
          outputAmount:
            pendingOperation.swapSteps![pendingOperation.swapSteps!.length - 1]
              .payout,
        });
      }
    };

    if (anyaltInstance) {
      const pendingOperationId =
        widgetTemplate === 'TOKEN_BUY'
          ? localStorage.getItem('tokenBuyOperationId')
          : localStorage.getItem('operationId');

      if (pendingOperationId) {
        getPendingOperationById(anyaltInstance, pendingOperationId);
      }
    }
  }, [setPendingOperation, anyaltInstance, widgetTemplate]);

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
      });
      if (pendingOperation?.operationId) {
        setPendingOperation({
          missingWalletForSourceBlockchain: true,
          operationId: pendingOperation.operationId,
          swapSteps: pendingOperation.swapSteps!,
          outputAmount:
            pendingOperation.swapSteps![pendingOperation.swapSteps!.length - 1]
              .payout,
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
    setShowPendingOperationDialog,
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
      pendingOperation?.operationId &&
      pendingOperation?.operationId !== activeRoute?.operationId
    ) {
      closeConnectWalletsModal();
      setShowPendingOperationDialog(true);
    }
    if (
      !pendingOperation ||
      pendingOperation?.operationId === activeRoute?.operationId
    ) {
      setShowPendingOperationDialog(false);
    }
  }, [
    showPendingOperationDialog,
    pendingOperation,
    activeRoute,
    closeConnectWalletsModal,
  ]);

  /**
   * This is a check to see if all necessary wallets are connected
   */
  useEffect(() => {
    if (pendingOperation) {
      const allChainTypes = pendingOperation.swapSteps.map((step) => [
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
  }, [pendingOperation, evmAddress, solanaPubKey, bitcoinAccount]);

  return {
    showPendingOperationDialog,
    allNecessaryWalletsConnected,
  };
};
