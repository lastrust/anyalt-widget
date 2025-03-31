import { BestRouteResponse, SupportedToken } from '@anyalt/sdk';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  activeOperationIdAtom,
  allRoutesAtom,
  transactionIndexAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import { TransactionsProgress } from '../../../types/transaction';
import { convertSwapTransactionToTransactionProgress } from '../../../utils';

type UseSetRouteProps = {
  setActiveStep: (step: number) => void;
  setListOfTransactionsFromRoute: (
    route: BestRouteResponse,
    inputToken: Partial<SupportedToken>,
  ) => void;
};

export const useSetRoute = ({
  setActiveStep,
  setListOfTransactionsFromRoute,
}: UseSetRouteProps) => {
  const setBestRoute = useSetAtom(allRoutesAtom);
  const setTransactionIndex = useSetAtom(transactionIndexAtom);
  const setActiveOperationId = useSetAtom(activeOperationIdAtom);
  const setTransactionsProgress = useSetAtom(transactionsProgressAtom);

  const setCurrentRoute = useCallback(
    (route: BestRouteResponse) => {
      setBestRoute(route);
      setActiveOperationId(route.operationId);
      setActiveStep(2);

      const newTransactionProgress = {} as TransactionsProgress;
      let lastFinishedTransactionIndex = 0;

      route.swapSteps.forEach((step, index) => {
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
        route,
        route.swapSteps[route.swapSteps.length - 1].destinationToken,
      );
    },
    [
      setBestRoute,
      setActiveStep,
      setTransactionIndex,
      setActiveOperationId,
      setTransactionsProgress,
      setListOfTransactionsFromRoute,
    ],
  );

  return {
    setCurrentRoute,
  };
};
