import { Box, Button, Divider, Flex, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { FC, useState } from 'react';
import { ExecuteResponse, WalletConnector } from '../../..';
import {
  activeOperationIdAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  finalTokenEstimateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  slippageAtom,
} from '../../../store/stateStore';
import { CopyIcon } from '../../atoms/icons/transaction/CopyIcon';
import { TokenQuoteBox } from '../token/quote/TokenQuoteBox';
import { useHandleTransaction } from './useHandleTransaction';

type Props = {
  externalEvmWalletConnector: WalletConnector;
  onTxComplete: () => void;
  executeCallBack: (amountIn: string) => Promise<ExecuteResponse>;
};

export const TransactionInfo: FC<Props> = ({
  externalEvmWalletConnector,
  onTxComplete,
  executeCallBack,
}) => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const { executeSwap } = useHandleTransaction(externalEvmWalletConnector);
  const activeOperationId = useAtomValue(activeOperationIdAtom);
  const slippage = useAtomValue(slippageAtom);
  const [isLoading, setIsLoading] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(bestRoute?.requestId || '');
  };

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
      <Box w={'100%'}>
        <Text color="white" fontSize="24px" fontWeight="bold" mb="8px">
          Swap
        </Text>
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
          tokenName={bestRoute?.swaps[0].from.symbol || ''}
          tokenLogo={bestRoute?.swaps[0].from.logo || ''}
          chainName={bestRoute?.swaps[0].from.blockchain || ''}
          chainLogo={bestRoute?.swaps[0].from.blockchainLogo || ''}
          amount={Number(bestRoute?.swaps[0].fromAmount).toFixed(2)}
          price={(
            Number(bestRoute?.swaps[0].from.usdPrice) *
            Number(bestRoute?.swaps[0].fromAmount)
          ).toFixed(2)}
          w={'100%'}
          p={'0'}
          m={'0'}
        />
        <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
        <TokenQuoteBox
          loading={false}
          headerText=""
          tokenName={protocolFinalToken?.symbol || ''}
          tokenLogo={protocolFinalToken?.logoUrl || ''}
          chainName={protocolInputToken?.chain?.displayName || ''}
          chainLogo={protocolInputToken?.chain?.logoUrl || ''}
          amount={finalTokenEstimate?.amountOut || ''}
          price={finalTokenEstimate?.priceInUSD || ''}
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
