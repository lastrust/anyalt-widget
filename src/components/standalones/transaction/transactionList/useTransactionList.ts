import { useAtomValue } from 'jotai';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../../store/stateStore';

export const useTransactionList = () => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  const getToTokenDetails = () => {
    if (isTokenBuyTemplate) {
      return {
        address: protocolInputToken?.tokenAddress || '',
        symbol: protocolInputToken?.symbol || '',
        logo: protocolInputToken?.logoUrl || '',
        blockchain: protocolInputToken?.chain?.displayName || '',
        amount: Number(bestRoute?.outputAmount).toFixed(4) || '',
        blockchainLogo: protocolInputToken?.chain?.logoUrl || '',
        decimals: protocolInputToken?.decimals || 0,
        usdPrice:
          Number(
            bestRoute?.swapSteps[bestRoute.swapSteps.length - 1]
              .destinationToken.tokenUsdPrice,
          ) || 0,
      };
    }

    return {
      address: protocolFinalToken?.address || '',
      symbol: protocolFinalToken?.symbol || '',
      logo: protocolFinalToken?.logoUrl || '',
      blockchain: protocolInputToken?.chain?.displayName || '',
      amount: Number(finalTokenEstimate?.amountOut).toFixed(4) || '',
      blockchainLogo: protocolInputToken?.chain?.logoUrl || '',
      decimals: protocolFinalToken?.decimals || 0,
      usdPrice: Number(finalTokenEstimate?.priceInUSD) || 0,
    };
  };

  return {
    bestRoute,
    tokens: {
      from: {
        address: bestRoute?.swapSteps[0].sourceToken.contractAddress || '',
        symbol: bestRoute?.swapSteps[0].sourceToken.symbol || '',
        logo: bestRoute?.swapSteps[0].sourceToken.logo || '',
        blockchain: bestRoute?.swapSteps[0].sourceToken.blockchain || '',
        amount: Number(bestRoute?.swapSteps[0].amount).toFixed(4) || '',
        blockchainLogo:
          bestRoute?.swapSteps[0].sourceToken.blockchainLogo || '',
        decimals: bestRoute?.swapSteps[0].sourceToken.decimals || 0,
        usdPrice: bestRoute?.swapSteps[0].sourceToken.tokenUsdPrice || 0,
      },
      to: {
        ...getToTokenDetails(),
      },
    },
  };
};
