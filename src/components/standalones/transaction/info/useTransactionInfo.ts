import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../../..';
import { TX_MESSAGE, TX_STATUS } from '../../../../constants/transaction';
import {
  anyaltInstanceAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  selectedRouteAtom,
  selectedTokenAmountAtom,
  showStuckTransactionDialogAtom,
  slippageAtom,
  swapResultTokenAtom,
  transactionIndexAtom,
  transactionsListAtom,
  transactionsProgressAtom,
} from '../../../../store/stateStore';
import { TransactionProgress } from '../../../../types/transaction';
import { useStuckTransaction } from '../../../screens/stuckTransactionDialog/useStuckTransaction';
import { useHandleSwap } from '../useHandleSwap';
import { activeOperationIdAtom } from './../../../../store/stateStore';

type UseTransactionInfoProps = {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  confirmRoute: () => Promise<string | undefined>;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
};

export const useTransactionInfo = ({
  externalEvmWalletConnector,
  confirmRoute,
  onTxComplete,
  executeCallBack,
  estimateCallback,
}: UseTransactionInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const showStuckTransactionDialog = useAtomValue(
    showStuckTransactionDialogAtom,
  );
  const slippage = useAtomValue(slippageAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);
  const currentStep = useAtomValue(transactionIndexAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const transactionsList = useAtomValue(transactionsListAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const [transactionsProgress, setTransactionsProgress] = useAtom(
    transactionsProgressAtom,
  );

  const { executeSwap } = useHandleSwap(externalEvmWalletConnector);

  const { keepPollingOnTxStuck } = useStuckTransaction();

  const isBridgeSwap = useMemo(() => {
    return (
      selectedRoute?.swapSteps?.[currentStep - 1]?.swapperType === 'BRIDGE'
    );
  }, [selectedRoute, currentStep]);

  const headerText = useMemo(() => {
    const isSwaps = selectedRoute?.swapSteps?.length;

    const swapperType = isBridgeSwap ? 'Bridge' : 'Swap';
    const swapperName =
      selectedRoute?.swapSteps?.[currentStep - 1]?.swapperName;
    const depositToken =
      transactionsList?.steps?.[currentStep - 1]?.to?.tokenName;

    const swappingText =
      isSwaps && isSwaps >= currentStep
        ? `${swapperType} tokens using ${swapperName}`
        : `Depositing tokens to ${depositToken}`;
    const lastMileText = 'Last mile transaction';

    const text = isSwaps ? swappingText : lastMileText;

    return text;
  }, [selectedRoute, currentStep, transactionsList]);

  const runTx = async (higherGasCost?: boolean) => {
    try {
      setIsLoading(true);
      const activeOperation = await confirmRoute();

      if (!anyaltInstance || !activeOperation) return;

      await executeSwap(
        anyaltInstance,
        activeOperation,
        slippage,
        (selectedRoute?.swapSteps ?? []).length,
        executeCallBack,
        estimateCallback,
        higherGasCost,
      );

      onTxComplete();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let abortController: AbortController | null = new AbortController();
    if (
      !showStuckTransactionDialog &&
      anyaltInstance &&
      activeOperationId &&
      !isLoading &&
      Object.keys(transactionsProgress).length
    ) {
      // If the last transaction is pending, wait for it to complete
      let keyOfLatestLoadingAction: string | number | undefined;
      let latestLoadingAction: TransactionProgress | undefined;

      const keys = Object.keys(transactionsProgress);
      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        if (transactionsProgress[key]?.swap?.status === TX_STATUS.pending) {
          latestLoadingAction = transactionsProgress[key].swap;
          keyOfLatestLoadingAction = key;
          break;
        }
        if (transactionsProgress[key]?.approve?.status === TX_STATUS.pending) {
          latestLoadingAction = transactionsProgress[key].approve;
          keyOfLatestLoadingAction = key;
          break;
        } else {
          if (
            transactionsProgress[key]?.swap?.status === TX_STATUS.stuck ||
            transactionsProgress[key]?.approve?.status === TX_STATUS.stuck
          ) {
            if (abortController) {
              abortController.abort();
              abortController = null;
            }
            runTx(true);
            return;
          }
        }
      }

      if (!latestLoadingAction || !keyOfLatestLoadingAction) return;

      setIsLoading(true);
      anyaltInstance
        .waitForTx(
          { operationId: activeOperationId, keepPollingOnTxStuck },
          abortController.signal,
        )
        .then((res) => {
          setIsLoading(false);
          const txType = latestLoadingAction.isApproval ? 'approve' : 'swap';
          setTransactionsProgress((prev) => {
            const newProgress = { ...prev };

            let newMessage: string;
            let newStatus: string;

            switch (res.status) {
              case 'FAILED':
                newMessage = TX_MESSAGE.failed;
                newStatus = TX_STATUS.failed;
                break;
              case 'PENDING':
                newMessage = TX_MESSAGE.pending;
                newStatus = TX_STATUS.pending;
                break;
              case 'STUCK':
                newMessage = TX_MESSAGE.stuck;
                newStatus = TX_STATUS.stuck;
                break;
              case 'SUCCEEDED':
                newMessage = TX_MESSAGE.confirmed;
                newStatus = TX_STATUS.confirmed;
                break;
              default:
                newMessage = TX_MESSAGE.pending;
                newStatus = TX_STATUS.pending;
                break;
            }

            newProgress[keyOfLatestLoadingAction] = {
              ...newProgress[keyOfLatestLoadingAction],
              [txType]: {
                ...newProgress[keyOfLatestLoadingAction][txType],
                status: newStatus,
                message: newMessage,
              },
            };

            if (txType === 'swap' && res.status === 'SUCCEEDED') {
              onTxComplete();
            }

            return newProgress;
          });
        })
        .catch((error) => {
          if (error instanceof DOMException && error.name === 'AbortError') {
            console.debug('Aborted waiting for TX');
            return;
          }
          console.error(error);
          setIsLoading(false);
        });
    }
    return () => {
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
    };
  }, [anyaltInstance, activeOperationId, transactionsProgress, isLoading]);

  const estimatedTime = useMemo(() => {
    if (!selectedRoute) return 0;

    if (currentStep > selectedRoute.swapSteps.length)
      return lastMileTokenEstimate?.estimatedTimeInSeconds || 0;

    return (
      selectedRoute.swapSteps[currentStep - 1]?.estimatedTimeInSeconds || 0
    );
  }, [selectedRoute, currentStep, lastMileTokenEstimate]);

  const fees = useMemo(() => {
    if (!selectedRoute) return '0';

    if (currentStep > selectedRoute.swapSteps.length)
      return lastMileTokenEstimate?.estimatedFeeInUSD || '0';

    return (
      selectedRoute.swapSteps[currentStep - 1]?.fees
        .reduce((acc, fee) => {
          const amount = parseFloat(fee?.amount);
          const price = fee.price || 0;
          return acc + amount * price;
        }, 0)
        .toFixed(2)
        .toString() || '0'
    );
  }, [selectedRoute, currentStep, lastMileTokenEstimate]);

  return {
    fees,
    runTx,
    isLoading,
    selectedRoute,
    currentStep,
    isBridgeSwap,
    inTokenAmount: selectedTokenAmount,
    estimatedTime,
    transactionsList,
    finalTokenEstimate: lastMileTokenEstimate,
    protocolInputToken: swapResultToken,
    protocolFinalToken: lastMileToken,
    transactionsProgress,
    headerText,
    recentTransaction: transactionsList?.steps?.[currentStep - 1],
  };
};
