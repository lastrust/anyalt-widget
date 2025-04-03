import { Grid } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import {
  selectedRouteAtom,
  showStuckTransactionDialogAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import { StuckTransactionActions } from '../../standalones/dialogs/StuckTransactionActions';
import { TransactionList } from '../../standalones/transaction/transactionList/TransactionsList';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { useStuckTransaction } from './useStuckTransaction';

type Props = {
  resetState: () => void;
};

export const StuckTransactionDialog = ({ resetState }: Props) => {
  const [, setShowStuckTransactionDialog] = useAtom(
    showStuckTransactionDialogAtom,
  );
  const transactionsProgress = useAtomValue(transactionsProgressAtom);

  const selectedRoute = useAtomValue(selectedRouteAtom);

  const { onUpdateTx, onWaitForTx } = useStuckTransaction();

  const onAbandon = useCallback(() => {
    resetState();
    setShowStuckTransactionDialog(false);
  }, []);

  if (!selectedRoute) return null;

  const stuckTxTokens = useMemo(() => {
    const pendingTransactionIndex = Object.keys(transactionsProgress).length;

    const step = selectedRoute?.swapSteps[pendingTransactionIndex];

    return {
      from: {
        name: step.sourceToken.name,
        amount: !isNaN(parseInt(step.amount)) ? step.amount : step.quoteAmount,
        tokenLogo: step.sourceToken.logo,
        chainName: step.sourceToken.blockchain,
        chainLogo: step.sourceToken.blockchainLogo,
      },
      to: {
        name: step.destinationToken.name,
        amount: step.quotePayout,
        tokenLogo: step.destinationToken.logo,
        chainName: step.destinationToken.blockchain,
        chainLogo: step.destinationToken.blockchainLogo,
      },
    };
  }, [transactionsProgress]);

  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate m="0" h="100%" maxH={'520px'} overflow={'scroll'}>
        <StuckTransactionActions
          onUpdateTx={onUpdateTx}
          onWaitForTx={onWaitForTx}
          onAbandon={onAbandon}
          mainButtonText={'Update Transaction With Higer Gas'}
          stuckTxTokens={stuckTxTokens}
        />
      </SwappingTemplate>
      <SwappingTemplate m="0" maxH={'520px'} overflow={'scroll'}>
        <TransactionList operationType="CURRENT" />
      </SwappingTemplate>
    </Grid>
  );
};
