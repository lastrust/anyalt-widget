import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { WalletConnector } from '../../..';
import { ChooseNewRouteDialog } from '../chooseNewRouteDialog/ChooseNewRouteDialog';
import { PendingRouteDialog } from '../pendingRouteDialog/PendingRouteDialog';
import { StuckTransactionDialog } from '../stuckTransactionDialog/StuckTransactionDialog';

type Props = {
  showPendingRouteDialog: boolean;
  shouldFetchCryptoRoutes: boolean;
  walletConnector?: WalletConnector;
  showStuckTransactionDialog: boolean;
  allNecessaryWalletsConnected: boolean;
  children: React.ReactNode;
  resetState: () => void;
  connectWalletsOpen: () => void;
  setCurrentRoute: (route: GetAllRoutesResponseItem) => void;
  onChooseRouteButtonClick: () => Promise<void>;
};

export const HandleTransactions = ({
  walletConnector,
  showPendingRouteDialog,
  shouldFetchCryptoRoutes,
  showStuckTransactionDialog,
  allNecessaryWalletsConnected,
  children,
  resetState,
  setCurrentRoute,
  connectWalletsOpen,
  onChooseRouteButtonClick,
}: Props) => {
  if (showPendingRouteDialog)
    return (
      <PendingRouteDialog
        setCurrentRoute={setCurrentRoute}
        walletConnector={walletConnector}
        allNecessaryWalletsConnected={allNecessaryWalletsConnected}
        connectWalletsOpen={connectWalletsOpen}
      />
    );

  if (showStuckTransactionDialog)
    return <StuckTransactionDialog resetState={resetState} />;

  if (shouldFetchCryptoRoutes) {
    return (
      <ChooseNewRouteDialog
        onChooseRouteButtonClick={onChooseRouteButtonClick}
      />
    );
  }

  return children;
};
