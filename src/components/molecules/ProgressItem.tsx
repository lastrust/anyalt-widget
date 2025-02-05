import { TransactionProgress } from '@anyalt/sdk';
import { Box, CircularProgress, HStack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { CheckIcon } from '../atoms/icons/transaction/CheckIcon';
import { FailIcon } from '../atoms/icons/transaction/FailIcon';

type Props = {
  isApprove: boolean;
  progress: TransactionProgress | undefined;
};

export const ProgressItem: FC<Props> = ({ isApprove, progress }) => {
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
      {progress.status === 'confirmed' && (
        <Box w={'20px'} h={'20px'}>
          <CheckIcon />
        </Box>
      )}
      {progress.status === 'failed' && (
        <Box w={'20px'} h={'20px'}>
          <FailIcon />
        </Box>
      )}
      <Text fontSize={'16px'} color="brand.secondary.3">
        {isApprove ? 'Approve' : 'Swap'}: {progress.message}
      </Text>
    </HStack>
  );
};
