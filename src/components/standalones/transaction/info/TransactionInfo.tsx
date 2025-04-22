import { Box, Center, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../../..';
import { CustomButton } from '../../../atoms/buttons/CustomButton';
import { ArrowIcon } from '../../../atoms/icons/payments/ArrowIcon';
import { CardIcon } from '../../../atoms/icons/payments/CardIcon';
import { ChevronDownIcon } from '../../../atoms/icons/transaction/ChevronDownIcon';
import { CrossChainWarningCard } from '../../../molecules/card/CrossChainWarning';
import { TransactionInfoCard } from '../../../molecules/card/TransactionInfoCard';
import { LoadingFallback } from '../../../molecules/fallback/LoadingFallback';
import { ProgressList } from '../ProgressList';
import { OnrampTransaction } from './OnrampTransaction';
import { TokenTransaction } from './TokenTransaction';
import { useTransactionInfo } from './useTransactionInfo';

type Props = {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
};

export const SepartionBlock = () => (
  <Box position="relative" w="100%">
    <Divider w="100%" h="1px" bgColor="brand.bg.primary" />
    <Center
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
    >
      <ChevronDownIcon />
    </Center>
  </Box>
);

export const TransactionInfo: FC<Props> = ({
  externalEvmWalletConnector,
  onTxComplete,
  executeCallBack,
  estimateCallback,
}) => {
  const {
    fees,
    runTx,
    isLoading,
    selectedRoute,
    headerText,
    currentStep,
    estimatedTime,
    inTokenAmount,
    protocolInputToken,
    protocolFinalToken,
    recentTransaction,
    finalTokenEstimate,
    transactionsProgress,
    setIsPaymentMethodModalOpen,
    choosenFiatPaymentMethod,
    isPaymentMethodLoading,
    isOnramperStep,
    onrampFees,
  } = useTransactionInfo({
    externalEvmWalletConnector,
    onTxComplete,
    executeCallBack,
    estimateCallback,
  });

  return (
    <>
      <VStack
        w={'100%'}
        alignItems={'flex-start'}
        gap={'16px'}
        justifyContent={'space-between'}
        h="100%"
      >
        <VStack w={'100%'} gap={'16px'}>
          <Box w={'100%'}>
            <VStack alignItems="flex-start" spacing="12px" w={'100%'}>
              <HStack justifyContent={'space-between'} w={'100%'}>
                <Text
                  textStyle={'regular.2'}
                  color="brand.text.secondary.2"
                  w={'100%'}
                  whiteSpace={'nowrap'}
                >
                  {headerText}
                </Text>
                <CrossChainWarningCard />
              </HStack>
              {transactionsProgress?.length && (
                <ProgressList
                  transactionsProgress={transactionsProgress}
                  index={currentStep - 1}
                />
              )}

              <TransactionInfoCard
                isOnramperStep={isOnramperStep || false}
                estimatedTime={estimatedTime}
                fees={isOnramperStep ? onrampFees : fees}
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
            {isOnramperStep ? (
              <OnrampTransaction
                selectedRoute={selectedRoute}
                inTokenAmount={inTokenAmount}
              />
            ) : (
              <TokenTransaction
                selectedRoute={selectedRoute}
                recentTransaction={recentTransaction}
                protocolInputToken={protocolInputToken}
                protocolFinalToken={protocolFinalToken}
                finalTokenEstimate={finalTokenEstimate}
                inTokenAmount={inTokenAmount}
              />
            )}
          </VStack>
          {isOnramperStep && (
            <HStack
              onClick={() => setIsPaymentMethodModalOpen(true)}
              cursor={'pointer'}
              w={'100%'}
              justifyContent={'space-between'}
              borderRadius={'8px'}
              bgColor={'brand.bg.cardBg'}
              p="8px"
            >
              <HStack gap="8px">
                <LoadingFallback
                  loading={isPaymentMethodLoading}
                  w={'80px'}
                  h={'16px'}
                >
                  <>
                    <CardIcon />
                    <Text
                      color={'brand.text.secondary.2'}
                      textStyle={'regular.3'}
                    >
                      {choosenFiatPaymentMethod?.name}
                    </Text>
                  </>
                </LoadingFallback>
              </HStack>
              <ArrowIcon />
            </HStack>
          )}
        </VStack>
        <VStack w="100%" alignItems={'center'} gap={'16px'}>
          <CustomButton
            isLoading={isLoading}
            isDisabled={isLoading}
            onButtonClick={runTx}
          >
            {isOnramperStep
              ? `Buy ${selectedRoute?.fiatStep?.middleToken.symbol}`
              : 'Execute Transaction'}
          </CustomButton>
          <Text textDecoration={'underline'} color="#999" cursor={'pointer'}>
            Cancel Transaction
          </Text>
        </VStack>
      </VStack>
    </>
  );
};
