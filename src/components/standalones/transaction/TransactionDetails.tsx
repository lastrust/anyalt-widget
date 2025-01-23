import { Button, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';
import { TransactionDetailsType } from './TransactionSwap';

type Props = {
  exchangeName: string;
} & TransactionDetailsType;

export const TransactionDetails = ({
  exchangeName,
  transactionDetails,
}: Props) => {
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
      <Text color={'brand.secondary.3'}>Swap Tokens Using {exchangeName}</Text>
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
            {transactionDetails.time}s
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
            $ {transactionDetails.gasPrice}
          </Text>
        </HStack>
        <DividerIcon />
        <Text color={'brand.secondary.3'} lineHeight={'120%'} fontSize={'16px'}>
          {transactionDetails.profit}
        </Text>
      </HStack>
      <VStack
        w={'100%'}
        p={'24px'}
        borderRadius={'16px'}
        borderWidth={'1px'}
        borderColor={'brand.border.primary'}
      >
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={transactionDetails.from.name}
          tokenLogo={transactionDetails.from.icon}
          chainName={transactionDetails.from.chainName}
          chainLogo={transactionDetails.from.chainIcon}
          amount={transactionDetails.from.amount}
          price={transactionDetails.from.usdAmount}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
        <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={transactionDetails.to.name}
          tokenLogo={transactionDetails.to.icon}
          chainName={transactionDetails.to.chainName}
          chainLogo={transactionDetails.to.chainIcon}
          amount={transactionDetails.to.amount}
          price={transactionDetails.to.usdAmount}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
      </VStack>
      <Button
        width={'100%'}
        bg="brand.tertiary.100"
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
