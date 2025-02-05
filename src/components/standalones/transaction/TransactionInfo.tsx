import { Box, Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { ExecuteResponse, Token, WalletConnector } from '../../..';
import { useHandleTransaction } from '../../../hooks/useHandleTransaction';
import {
  activeOperationIdAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  currentStepAtom,
  selectedRouteAtom,
  slippageAtom,
} from '../../../store/stateStore';
import { CopyIcon } from '../../atoms/icons/transaction/CopyIcon';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';

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
  const bestRoute = useAtomValue(bestRouteAtom);

  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const { executeSwap } = useHandleTransaction(externalEvmWalletConnector);
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const slippage = useAtomValue(slippageAtom);
  const [isLoading, setIsLoading] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(bestRoute?.requestId || '');
  };

  const currentStep = useAtomValue(currentStepAtom);
  const [selectedRoute] = useAtom(selectedRouteAtom);

  const runTx = async () => {
    if (!anyaltInstance || !activeOperationId) return;
    setIsLoading(true);
    try {
      await executeSwap(
        anyaltInstance,
        activeOperationId,
        slippage,
        bestRoute?.swaps || [],
        executeCallBack,
      );
      onTxComplete();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoute) {
      console.log('selectedRoute', selectedRoute.swaps[currentStep - 1]);
    }
  });

  return (
    <VStack w={'100%'} alignItems={'flex-start'} gap={'16px'}>
      <Box w={'100%'}>
        <VStack alignItems="flex-start" spacing="16px" w={'100%'}>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Text color="brand.secondary.3" fontSize="14px">
              Request ID:
            </Text>
            <Flex alignItems="center" gap="8px">
              <Text color="brand.secondary.3" textStyle="regular.3">
                {bestRoute?.requestId}
              </Text>
              <Box
                as="button"
                onClick={handleCopyClick}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
              >
                <CopyIcon />
              </Box>
            </Flex>
          </Flex>
        </VStack>
      </Box>
      <VStack
        w={'100%'}
        p={'16px'}
        borderRadius={'16px'}
        borderWidth={'1px'}
        borderColor={'brand.border.primary'}
        mb="50px"
      >
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={bestRoute?.swaps[currentStep - 1].from.symbol || ''}
          tokenLogo={bestRoute?.swaps[currentStep - 1].from.logo || ''}
          chainName={bestRoute?.swaps[currentStep - 1].from.blockchain || ''}
          chainLogo={
            bestRoute?.swaps[currentStep - 1].from.blockchainLogo || ''
          }
          amount={Number(bestRoute?.swaps[currentStep - 1].fromAmount).toFixed(
            2,
          )}
          price={(
            Number(bestRoute?.swaps[currentStep - 1].from.usdPrice) *
            Number(bestRoute?.swaps[currentStep - 1].fromAmount)
          ).toFixed(2)}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
        <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={bestRoute?.swaps[currentStep - 1].to.symbol || ''}
          tokenLogo={bestRoute?.swaps[currentStep - 1].to.logo || ''}
          chainName={bestRoute?.swaps[currentStep - 1].to.blockchain || ''}
          chainLogo={bestRoute?.swaps[currentStep - 1].to.blockchainLogo || ''}
          amount={Number(bestRoute?.swaps[currentStep - 1].toAmount).toFixed(2)}
          price={(
            Number(bestRoute?.swaps[currentStep - 1].to.usdPrice) *
            Number(bestRoute?.swaps[currentStep - 1].toAmount)
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
        isLoading={isLoading}
      >
        Run Transaction
      </Button>
    </VStack>
  );
};
