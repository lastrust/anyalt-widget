import { Button, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { FC, useState } from 'react';
import {
  activeOperationIdAtom,
  activeRouteAtom,
  anyaltInstanceAtom,
  slippageAtom,
} from '../../../store/stateStore';
import { getTransactionGroupData } from '../../../utils/getTransactionGroupData';
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
  setSwapIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const TransactionInfo: FC<Props> = ({ swapIndex, setSwapIndex }) => {
  const activeRoute = useAtomValue(activeRouteAtom);
  const activeSwap = activeRoute?.swaps[swapIndex];

  if (!activeRoute) return null;
  const transactionDetails = getTransactionGroupData(activeRoute);

  const [internalSwapIndex] = useState(0);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const { executeSwap } = useHandleTransaction();
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const slippage = useAtomValue(slippageAtom);

  const handleTransactionProgress = (progress: TransactionProgress) => {
    console.log(progress);
  };

  const runTx = async () => {
    setSwapIndex(swapIndex + 1);
    if (!anyaltInstance || !activeOperationId) return;

    // await executeSwap(
    //   anyaltInstance,
    //   activeOperationId,
    //   slippage,
    //   activeRoute?.swaps || [],
    //   handleTransactionProgress,
    // );
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
          tokenName={transactionDetails[swapIndex].from.name}
          tokenLogo={transactionDetails[swapIndex].from.icon || ''}
          chainName={transactionDetails[swapIndex].from.chainName || ''}
          chainLogo={transactionDetails[swapIndex].from.chainIcon || ''}
          amount={Number(transactionDetails[swapIndex].fromAmount).toFixed(2)}
          price={(
            Number(transactionDetails[swapIndex].from.usdAmount) *
            Number(transactionDetails[swapIndex].fromAmount)
          ).toFixed(2)}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
        <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={transactionDetails[swapIndex].to.name || ''}
          tokenLogo={transactionDetails[swapIndex].to.icon || ''}
          chainName={transactionDetails[swapIndex].to.chainName || ''}
          chainLogo={transactionDetails[swapIndex].to.chainIcon || ''}
          amount={Number(transactionDetails[swapIndex].toAmount).toFixed(2)}
          price={(
            Number(transactionDetails[swapIndex].to.usdAmount) *
            Number(transactionDetails[swapIndex].toAmount)
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
