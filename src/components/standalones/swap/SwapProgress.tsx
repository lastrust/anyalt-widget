import { Divider, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TransactionStatus } from '../../molecules/transaction/TransactionStatus';
import { TokenQuoteBox } from '../TokenQuoteBox';

type Props = {
  exchangeName: string;
  transactionDetails: {
    requestId: string;
    gasPrice: string;
    time: string;
    profit: string;
    from: {
      name: string;
      icon: string;
      amount: string;
      usdAmount: string;
      chainName: string;
      chainIcon: string;
    };
    to: {
      name: string;
      icon: string;
      amount: string;
      usdAmount: string;
      chainName: string;
      chainIcon: string;
    };
    status: string;
  };
};

export const SwapProgress = ({ exchangeName, transactionDetails }: Props) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px">
      <VStack w={'100%'} alignItems={'flex-start'} gap={'16px'} mb="16px">
        <Text color={'brand.secondary.3'}>
          Swap Tokens Using {exchangeName}
        </Text>
        <HStack
          w={'100%'}
          borderWidth={'1px'}
          borderColor={'brand.border.primary'}
          p={'16px 24px'}
          borderRadius={'16px'}
        >
          <HStack>
            <TimeIcon />
            <Text color={'brand.secondary.3'}>{transactionDetails.time}s</Text>
          </HStack>
          <DividerIcon />
          <HStack>
            <GasIcon />
            <Text color={'brand.secondary.3'}>
              $ {transactionDetails.gasPrice}
            </Text>
          </HStack>
          <DividerIcon />
          <Text color={'brand.secondary.3'}>{transactionDetails.profit}</Text>
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
          />
        </VStack>
      </VStack>
      <TransactionStatus
        requestId={transactionDetails.requestId}
        status={transactionDetails.status}
      />
    </Grid>
  );
};
