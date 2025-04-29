import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { Accordion } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import {
  fiatStepCopyAtom,
  isFiatPurchaseCompletedAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  swapResultTokenAtom,
  transactionsProgressAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';
import { FiatSwap } from './FiatSwap';
import { LastMileTxAccordion } from './LastMileTxAccordion';
import { SwapStep } from './SwapStep';

type Props = {
  route: GetAllRoutesResponseItem | undefined;
  currentStep: number;
  operationType: 'CURRENT' | 'PENDING';
};

export const TransactionAccordion = ({
  route,
  currentStep,
  operationType,
}: Props) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const fiatStepCopy = useAtomValue(fiatStepCopyAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);
  const isFiatPurchaseCompleted = useAtomValue(isFiatPurchaseCompletedAtom);
  const transactionsProgress = useAtomValue(transactionsProgressAtom);

  useEffect(() => {
    if (operationType === 'CURRENT') {
      if (currentStep > 0) {
        setExpandedIndexes([currentStep - 1]);
      }
    } else {
      setExpandedIndexes(
        Array.from(
          {
            length: (route?.swapSteps || []).filter(
              (step) => step.transactions.length,
            ).length,
          },
          (_, i) => i,
        ),
      );
    }
  }, [currentStep]);

  const isIncludeFiat = useMemo(
    () => Boolean(route?.fiatStep) || isFiatPurchaseCompleted,
    [route?.fiatStep, isFiatPurchaseCompleted],
  );

  const fiatStep = useMemo(() => {
    if (isFiatPurchaseCompleted) {
      return fiatStepCopy;
    }
    if (route?.fiatStep) {
      return route.fiatStep;
    }

    return undefined;
  }, [isFiatPurchaseCompleted, fiatStepCopy, route?.fiatStep]);

  if (!route) return <></>;

  return (
    <Accordion
      index={expandedIndexes}
      onChange={(indexes) => setExpandedIndexes(indexes as number[])}
      allowMultiple
      w={'full'}
      gap={'12px'}
      display={'flex'}
      flexDir={'column'}
    >
      {isIncludeFiat && (
        <FiatSwap
          fiatStep={fiatStep}
          index={0}
          currentStep={currentStep}
          operationType={operationType}
        />
      )}

      {route?.swapSteps?.map((swapStep, index) => (
        <SwapStep
          swapStep={swapStep}
          index={isIncludeFiat ? index + 1 : index}
          currentStep={currentStep}
          operationType={operationType}
          key={`${swapStep.executionOrder}-${index}`}
          transactionsProgress={transactionsProgress}
        />
      ))}

      {widgetTemplate === 'DEPOSIT_TOKEN' && (
        <LastMileTxAccordion
          route={route}
          isIncludeFiat={isIncludeFiat}
          currentStep={currentStep}
          isLastMileExpanded={expandedIndexes.includes(currentStep - 1)}
          protocolFinalToken={lastMileToken}
          swapResultToken={swapResultToken}
          finalTokenEstimate={lastMileTokenEstimate}
          transactionsProgress={transactionsProgress}
          operationType={operationType}
        />
      )}
    </Accordion>
  );
};
