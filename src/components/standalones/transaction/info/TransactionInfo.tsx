import { Box, Button, Divider, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { ExecuteResponse, Token, WalletConnector } from '../../../..';
import { TransactionInfoCard } from '../../../molecules/card/TransactionInfoCard';
import { TokenQuoteBox } from '../../selectSwap/token/quote/TokenQuoteBox';
import { useTransactionInfo } from './useTransactionInfo';

type Props = {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
};

export const TransactionInfo: FC<Props> = ({
  externalEvmWalletConnector,
  onTxComplete,
  executeCallBack,
}) => {
  const {
    runTx,
    fees,
    isLoading,
    bestRoute,
    currentStep,
    recentTransaction,
    estimatedTime,
  } = useTransactionInfo({
    externalEvmWalletConnector,
    onTxComplete,
    executeCallBack,
  });

  return (
    <VStack
      w={'100%'}
      alignItems={'flex-start'}
      gap={'16px'}
      justifyContent={'space-between'}
      h="88%"
    >
      {bestRoute?.swaps[currentStep - 1] && (
        <>
          <VStack w={'100%'} gap={'16px'}>
            <Box w={'100%'}>
              <VStack alignItems="flex-start" spacing="16px" w={'100%'}>
                <Text textStyle={'regular.1'} color="brand.secondary.3">
                  Swap tokens using {recentTransaction?.swapperId}
                </Text>

                <TransactionInfoCard
                  estimatedTime={estimatedTime}
                  fees={fees}
                />
              </VStack>
            </Box>
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
                tokenName={recentTransaction?.from.symbol || ''}
                tokenLogo={recentTransaction?.from.logo || ''}
                chainName={recentTransaction?.from.blockchain || ''}
                chainLogo={recentTransaction?.from.blockchainLogo || ''}
                amount={Number(recentTransaction?.fromAmount).toFixed(2)}
                price={(
                  Number(recentTransaction?.from.usdPrice) *
                  Number(recentTransaction?.fromAmount)
                ).toFixed(2)}
                w={'100%'}
                p={'0'}
                m={'0'}
              />
              <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
              <TokenQuoteBox
                loading={false}
                headerText=""
                tokenName={recentTransaction?.to.symbol || ''}
                tokenLogo={recentTransaction?.to.logo || ''}
                chainName={recentTransaction?.to.blockchain || ''}
                chainLogo={recentTransaction?.to.blockchainLogo || ''}
                amount={Number(recentTransaction?.toAmount).toFixed(2)}
                price={(
                  Number(recentTransaction?.to.usdPrice) *
                  Number(recentTransaction?.toAmount)
                ).toFixed(2)}
                w={'100%'}
                p={'0'}
                m={'0'}
              />
            </VStack>
          </VStack>
          <VStack w="100%" alignItems={'center'} gap={'16px'}>
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
              isLoading={isLoading}
            >
              Run Transaction
            </Button>
            <Text textDecoration={'underline'} color="#999" cursor={'pointer'}>
              Cancel Transaction
            </Text>
          </VStack>
        </>
      )}
    </VStack>
  );
};
