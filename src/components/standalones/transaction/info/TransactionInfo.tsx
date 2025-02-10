import { Box, Center, Divider, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { FC } from 'react';
import { ExecuteResponse, Token, WalletConnector } from '../../../..';
import { stepsProgressAtom } from '../../../../store/stateStore';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { CustomButton } from '../../../atoms/buttons/CustomButton';
import { ChevronDownIcon } from '../../../atoms/icons/transaction/ChevronDownIcon';
import { TransactionInfoCard } from '../../../molecules/card/TransactionInfoCard';
import { TokenQuoteBox } from '../../selectSwap/token/quote/TokenQuoteBox';
import { ProgressList } from '../ProgressList';
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
  const stepsProgress = useAtomValue(stepsProgressAtom);

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
            <Text textStyle={'regular.1'} color="brand.secondary.3">
              {bestRoute?.swapSteps?.length &&
              bestRoute?.swapSteps?.length >= currentStep
                ? `${bestRoute.swapSteps[currentStep - 1].swapperType === 'BRIDGE' ? 'Bridge' : 'Swap'} tokens using ${bestRoute.swapSteps[currentStep - 1].swapperName}`
                : `Depositing tokens to ${recentTransaction?.to.tokenName}`}
            </Text>
            <ProgressList
              stepsProgress={stepsProgress}
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
          <TokenQuoteBox
            loading={false}
            headerText=""
            tokenName={recentTransaction?.from.tokenName || ''}
            tokenLogo={recentTransaction?.from.tokenLogo || ''}
            chainName={recentTransaction?.from.blockchain || ''}
            chainLogo={recentTransaction?.from.blockchainLogo || ''}
            amount={Number(recentTransaction?.from.tokenAmount).toFixed(4)}
            price={(
              Number(recentTransaction?.from.tokenUsdPrice) *
              Number(recentTransaction?.from.tokenAmount)
            ).toFixed(2)}
            w={'100%'}
            p={'0'}
            m={'0'}
          />

          <Box position="relative" w="100%">
            <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
            <Center
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <ChevronDownIcon />
            </Center>
          </Box>

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
        </VStack>
      </VStack>
      <VStack w="100%" alignItems={'center'} gap={'16px'}>
        <CustomButton
          isLoading={isLoading}
          isDisabled={false}
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
