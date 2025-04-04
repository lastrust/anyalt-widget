import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { WalletConnector } from '../../..';
import { PendingRouteDialog } from '../pendingRouteDialog/PendingRouteDialog';
import { StuckTransactionDialog } from '../stuckTransactionDialog/StuckTransactionDialog';

type Props = {
  showPendingRouteDialog: boolean;
  showStuckTransactionDialog: boolean;
  setCurrentRoute: (route: GetAllRoutesResponseItem) => void;
  walletConnector?: WalletConnector;
  allNecessaryWalletsConnected: boolean;
  connectWalletsOpen: () => void;
  resetState: () => void;
  children: React.ReactNode;
};

export const HandleTransactions = ({
  showPendingRouteDialog,
  showStuckTransactionDialog,
  setCurrentRoute,
  walletConnector,
  allNecessaryWalletsConnected,
  connectWalletsOpen,
  resetState,
  children,
}: Props) => {
  if (showPendingRouteDialog) {
    return (
      <PendingRouteDialog
        setCurrentRoute={setCurrentRoute}
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
