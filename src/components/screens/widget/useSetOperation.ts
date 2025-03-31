import { BestRouteResponse, SupportedToken } from '@anyalt/sdk';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  activeOperationIdAtom,
  bestRouteAtom,
  transactionIndexAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import { TransactionsProgress } from '../../../types/transaction';
import { convertSwapTransactionToTransactionProgress } from '../../../utils';

type UseSetOperationProps = {
  setActiveStep: (step: number) => void;
  setListOfTransactionsFromRoute: (
    route: BestRouteResponse,
    inputToken: Partial<SupportedToken>,
  ) => void;
};

export const useSetOperation = ({
  setActiveStep,
  setListOfTransactionsFromRoute,
}: UseSetOperationProps) => {
  const setBestRoute = useSetAtom(bestRouteAtom);
  const setTransactionIndex = useSetAtom(transactionIndexAtom);
  const setActiveOperationId = useSetAtom(activeOperationIdAtom);
  const setTransactionsProgress = useSetAtom(transactionsProgressAtom);

  const setOperationToCurrentRoute = useCallback(
    (operation: BestRouteResponse) => {
      setBestRoute(operation);
      setActiveOperationId(operation.operationId);
      setActiveStep(2);

      const newTransactionProgress = {} as TransactionsProgress;
      let lastFinishedTransactionIndex = 0;

      operation.swapSteps.forEach((step, index) => {
        step.transactions
          .sort(
            (a, b) =>
              (Number(a.confirmedTimestamp) || 0) -
              (Number(b.confirmedTimestamp) || 0),
          )
          .forEach((transaction) => {
            newTransactionProgress[index] = {};
            switch (transaction.type) {
              case 'MAIN':
                newTransactionProgress[index].swap =
                  convertSwapTransactionToTransactionProgress(
                    step,
                    transaction,
                  );

                if (
                  newTransactionProgress[index].swap?.status === 'confirmed'
                ) {
                  lastFinishedTransactionIndex = index + 1;
                }

                break;
              case 'APPROVE':
                newTransactionProgress[index].approve =
                  convertSwapTransactionToTransactionProgress(
                    step,
                    transaction,
                  );
                break;
              default:
                break;
            }
          });
      });

      setTransactionsProgress(newTransactionProgress);
      setTransactionIndex(lastFinishedTransactionIndex + 1);
      setListOfTransactionsFromRoute(
        operation,
        operation.swapSteps[operation.swapSteps.length - 1].destinationToken,
      );
    },
    [],
  );

  return {
    setOperationToCurrentRoute,
  };
};
