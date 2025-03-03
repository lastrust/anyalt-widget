import { Box, Divider, HStack, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { TransactionProgress } from '../../../types/transaction';
import { chainExplorers } from '../../../utils/chains';
import { CopyIcon } from '../../atoms/icons/CopyIcon';

type Props = {
  type: 'Approval' | 'Swap';
  progress: TransactionProgress | undefined;
};

export const TransactionHash = ({ type, progress }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    console.log('progress', progress);
    navigator.clipboard.writeText(progress?.txHash ?? '');

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  if (!progress || !progress.txHash || !progress.chainName) return null;

  return (
    <Box w="100%">
      <Divider w="100%" h="1px" bgColor="brand.secondary.12" mb="12px" />
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
            {isCopied
              ? 'Tx Hash Copied!'
              : `${progress?.txHash?.slice(0, 10)}...${progress?.txHash?.slice(
                  -4,
                )}`}
          </Link>
        </HStack>
        <Box cursor={'pointer'} onClick={handleCopy}>
          <CopyIcon />
        </Box>
      </HStack>
    </Box>
  );
};
