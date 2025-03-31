import { BestRouteResponse } from '@anyalt/sdk';
import { Grid } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { ChainType, Token, WalletConnector } from '../../..';
import {
  anyaltInstanceAtom,
  pendingOperationAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { TransactionList } from '../transaction/transactionList/TransactionsList';
import { Actions } from './Actions';

type Props = {
  setOperationToCurrentRoute: (operation: BestRouteResponse) => void;
  walletConnector: WalletConnector | undefined;
  connectWalletsOpen: () => void;
  allNecessaryWalletsConnected: boolean;
};

export const PendingOperationDialog = ({
  setOperationToCurrentRoute,
  walletConnector,
  connectWalletsOpen,
  allNecessaryWalletsConnected,
}: Props) => {
  const [pendingOperation, setPendingOperation] = useAtom(pendingOperationAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const [disableActions, setDisableActions] = useState(false);

  const destinationToken = useMemo(() => {
    const lastStep =
      pendingOperation?.swapSteps?.[pendingOperation?.swapSteps?.length - 1];

    if (!lastStep) return null;

    return {
      ...lastStep.destinationToken!,
      address: lastStep.destinationToken!.contractAddress,
      chainType: lastStep.destinationToken!.chainType as ChainType,
    } as Token;
  }, [pendingOperation]);

  const mainButtonText = useMemo(() => {
    if (allNecessaryWalletsConnected) {
      return 'Continue transaction(s)';
    }

    return 'Connect Wallets and continue';
  }, [allNecessaryWalletsConnected]);

  const onMainButtonClick = useCallback(() => {
    if (!pendingOperation) return;

    if (allNecessaryWalletsConnected) {
      setOperationToCurrentRoute(pendingOperation);
      setPendingOperation(undefined);
    } else {
      if (walletConnector) {
        walletConnector.connect();
      } else {
        connectWalletsOpen();
      }
    }
  }, [allNecessaryWalletsConnected, connectWalletsOpen]);

  const onDismissPendingOperation = useCallback(async () => {
    if (!anyaltInstance || !pendingOperation) return;
    const localStorageKey =
      widgetTemplate === 'TOKEN_BUY' ? 'tokenBuyOperationId' : 'operationId';

    localStorage.removeItem(localStorageKey);

    setDisableActions(true);

    await anyaltInstance?.cancelOperation({
      operationId: pendingOperation.operationId,
    });

    setPendingOperation(undefined);
    setDisableActions(false);
  }, [anyaltInstance, pendingOperation, setPendingOperation, widgetTemplate]);

  if (!pendingOperation || !destinationToken) return null;

  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate m="0" h="100%" maxH={'520px'} overflow={'scroll'}>
        <Actions
          disableActions={disableActions}
          onContinuePendingOperation={onMainButtonClick}
          onDismissPendingOperation={onDismissPendingOperation}
          mainButtonText={mainButtonText}
          pendingOperation={pendingOperation}
          destinationToken={destinationToken}
        />
      </SwappingTemplate>
      <SwappingTemplate m="0" maxH={'520px'} overflow={'scroll'}>
        <TransactionList operationType="PENDING" />
      </SwappingTemplate>
    </Grid>
  );
};
