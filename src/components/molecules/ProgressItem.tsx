import { Box, CircularProgress, HStack, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { TransactionProgress } from '../../types/transaction';
import { CheckIcon } from '../atoms/icons/transaction/CheckIcon';
import { FailIcon } from '../atoms/icons/transaction/FailIcon';

type Props = {
  isApprove: boolean;
  progress: TransactionProgress | undefined;
};

export const ProgressItem: FC<Props> = ({ isApprove, progress }) => {
  if (!progress) return <></>;

  return (
    <VStack spacing={'8px'} alignItems={'flex-start'} w={'100%'}>
      <HStack spacing={'8px'} w={'100%'}>
        {(progress.status === 'signing' ||
          progress.status === 'broadcasting' ||
          progress.status === 'pending') && (
          <CircularProgress
            isIndeterminate
            color="brand.text.active"
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
        <Text
          textStyle={'regular.3'}
          color="brand.text.secondary.2"
          maxW={'370px'}
        >
          {isApprove ? 'Approve' : 'Swap'}: {progress.message}
        </Text>
      </HStack>
      {/* {progress.txHash && progress.chainName && (
        <HStack justifyContent={'space-between'} w="100%">
          <HStack>
            <Text textStyle={'regular.3'} color="brand.text.secondary.2">
              Transaction Hash:
            </Text>
            <Link
              textStyle={'regular.3'}
              color="brand.text.secondary.2"
              href={`${chainExplorers[progress.chainName as keyof typeof chainExplorers]}${progress.txHash}`}
              isExternal
            >
              {progress.txHash.slice(0, 10)}...{progress.txHash.slice(-4)}
            </Link>
          </HStack>
          <Box
            cursor={'pointer'}
            onClick={() => navigator.clipboard.writeText(progress.txHash ?? '')}
          >
            <CopyIcon />
          </Box>
        </HStack>
      )} */}
    </VStack>
  );
};
