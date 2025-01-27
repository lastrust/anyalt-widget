import { TransactionProgress } from '@anyalt/sdk';
import { CircularProgress, HStack, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { getImageURL } from '../../utils';

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
      {progress.status === 'confirmed' && (
        <Image
          src={getImageURL('check-icon.svg')}
          alt={'check-icon'}
          width="20px"
          height="20px"
        />
      )}
      {progress.status === 'failed' && (
        <Image
          src={getImageURL('fail-icon.svg')}
          alt={'fail-icon'}
          width="20px"
          height="20px"
        />
      )}
      <Text fontSize={'16px'} color="brand.secondary.3">
        Swap: {progress.message}
      </Text>
    </HStack>
  );
};
