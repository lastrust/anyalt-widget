import { Box, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { activeRouteAtom } from '../../../store/stateStore';
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

export const TransactionStatus = () => {
  const activeRoute = useAtomValue(activeRouteAtom);
  const transactionDetails =
    activeRoute?.swaps[0].internalSwaps?.map((swap) => ({
      requestId: activeRoute?.requestId || '',
      gasPrice: activeRoute?.swaps[0].fee[0]?.price?.toString() || '0',
      time: activeRoute?.swaps[0].estimatedTimeInSeconds?.toString() || '0',
      profit: '0.00',
      from: {
        name: swap.from.symbol,
        icon: swap.from.logo,
        amount: activeRoute?.swaps[0].fromAmount || '0',
        usdAmount: swap.from.usdPrice?.toString() || '0',
        chainName: swap.from.blockchain,
        chainIcon: swap.from.blockchainLogo,
      },
      to: {
        name: swap.to.symbol,
        icon: swap.to.logo,
        amount: activeRoute?.swaps[0].toAmount || '0',
        usdAmount: swap.to.usdPrice?.toString() || '0',
        chainName: swap.to.blockchain,
        chainIcon: swap.to.blockchainLogo,
      },
      status: 'Pending',
    })) || [];

  const handleCopyClick = () => {
    navigator.clipboard.writeText(transactionDetails[0].requestId);
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
            tokenName={transactionDetails[0].from.name}
            tokenIcon={transactionDetails[0].from.icon}
            tokenAmount={Number(transactionDetails[0].from.amount).toFixed(2)}
            networkName={transactionDetails[0].from.chainName}
            networkIcon={transactionDetails[0].from.chainIcon}
          />
          <SwapToken
            tokenName={transactionDetails[0].to.name}
            tokenIcon={transactionDetails[0].to.icon}
            tokenAmount={Number(transactionDetails[0].to.amount).toFixed(2)}
            networkName={transactionDetails[0].to.chainName}
            networkIcon={transactionDetails[0].to.chainIcon}
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
                {transactionDetails[0].requestId}
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
      <VStack w={'full'} gap={'12px'}>
        <TransactionAccordion />
      </VStack>
    </VStack>
  );
};
