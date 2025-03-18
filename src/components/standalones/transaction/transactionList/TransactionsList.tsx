import { Text, VStack } from '@chakra-ui/react';
import { TransactionOverviewCard } from '../../../molecules/card/TransactionOverviewCard';
import { TransactionAccordion } from '../../accordions/TransactionAccordion';
import { useTransactionList } from './useTransactionList';

type Props = {
  operationType: 'BEST' | 'PENDING';
};

export const TransactionList = ({ operationType }: Props) => {
  const { tokens, bestRoute, pendingOperation } = useTransactionList({
    operationType,
  });

  return (
    <VStack w="100%" alignItems="flex-start" spacing="16px">
      <TransactionOverviewCard
        operationId={
          operationType === 'BEST'
            ? (bestRoute?.operationId ?? '')
            : (pendingOperation?.operationId ?? '')
        }
        from={tokens.from}
        to={tokens.to}
      />
      <Text color="brand.text.primary" textStyle={'bold.0'} lineHeight={'130%'}>
        Swap Steps
      </Text>
      <TransactionAccordion />
    </VStack>
  );
};
