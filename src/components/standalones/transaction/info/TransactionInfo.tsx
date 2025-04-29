import { Box, Center, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../../..';
import { CustomButton } from '../../../atoms/buttons/CustomButton';
import { ChevronDownIcon } from '../../../atoms/icons/transaction/ChevronDownIcon';
import { CrossChainWarningCard } from '../../../molecules/card/CrossChainWarning';
import { TransactionInfoCard } from '../../../molecules/card/TransactionInfoCard';
import { ProgressList } from '../ProgressList';
import { OnrampTransaction } from './OnrampTransaction';
import { PaymentSelect } from './PaymentSelect';
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
    headerText,
    currentStep,
    onrampFees,
    buttonText,
    selectedRoute,
    estimatedTime,
    inTokenAmount,
    isOnramperStep,
    isContainFiatStep,
    protocolInputToken,
    protocolFinalToken,
    recentTransaction,
    finalTokenEstimate,
    transactionsProgress,
    isChooseOnrampLoading,
    setIsPaymentMethodModalOpen,
    choosenFiatPaymentMethod,
    isPaymentMethodLoading,
  } = useTransactionInfo({
    externalEvmWalletConnector,
    onTxComplete,
    executeCallBack,
    estimateCallback,
  });

  return (
    <VStack
      w={'100%'}
      alignItems={'flex-start'}
      gap={'16px'}
      justifyContent={'space-between'}
      h="100%"
    >
      <VStack w={'100%'} gap={'16px'}>
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
          <ProgressList
            transactionsProgress={transactionsProgress}
            index={currentStep - (isContainFiatStep ? 2 : 1)}
          />
          <TransactionInfoCard
            isOnramperStep={isOnramperStep || false}
            estimatedTime={estimatedTime}
            fees={isOnramperStep ? onrampFees : fees}
          />
        </VStack>

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
        <PaymentSelect
          isOnramperStep={isOnramperStep || false}
          isPaymentMethodLoading={isPaymentMethodLoading}
          choosenFiatPaymentMethod={choosenFiatPaymentMethod}
          setIsPaymentMethodModalOpen={setIsPaymentMethodModalOpen}
        />
      </VStack>
      <VStack w="100%" alignItems={'center'} gap={'16px'}>
        <CustomButton
          isLoading={isLoading}
          isDisabled={
            isLoading || isPaymentMethodLoading || isChooseOnrampLoading
          }
          onButtonClick={runTx}
          loadingText={
            isOnramperStep ? 'Your will be redirected to Onramper' : ''
          }
        >
          {buttonText}
        </CustomButton>
        <Text textDecoration={'underline'} color="#999" cursor={'pointer'}>
          Cancel Transaction
        </Text>
      </VStack>
    </VStack>
  );
};
