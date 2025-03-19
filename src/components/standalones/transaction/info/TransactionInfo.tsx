import { Box, Center, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import {
  EstimateResponse,
  ExecuteResponse,
  Token,
  WalletConnector,
} from '../../../..';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { CustomButton } from '../../../atoms/buttons/CustomButton';
import { ChevronDownIcon } from '../../../atoms/icons/transaction/ChevronDownIcon';
import { CrossChainWarningCard } from '../../../molecules/card/CrossChainWarning';
import { TransactionInfoCard } from '../../../molecules/card/TransactionInfoCard';
import { TokenQuoteBox } from '../../selectSwap/token/quote/TokenQuoteBox';
import { ProgressList } from '../ProgressList';
import { useTransactionInfo } from './useTransactionInfo';

type Props = {
  externalEvmWalletConnector?: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amount: Token) => Promise<ExecuteResponse>;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
};

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
    bestRoute,
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

  return (
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
                textStyle={'regular.1'}
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
            <TransactionInfoCard estimatedTime={estimatedTime} fees={fees} />
          </VStack>
        </Box>
        <VStack
          w={'100%'}
          p={'16px'}
          borderRadius={'16px'}
          borderWidth={'1px'}
          borderColor={'brand.border.primary'}
        >
          {bestRoute?.swapSteps &&
            (bestRoute?.swapSteps?.length > 0 ? (
              <TokenQuoteBox
                loading={false}
                headerText=""
                tokenName={recentTransaction?.from.tokenName || ''}
                tokenLogo={recentTransaction?.from.tokenLogo || ''}
                chainName={recentTransaction?.from.blockchain || ''}
                chainLogo={recentTransaction?.from.blockchainLogo || ''}
                amount={Number(recentTransaction?.from.tokenAmount).toFixed(5)}
                price={(
                  Number(recentTransaction?.from.tokenUsdPrice) *
                  Number(recentTransaction?.from.tokenAmount)
                ).toFixed(2)}
                w={'100%'}
                p={'0'}
                m={'0'}
              />
            ) : (
              <TokenQuoteBox
                loading={false}
                headerText=""
                tokenName={protocolInputToken?.symbol || ''}
                tokenLogo={protocolInputToken?.logoUrl || ''}
                chainName={protocolInputToken?.chain?.displayName || ''}
                chainLogo={protocolInputToken?.chain?.logoUrl || ''}
                amount={Number(inTokenAmount ?? 0).toFixed(4)}
                price={'0.00'}
                w={'100%'}
                p={'0'}
                m={'0'}
              />
            ))}

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

          {bestRoute?.swapSteps &&
            (bestRoute.swapSteps.length > 0 ? (
              <TokenQuoteBox
                loading={false}
                headerText=""
                tokenName={recentTransaction?.to.tokenName || ''}
                tokenLogo={recentTransaction?.to.tokenLogo || ''}
                chainName={recentTransaction?.to.blockchain || ''}
                chainLogo={recentTransaction?.to.blockchainLogo || ''}
                amount={truncateToDecimals(
                  recentTransaction?.to.tokenAmount || '',
                  4,
                )}
                price={(
                  Number(recentTransaction?.to.tokenUsdPrice) *
                  Number(recentTransaction?.to.tokenAmount)
                ).toFixed(2)}
                w={'100%'}
                p={'0'}
                m={'0'}
              />
            ) : (
              <TokenQuoteBox
                loading={false}
                headerText=""
                tokenName={protocolFinalToken?.symbol || ''}
                tokenLogo={protocolFinalToken?.logoUrl || ''}
                chainName={protocolInputToken?.chain?.displayName || ''}
                chainLogo={protocolInputToken?.chain?.logoUrl || ''}
                amount={truncateToDecimals(
                  finalTokenEstimate?.amountOut || '',
                  4,
                )}
                price={finalTokenEstimate?.priceInUSD || '0.00'}
                w={'100%'}
                p={'0'}
                m={'0'}
              />
            ))}
        </VStack>
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
  );
};
