import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { TX_MESSAGE, TX_STATUS } from '../../../constants/transaction';
import {
  showStuckTransactionDialogAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import {
  TransactionGroup,
  TransactionStatus,
} from '../../../types/transaction';

export const useStuckTransaction = () => {
  const [showStuckTransactionDialog, setShowStuckTransactionDialog] = useAtom(
    showStuckTransactionDialogAtom,
  );
  const [transactionsProgress, setTransactionsProgress] = useAtom(
    transactionsProgressAtom,
  );

  const setProgressTo = useCallback(
    (setTo: TransactionStatus) => {
      const keys = Object.keys(transactionsProgress);
      const lastKey = keys[keys.length - 1];
      const newLatest = transactionsProgress[lastKey];

      const type = newLatest.approve?.status === 'pending' ? 'approve' : 'swap';

      if (type === 'swap' && !newLatest.swap) {
        // Should be unreachable
        throw new Error('No pending transaction to update');
      }

      // if the status is the same, don't update
      if (newLatest![type]!.status === setTo) {
        return;
      }

      setTransactionsProgress({
        ...transactionsProgress,
        [lastKey]: {
          ...newLatest,
          [type]: {
            ...newLatest[type],
            message: TX_MESSAGE.stuck,
            status: setTo,
          } as TransactionGroup,
        },
      });
    },
    [setTransactionsProgress],
  );

  const onUpdateTx = useCallback(() => {
    setShowStuckTransactionDialog(false);
    setProgressTo(TX_STATUS.stuck);
  }, [setShowStuckTransactionDialog]);

  const onWaitForTx = useCallback(() => {
    setShowStuckTransactionDialog(false);
    setProgressTo(TX_STATUS.pending);
  }, []);

  const keepPollingOnTxStuck = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setShowStuckTransactionDialog(true);
      resolve(false);
    });
  }, [setProgressTo, setShowStuckTransactionDialog]);

  return {
    showStuckTransactionDialog,
    onUpdateTx,
    onWaitForTx,
    keepPollingOnTxStuck,
  };
};
