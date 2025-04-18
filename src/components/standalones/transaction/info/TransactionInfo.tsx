import { Box, Center, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { FC, useMemo } from 'react';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../../..';
import {
  choosenFiatPaymentAtom,
  isPaymentMethodModalOpenAtom,
} from '../../../../store/stateStore';
import { CustomButton } from '../../../atoms/buttons/CustomButton';
import { ChevronDownIcon } from '../../../atoms/icons/transaction/ChevronDownIcon';
import { CrossChainWarningCard } from '../../../molecules/card/CrossChainWarning';
import { TransactionInfoCard } from '../../../molecules/card/TransactionInfoCard';
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
  } = useTransactionInfo({
    externalEvmWalletConnector,
    onTxComplete,
    executeCallBack,
    estimateCallback,
  });

  const isOnramperStep = useMemo(() => {
    return selectedRoute?.fiatStep && currentStep === 1;
  }, [selectedRoute, currentStep]);

  const [, setIsPaymentMethodModalOpen] = useAtom(isPaymentMethodModalOpenAtom);
  const choosenFiatPaymentMethod = useAtomValue(choosenFiatPaymentAtom);

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
            <VStack alignItems="flex-start" spacing="16px" w={'100%'}>
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
                index={currentStep - 1}
              />
              {!isOnramperStep && (
                <TransactionInfoCard
                  estimatedTime={estimatedTime}
                  fees={fees}
                />
              )}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1.6665 6.33398C1.6665 5.67094 1.9299 5.03506 2.39874 4.56622C2.86758 4.09738 3.50346 3.83398 4.1665 3.83398H15.8332C16.4962 3.83398 17.1321 4.09738 17.6009 4.56622C18.0698 5.03506 18.3332 5.67094 18.3332 6.33398V7.16732H1.6665V6.33398ZM1.6665 8.83398V14.6673C1.6665 15.3304 1.9299 15.9662 2.39874 16.4351C2.86758 16.9039 3.50346 17.1673 4.1665 17.1673H15.8332C16.4962 17.1673 17.1321 16.9039 17.6009 16.4351C18.0698 15.9662 18.3332 15.3304 18.3332 14.6673V8.83398H1.6665ZM5.83317 10.5007C5.61216 10.5007 5.4002 10.5884 5.24392 10.7447C5.08763 10.901 4.99984 11.113 4.99984 11.334C4.99984 11.555 5.08763 11.767 5.24392 11.9232C5.4002 12.0795 5.61216 12.1673 5.83317 12.1673H9.99984C10.2209 12.1673 10.4328 12.0795 10.5891 11.9232C10.7454 11.767 10.8332 11.555 10.8332 11.334C10.8332 11.113 10.7454 10.901 10.5891 10.7447C10.4328 10.5884 10.2209 10.5007 9.99984 10.5007H5.83317Z"
                  fill="#333333"
                />
              </svg>
              <Text color={'brand.text.secondary.2'} textStyle={'regular.3'}>
                {choosenFiatPaymentMethod?.name}
              </Text>
            </HStack>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="5"
              viewBox="0 0 8 5"
              fill="none"
            >
              <path
                d="M1 1.25L4 4.25L7 1.25"
                stroke="#999999"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              </svg>
            </HStack>
          )}
        </VStack>
        <VStack w="100%" alignItems={'center'} gap={'16px'}>
          <CustomButton
            isLoading={isLoading}
            isDisabled={isLoading}
            onButtonClick={runTx}
          >
            Execute Transaction
          </CustomButton>
          <Text textDecoration={'underline'} color="#999" cursor={'pointer'}>
            Cancel Transaction
          </Text>
        </VStack>
      </VStack>
    </>
  );
};
