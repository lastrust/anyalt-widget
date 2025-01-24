import { Box, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { activeRouteAtom } from '../../../store/stateStore';
import { getTransactionGroupData } from '../../../utils/getTransactionGroupData';
import { CopyIcon } from '../../atoms/icons/transaction/CopyIcon';
import { TokenIconBox } from '../../molecules/TokenIconBox';
import { TransactionAccordion } from '../accordions/TransactionAccordion';

type SwapTokenProps = {
  tokenName: string;
  tokenIcon: string;
  tokenAmount: string;
  networkName: string;
  networkIcon: string;
};

const SwapToken = ({
  tokenName,
  tokenIcon,
  tokenAmount,
  networkName,
  networkIcon,
}: SwapTokenProps) => {
  return (
    <HStack>
      <TokenIconBox
        tokenName={tokenName}
        tokenIcon={tokenIcon}
        chainName={networkName}
        chainIcon={networkIcon}
      />
      <VStack alignItems="flex-start" justifyContent={'space-between'}>
        <Text color="white" textStyle={'extraBold.3'}>
          {tokenAmount}
        </Text>
        <Text color="brand.secondary.3" textStyle={'regular.3'}>
          {tokenName} on {networkName}
        </Text>
      </VStack>
    </HStack>
  );
};

type Props = {
  swapIndex: number;
};

export const TransactionStatus = ({ swapIndex }: Props) => {
  const activeRoute = useAtomValue(activeRouteAtom);
  if (!activeRoute) return null;
  const transactionDetails = getTransactionGroupData(activeRoute);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(transactionDetails[swapIndex].requestId);
  };

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
          Transaction Status
        </Text>
        <HStack justifyContent={'space-between'} w={'100%'}>
          <SwapToken
            tokenName={transactionDetails[swapIndex].from.name}
            tokenIcon={transactionDetails[swapIndex].from.icon || ''}
            tokenAmount={Number(
              transactionDetails[swapIndex].from.amount,
            ).toFixed(2)}
            networkName={transactionDetails[swapIndex].from.chainName || ''}
            networkIcon={transactionDetails[swapIndex].from.chainIcon || ''}
          />
          <SwapToken
            tokenName={transactionDetails[swapIndex].to.name || ''}
            tokenIcon={transactionDetails[swapIndex].to.icon || ''}
            tokenAmount={Number(
              transactionDetails[swapIndex].to.amount,
            ).toFixed(2)}
            networkName={transactionDetails[swapIndex].to.chainName || ''}
            networkIcon={transactionDetails[swapIndex].to.chainIcon || ''}
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
                {transactionDetails[swapIndex].requestId}
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
          transactionDetails={transactionDetails}
        />
      </VStack>
    </VStack>
  );
};
