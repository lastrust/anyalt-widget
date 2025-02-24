import { Text, VStack } from '@chakra-ui/react';
import { TransactionOverviewCard } from '../../../molecules/card/TransactionOverviewCard';
import { TransactionAccordion } from '../../accordions/TransactionAccordion';
import { useTransactionList } from './useTransactionList';

export const TransactionList = () => {
  const { tokens, bestRoute } = useTransactionList();

  return (
    <VStack w="100%" alignItems="flex-start" spacing="16px">
      <TransactionOverviewCard
        operationId={bestRoute?.operationId ?? ''}
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
