import { Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';
import { TransactionAccordion } from '../accordions/TransactionAccordion';
import { GeneralTransactionInfo } from './TransactionOverview';

export const TransactionStatus = () => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  return (
    <VStack w="100%" alignItems="flex-start" spacing="16px">
      <GeneralTransactionInfo
        requestId={bestRoute?.requestId || ''}
        from={{
          address: bestRoute?.swaps[0].from.address || '',
          symbol: bestRoute?.swaps[0].from.symbol || '',
          logo: bestRoute?.swaps[0].from.logo || '',
          blockchain: bestRoute?.swaps[0].from.blockchain || '',
          amount: Number(bestRoute?.swaps[0].fromAmount).toFixed(2) || '',
          blockchainLogo: bestRoute?.swaps[0].from.blockchainLogo || '',
          decimals: bestRoute?.swaps[0].from.decimals || 0,
          usdPrice: bestRoute?.swaps[0].from.usdPrice || 0,
        }}
        to={{
          address: protocolFinalToken?.address || '',
          symbol: protocolFinalToken?.symbol || '',
          logo: protocolFinalToken?.logoUrl || '',
          blockchain: protocolInputToken?.chain?.displayName || '',
          amount: Number(finalTokenEstimate?.amountOut).toFixed(2) || '',
          blockchainLogo: protocolFinalToken?.logoUrl || '',
          decimals: protocolFinalToken?.decimals || 0,
          usdPrice: Number(finalTokenEstimate?.priceInUSD) || 0,
        }}
      />
      <Text color="white" fontSize="24px" fontWeight="bold">
        Swap Steps
      </Text>
      <TransactionAccordion />
    </VStack>
  );
};
