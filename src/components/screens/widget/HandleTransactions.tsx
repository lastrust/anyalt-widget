import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { EstimateResponse, WalletConnector } from '../../..';
import { ChooseNewRouteDialog } from '../chooseNewRouteDialog/ChooseNewRouteDialog';
import { PendingRouteDialog } from '../pendingRouteDialog/PendingRouteDialog';
import { StuckTransactionDialog } from '../stuckTransactionDialog/StuckTransactionDialog';

type Props = {
  loading: boolean;
  failedToFetchRoute: boolean;
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
  estimateOutPut: (
    route: GetAllRoutesResponseItem,
  ) => Promise<EstimateResponse>;
};

export const HandleTransactions = ({
  loading,
  walletConnector,
  failedToFetchRoute,
  showPendingRouteDialog,
  shouldFetchCryptoRoutes,
  showStuckTransactionDialog,
  allNecessaryWalletsConnected,
  children,
  resetState,
  estimateOutPut,
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
        loading={loading}
        estimateOutPut={estimateOutPut}
        failedToFetchRoute={failedToFetchRoute}
        onChooseRouteButtonClick={onChooseRouteButtonClick}
      />
    );
  }

  return children;
};
