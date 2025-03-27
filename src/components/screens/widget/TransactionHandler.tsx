import { BestRouteResponse } from '@anyalt/sdk';
import { WalletConnector } from '../../..';
import { PendingOperationDialog } from '../../standalones/pendingOperationDialog/PendingOperationDialog';
import { StuckTransactionDialog } from '../../standalones/stuckTransactionDialog/StuckTransactionDialog';

export const HandlerTransactions = ({
  showPendingOperationDialog,
  showStuckTransactionDialog,
  setOperationToCurrentRoute,
  walletConnector,
  allNecessaryWalletsConnected,
  connectWalletsOpen,
  resetState,
  children,
}: {
  showPendingOperationDialog: boolean;
  showStuckTransactionDialog: boolean;
  setOperationToCurrentRoute: (operation: BestRouteResponse) => void;
  walletConnector?: WalletConnector;
  allNecessaryWalletsConnected: boolean;
  connectWalletsOpen: () => void;
  resetState: () => void;
  children: React.ReactNode;
}) => {
  if (showPendingOperationDialog) {
    return (
      <PendingOperationDialog
        setOperationToCurrentRoute={setOperationToCurrentRoute}
        walletConnector={walletConnector}
        allNecessaryWalletsConnected={allNecessaryWalletsConnected}
        connectWalletsOpen={connectWalletsOpen}
      />
    );
  }

  if (showStuckTransactionDialog) {
    return <StuckTransactionDialog resetState={resetState} />;
  }

  return children;
};
