import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { Accordion } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
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
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

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
      {route.fiatStep && (
        <FiatSwap
          fiatStep={route.fiatStep}
          index={0}
          currentStep={currentStep}
          operationType={operationType}
        />
      )}

      {route?.swapSteps?.map((swapStep, index) => (
        <SwapStep
          swapStep={swapStep}
          index={route.fiatStep ? index + 1 : index}
          currentStep={currentStep}
          operationType={operationType}
          key={`${swapStep.executionOrder}-${index}`}
          transactionsProgress={transactionsProgress}
        />
      ))}

      {widgetTemplate === 'DEPOSIT_TOKEN' && (
        <LastMileTxAccordion
          route={route}
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
