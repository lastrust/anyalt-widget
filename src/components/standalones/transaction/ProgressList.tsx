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
      {transactionsProgress[index]?.approve && (
        <ProgressItem
          isApprove={true}
          progress={transactionsProgress[index]?.approve}
        />
      )}
      {transactionsProgress[index]?.swap && (
        <ProgressItem
          isApprove={false}
          progress={transactionsProgress[index]?.swap}
        />
      )}
    </VStack>
  );
};
