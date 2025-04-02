import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { Grid } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { ChainType, Token, WalletConnector } from '../../..';
import {
  anyaltInstanceAtom,
  pendingRouteAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';
import { PendingRouteActions } from '../../standalones/dialogs/PendingRouteActions';
import { TransactionList } from '../../standalones/transaction/transactionList/TransactionsList';
import { SwappingTemplate } from '../../templates/SwappingTemplate';

type Props = {
  setCurrentRoute: (route: GetAllRoutesResponseItem) => void;
  walletConnector: WalletConnector | undefined;
  connectWalletsOpen: () => void;
  allNecessaryWalletsConnected: boolean;
};

export const PendingRouteDialog = ({
  setCurrentRoute,
  walletConnector,
  connectWalletsOpen,
  allNecessaryWalletsConnected,
}: Props) => {
  const [pendingRoute, setPendingRoute] = useAtom(pendingRouteAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const [disableActions, setDisableActions] = useState(false);

  const destinationToken = useMemo(() => {
    const lastStep =
      pendingRoute?.swapSteps?.[pendingRoute?.swapSteps?.length - 1];

    if (!lastStep) return null;

    return {
      ...lastStep.destinationToken!,
      address: lastStep.destinationToken!.contractAddress,
      chainType: lastStep.destinationToken!.chainType as ChainType,
    } as Token;
  }, [pendingRoute]);

  const mainButtonText = useMemo(() => {
    if (allNecessaryWalletsConnected) {
      return 'Continue transaction(s)';
    }

    return 'Connect Wallets and continue';
  }, [allNecessaryWalletsConnected]);

  const onMainButtonClick = useCallback(() => {
    if (!pendingRoute) return;

    if (allNecessaryWalletsConnected) {
      setCurrentRoute(pendingRoute);
      setPendingRoute(undefined);
    } else {
      if (walletConnector) {
        walletConnector.connect();
      } else {
        connectWalletsOpen();
      }
    }
  }, [allNecessaryWalletsConnected, connectWalletsOpen]);

  const onDismissPendingRoute = useCallback(async () => {
    if (!anyaltInstance || !pendingRoute) return;
    const localStorageKey =
      widgetTemplate === 'TOKEN_BUY' ? 'tokenBuyOperationId' : 'operationId';

    localStorage.removeItem(localStorageKey);

    setDisableActions(true);

    await anyaltInstance?.cancelOperation({
      operationId: pendingRoute.routeId,
    });

    setPendingRoute(undefined);
    setDisableActions(false);
  }, [anyaltInstance, pendingRoute, setPendingRoute, widgetTemplate]);

  if (!pendingRoute || !destinationToken) return null;

  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate m="0" h="100%" maxH={'520px'} overflow={'scroll'}>
        <PendingRouteActions
          disableActions={disableActions}
          onContinuePendingRoute={onMainButtonClick}
          onDismissPendingRoute={onDismissPendingRoute}
          mainButtonText={mainButtonText}
          pendingOperation={pendingRoute}
          destinationToken={destinationToken}
        />
      </SwappingTemplate>
      <SwappingTemplate m="0" maxH={'520px'} overflow={'scroll'}>
        <TransactionList operationType="PENDING" />
      </SwappingTemplate>
    </Grid>
  );
};
