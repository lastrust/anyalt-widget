import { Box, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import {
  activeRouteAtom,
  finalTokenEstimateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';
import { getTransactionGroupData } from '../../../utils/getTransactionGroupData';
import { CopyIcon } from '../../atoms/icons/transaction/CopyIcon';
import { SwapTokenCard } from '../../molecules/card/SwapTokenCard';
import { TransactionAccordion } from '../accordions/TransactionAccordion';

type Props = {
  swapIndex: number;
};

export const TransactionStatus = ({ swapIndex }: Props) => {
  const activeRoute = useAtomValue(activeRouteAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);

  if (!activeRoute) return null;
  const swaps = getTransactionGroupData(activeRoute);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(swaps[swapIndex].requestId);
  };

  useEffect(() => {
    console.log(swaps);
  }, [swaps]);

  return (
    <VStack
      p="16px"
      w="100%"
      borderRadius={'16px'}
      alignItems="flex-start"
      spacing="16px"
      borderColor={'brand.border.primary'}
      borderWidth={'1px'}
    >
      <VStack
        w="100%"
        p="16px"
        borderRadius="16px"
        borderWidth="1px"
        borderColor="brand.border.primary"
        alignItems="flex-start"
        gap={'16px'}
      >
        <Text color="white" textStyle={'heading.2'}>
          Transaction Details
        </Text>
        <HStack justifyContent={'space-between'} w={'100%'}>
          <SwapTokenCard
            tokenName={swaps[swapIndex].from.name}
            tokenIcon={swaps[swapIndex].from.icon || ''}
            tokenAmount={swaps[swapIndex].fromAmount}
            networkName={swaps[swapIndex].from.chainName || ''}
            networkIcon={swaps[swapIndex].from.chainIcon || ''}
          />
          <SwapTokenCard
            tokenIcon={protocolFinalToken?.logoUrl ?? ''}
            tokenName={protocolFinalToken?.symbol ?? ''}
            networkIcon={protocolInputToken?.chain?.logoUrl ?? ''}
            networkName={protocolInputToken?.chain?.displayName ?? ''}
            tokenAmount={finalTokenEstimate?.amountOut ?? ''}
          />
        </HStack>
        <Divider />
        <VStack alignItems="flex-start" spacing="16px" w={'100%'}>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Text color="brand.secondary.3" fontSize="14px">
              Request ID:
            </Text>
            <Flex alignItems="center" gap="8px">
              <Text color="brand.secondary.3" textStyle="regular.3">
                {swaps[swapIndex].requestId}
              </Text>
              <Box
                as="button"
                onClick={handleCopyClick}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
              >
                <CopyIcon />
              </Box>
            </Flex>
          </Flex>
        </VStack>
      </VStack>
      <VStack w={'full'} gap={'16px'} alignItems={'flex-start'}>
        <Text color="white" textStyle={'heading.2'}>
          Swap Steps
        </Text>
        <TransactionAccordion
          swapIndex={swapIndex}
          transactionDetails={swaps}
        />
      </VStack>
    </VStack>
  );
};
