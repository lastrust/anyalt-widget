import { SupportedToken } from '@anyalt/sdk';
import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  activeOperationIdAtom,
  anyaltInstanceAtom,
  selectedRouteAtom,
  showPartialFailDialogAtom,
  transactionIndexAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import { TransactionsProgress } from '../../../types/transaction';
import { convertSwapTransactionToTransactionProgress } from '../../../utils';

type UseSetRouteProps = {
  setActiveStep: (step: number) => void;
  setListOfTransactionsFromRoute: (
    route: GetAllRoutesResponseItem,
    inputToken: Partial<SupportedToken>,
  ) => void;
};

export const useSetRoute = ({
  setActiveStep,
  setListOfTransactionsFromRoute,
}: UseSetRouteProps) => {
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const anyaltInstance = useAtomValue(anyaltInstanceAtom);

  const setTransactionIndex = useSetAtom(transactionIndexAtom);
  const setActiveOperationId = useSetAtom(activeOperationIdAtom);
  const setTransactionsProgress = useSetAtom(transactionsProgressAtom);
  const setShowPartialFailDialog = useSetAtom(showPartialFailDialogAtom);

  const setCurrentRoute = useCallback(
    (route: GetAllRoutesResponseItem) => {
      setSelectedRoute(route);
      setActiveOperationId(route.routeId);
      setActiveStep(2);

      const newTransactionProgress = {} as TransactionsProgress;
      let lastFinishedTransactionIndex = 0;

      console.debug('~route swap steps', route.swapSteps);

      route.swapSteps.forEach((step, index) => {
        step.transactions
          .sort(
            (a, b) =>
              (Number(a.confirmedTimestamp) || 0) -
              (Number(b.confirmedTimestamp) || 0),
          )
          .forEach((transaction) => {
            console.debug('~tx', transaction);
            newTransactionProgress[index] = {};
            switch (transaction.type) {
              case 'MAIN':
                newTransactionProgress[index].swap =
                  convertSwapTransactionToTransactionProgress(
                    step,
                    transaction,
                  );

                console.debug(
                  '~newStransactionProgress',
                  newTransactionProgress[index],
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
      console.debug('~in useSetRoute', newTransactionProgress);
      setTransactionIndex(lastFinishedTransactionIndex + 1);
      setListOfTransactionsFromRoute(
        route,
        route.swapSteps[route.swapSteps.length - 1].destinationToken,
      );
    },
    [
      setActiveStep,
      setTransactionIndex,
      setActiveOperationId,
      setTransactionsProgress,
      setListOfTransactionsFromRoute,
    ],
  );

  const updateStepsOfCurrentRoute = useCallback(async () => {
    if (!selectedRoute || !anyaltInstance) return;

    const { swapSteps } = await anyaltInstance.getAllSwapSteps(
      selectedRoute.routeId,
    );

    if (!swapSteps.length) return;

    // Loop over each step and the previous steps and if they are similar, don't do anything
    // We will check sameness by checking the status, source and destination tokens
    if (swapSteps.length === selectedRoute.swapSteps.length) {
      const isSame = swapSteps.every((step, index) => {
        const prevStep = selectedRoute.swapSteps[index];
        return (
          // Status
          step.status === prevStep.status &&
          // Source token
          step.sourceToken.contractAddress ===
            prevStep.sourceToken.contractAddress &&
          step.sourceToken.blockchain === prevStep.sourceToken.blockchain &&
          // Destination token
          step.destinationToken.contractAddress ===
            prevStep.destinationToken.contractAddress &&
          step.destinationToken.blockchain ===
            prevStep.destinationToken.blockchain
        );
      });

      if (isSame) return;
    }

    if (swapSteps.some((step) => step.status === 'PARTIAL_SUCCESS')) {
      setShowPartialFailDialog(true);
    }

    return setCurrentRoute({
      ...selectedRoute,
      swapSteps,
    });
  }, [setCurrentRoute, selectedRoute]);

  return {
    setCurrentRoute,
    updateStepsOfCurrentRoute,
  };
};
