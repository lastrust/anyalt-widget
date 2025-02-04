import { TransactionProgress } from '@anyalt/sdk';
import { CircularProgress, HStack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { CheckIcon } from '../atoms/icons/transaction/CheckIcon';
import { FailIcon } from '../atoms/icons/transaction/FailIcon';

type Props = {
  progress: TransactionProgress | undefined;
};

export const ProgressItem: FC<Props> = ({ progress }) => {
  if (!progress) return <></>;

  return (
    <HStack spacing={'8px'} w={'100%'} mb={'12px'}>
      {(progress.status === 'signing' ||
        progress.status === 'broadcasting' ||
        progress.status === 'pending') && (
        <CircularProgress
          isIndeterminate
          color="brand.tertiary.100"
          trackColor="transparent"
          size={'20px'}
        />
      )}
      {progress.status === 'confirmed' && <CheckIcon />}
      {progress.status === 'failed' && <FailIcon />}
      <Text fontSize={'16px'} color="brand.secondary.3">
        Swap: {progress.message}
      </Text>
    </HStack>
  );
};
