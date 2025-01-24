import { Button, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { FC, useState } from 'react';
import {
  activeOperationIdAtom,
  activeRouteAtom,
  anyaltInstanceAtom,
  slippageAtom,
} from '../../../store/stateStore';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';
import {
  TransactionProgress,
  useHandleTransaction,
} from './useHandleTransaction';

type Props = {
  swapIndex: number;
};

export const TransactionDetails: FC<Props> = ({ swapIndex }) => {
  const activeRoute = useAtomValue(activeRouteAtom);
  const activeSwap = activeRoute?.swaps[swapIndex];
  console.log(activeRoute, swapIndex);
  const transactionDetails = {
    requestId: activeRoute?.requestId || '',
    gasPrice: activeSwap?.fee[0]?.price?.toString() || '0',
    time: activeSwap?.estimatedTimeInSeconds?.toString() || '0',
    profit: '0.00',
    from: {
      name: activeSwap?.from.symbol || '',
      icon: activeSwap?.from.logo,
      amount: activeSwap?.fromAmount || '0',
      usdAmount: activeSwap?.from.usdPrice?.toString() || '0',
      chainName: activeSwap?.from.blockchain,
      chainIcon: activeSwap?.from.blockchainLogo,
    },
    to: {
      name: activeSwap?.to.symbol,
      icon: activeSwap?.to.logo,
      amount: activeSwap?.toAmount || '0',
      usdAmount: activeSwap?.to.usdPrice?.toString() || '0',
      chainName: activeSwap?.to.blockchain,
      chainIcon: activeSwap?.to.blockchainLogo,
    },
    status: 'Pending',
  };

  console.log(transactionDetails);

  const [internalSwapIndex] = useState(0);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const { executeSwap } = useHandleTransaction();
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const slippage = useAtomValue(slippageAtom);

  const handleTransactionProgress = (progress: TransactionProgress) => {
    console.log(progress);
  };

  const runTx = async () => {
    if (!anyaltInstance || !activeOperationId) return;

    await executeSwap(
      anyaltInstance,
      activeOperationId,
      slippage,
      activeRoute?.swaps || [],
      handleTransactionProgress,
    );
  };

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
          Step {swapIndex + 1}
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
            {
              activeSwap?.internalSwaps?.[internalSwapIndex]
                ?.estimatedTimeInSeconds
            }
            s
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
            $ {Number(activeSwap?.fee[0]?.price || '0').toFixed(2)}
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
          tokenName={transactionDetails.from.name}
          tokenLogo={transactionDetails.from.icon || ''}
          chainName={transactionDetails.from.chainName || ''}
          chainLogo={transactionDetails.from.chainIcon || ''}
          amount={Number(transactionDetails.from.amount).toFixed(2)}
          price={(
            Number(transactionDetails.from.usdAmount) *
            Number(transactionDetails.from.amount)
          ).toFixed(2)}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
        <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={transactionDetails.to.name || ''}
          tokenLogo={transactionDetails.to.icon || ''}
          chainName={transactionDetails.to.chainName || ''}
          chainLogo={transactionDetails.to.chainIcon || ''}
          amount={Number(transactionDetails.to.amount).toFixed(2)}
          price={(
            Number(transactionDetails.to.usdAmount) *
            Number(transactionDetails.to.amount)
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
        onClick={runTx}
        isLoading={false}
      >
        Run Transaction
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
