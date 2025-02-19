import { VStack } from '@chakra-ui/react';
import { StepsProgress } from '../../../types/transaction';
import { ProgressItem } from '../../molecules/ProgressItem';

export const ProgressList = ({
  stepsProgress,
  index,
}: {
  stepsProgress?: StepsProgress;
  index: number;
}) => {
  if (!stepsProgress) return null;

  return (
    <VStack w={'100%'}>
      {stepsProgress?.steps[index]?.approve && (
        <ProgressItem
          isApprove={true}
          progress={stepsProgress.steps[index]?.approve}
        />
      )}
      {stepsProgress?.steps[index]?.swap && (
        <ProgressItem
          isApprove={false}
          progress={stepsProgress.steps[index]?.swap}
        />
      )}
    </VStack>
  );
};
