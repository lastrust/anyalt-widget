import { Box, Divider, HStack, Link, Text } from '@chakra-ui/react';
import { chainExplorers } from '../../../utils/chains';
import { CopyIcon } from '../../atoms/icons/CopyIcon';
import { TransactionProgress } from '../../standalones/transaction/useHandleTransaction';

type Props = {
  type: 'Approval' | 'Swap';
  progress: TransactionProgress | undefined;
};

export const TransactionHash = ({ type, progress }: Props) => {
  if (!progress || !progress.txHash || !progress.chainName) return null;

  return (
    <Box w="100%">
      <Divider w="100%" h="1px" bgColor="brand.secondary.12" my="12px" />
      <HStack justifyContent={'space-between'} w="100%">
        <HStack>
          <Text textStyle={'regular.3'} color="brand.secondary.3">
            {type} Tx Hash:
          </Text>
          <Link
            textStyle={'regular.3'}
            color="brand.secondary.3"
            href={`${chainExplorers[progress.chainName as keyof typeof chainExplorers]}${progress.txHash}`}
            isExternal
          >
            {progress?.txHash?.slice(0, 10)}...{progress?.txHash?.slice(-4)}
          </Link>
        </HStack>
        <Box
          cursor={'pointer'}
          onClick={() => navigator.clipboard.writeText(progress.txHash ?? '')}
        >
          <CopyIcon />
        </Box>
      </HStack>
    </Box>
  );
};
