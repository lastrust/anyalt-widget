import { Box, Divider, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
    navigator.clipboard.writeText(progress?.txHash ?? '');

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    console.debug('~progress', progress);
  }, [progress]);

  if (!progress || !progress.txHash || !progress.chainName) return null;

  return (
    <Box w="100%">
      <Divider w="100%" h="1px" bgColor="brand.bg.primary" mb="12px" />
      <VStack w="100%" spacing="8px" align="stretch">
        <HStack justifyContent={'space-between'} w="100%">
          <HStack>
            <Text textStyle={'regular.3'} color="brand.text.secondary.2">
              {type} Tx Hash:
            </Text>
            <Link
              textStyle={'regular.3'}
              color="brand.text.secondary.2"
              href={`${chainExplorers[progress.chainName as keyof typeof chainExplorers]}${progress.txHash}`}
              isExternal
            >
              {isCopied
                ? 'Tx Hash Copied!'
                : `${progress?.txHash?.slice?.(0, 10)}...${progress?.txHash?.slice(
                    -4,
                  )}`}
            </Link>
          </HStack>
          <Box cursor={'pointer'} onClick={handleCopy}>
            <CopyIcon />
          </Box>
        </HStack>

        {progress?.outboundTxHash && (
          <HStack justifyContent={'space-between'} w="100%">
            <HStack>
              <Text textStyle={'regular.3'} color="brand.text.secondary.2">
                Outbound Tx Hash:
              </Text>
              <Link
                textStyle={'regular.3'}
                color="brand.text.secondary.2"
                href={`${chainExplorers[progress.chainName as keyof typeof chainExplorers]}${progress.outboundTxHash}`}
                isExternal
              >
                {isCopied
                  ? 'Tx Hash Copied!'
                  : `${progress?.outboundTxHash?.slice?.(0, 10)}...${progress?.outboundTxHash?.slice(
                      -4,
                    )}`}
              </Link>
            </HStack>
            <Box
              cursor={'pointer'}
              onClick={() =>
                navigator.clipboard.writeText(progress.outboundTxHash!)
              }
            >
              <CopyIcon />
            </Box>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};
