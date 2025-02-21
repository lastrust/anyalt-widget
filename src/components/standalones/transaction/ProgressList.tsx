import { VStack } from '@chakra-ui/react';
import { TransactionsProgress } from '../../../types/transaction';
import { ProgressItem } from '../../molecules/ProgressItem';

type Props = {
  transactionsProgress?: TransactionsProgress;
  index: number;
};

export const ProgressList = ({ transactionsProgress, index }: Props) => {
  if (!transactionsProgress) return null;

  return (
    <VStack w={'100%'}>
      {transactionsProgress?.transactions[index]?.approve && (
        <ProgressItem
          isApprove={true}
          progress={transactionsProgress.transactions[index]?.approve}
        />
      )}
      {transactionsProgress?.transactions[index]?.swap && (
        <ProgressItem
          isApprove={false}
          progress={transactionsProgress.transactions[index]?.swap}
        />
      )}
    </VStack>
  );
};
