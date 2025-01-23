import { Button, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { activeRouteAtom } from '../../../store/stateStore';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';

export const TransactionDetails = () => {
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
  return (
    <VStack
      w={'100%'}
      p="24px"
      alignItems={'flex-start'}
      gap={'16px'}
      borderColor={'brand.border.primary'}
      borderWidth={'1px'}
      borderRadius={'16px'}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text color="white" fontSize="24px" fontWeight="bold">
          Step 1
        </Text>
      </Flex>
      <Text color={'brand.secondary.3'}>
        Swap Tokens Using {activeRoute?.swaps[0].swapperId}
      </Text>
      <HStack
        w={'100%'}
        p={'16px 24px'}
        border={'1px solid'}
        borderColor={'brand.border.primary'}
        borderRadius={'16px'}
      >
        <HStack>
          <TimeIcon />
          <Text
            color={'brand.secondary.3'}
            lineHeight={'120%'}
            fontSize={'16px'}
          >
            {activeRoute?.swaps[0].estimatedTimeInSeconds}s
          </Text>
        </HStack>
        <DividerIcon />
        <HStack>
          <GasIcon />
          <Text
            color={'brand.secondary.3'}
            lineHeight={'120%'}
            fontSize={'16px'}
          >
            $ {Number(activeRoute?.swaps[0].fee[0]?.price || '0').toFixed(2)}
          </Text>
        </HStack>
        <DividerIcon />
        <Text color={'brand.secondary.3'} lineHeight={'120%'} fontSize={'16px'}>
          {'0'}
        </Text>
      </HStack>
      <VStack
        w={'100%'}
        p={'16px'}
        borderRadius={'16px'}
        borderWidth={'1px'}
        borderColor={'brand.border.primary'}
      >
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={transactionDetails[0].from.name}
          tokenLogo={transactionDetails[0].from.icon}
          chainName={transactionDetails[0].from.chainName}
          chainLogo={transactionDetails[0].from.chainIcon}
          amount={Number(transactionDetails[0].from.amount).toFixed(2)}
          price={(
            Number(transactionDetails[0].from.usdAmount) *
            Number(transactionDetails[0].from.amount)
          ).toFixed(2)}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
        <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={transactionDetails[0].to.name}
          tokenLogo={transactionDetails[0].to.icon}
          chainName={transactionDetails[0].to.chainName}
          chainLogo={transactionDetails[0].to.chainIcon}
          amount={Number(transactionDetails[0].to.amount).toFixed(2)}
          price={(
            Number(transactionDetails[0].to.usdAmount) *
            Number(transactionDetails[0].to.amount)
          ).toFixed(2)}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
      </VStack>
      <Button
        width={'100%'}
        bg="brand.tertiary.100"
        _hover={{
          bg: 'brand.tertiary.20',
        }}
        color="white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        h="64px"
        onClick={() => {}}
        isLoading={false}
      >
        Approve
      </Button>
      <Text
        color="#999"
        fontSize="16px"
        textDecoration={'underline'}
        m={'0 auto'}
        cursor={'pointer'}
      >
        Cancel Transaction
      </Text>
    </VStack>
  );
};
