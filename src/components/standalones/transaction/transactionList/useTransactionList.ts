import { useAtomValue } from 'jotai';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
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
  const inToken = useAtomValue(inTokenAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

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
            bestRoute?.swaps?.length === 0
              ? 0
              : bestRoute?.swaps[bestRoute.swaps.length - 1]?.to.usdPrice,
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

  if (!bestRoute || bestRoute?.swaps.length === 0) {
    return {
      bestRoute,
      tokens: {
        from: {
          address: inToken?.tokenAddress || '',
          symbol: inToken?.symbol || '',
          logo: inToken?.logoUrl || '',
          blockchain: inToken?.chain?.displayName || '',
          amount: Number(inTokenAmount).toFixed(4) || '',
          blockchainLogo: inToken?.chain?.logoUrl || '',
          decimals: inToken?.decimals || 0,
          usdPrice: 0,
        },
        to: {
          ...getToTokenDetails(),
        },
      },
    };
  }

  return {
    bestRoute,
    tokens: {
      from: {
        address: bestRoute?.swaps[0].from.address || '',
        symbol: bestRoute?.swaps[0].from.symbol || '',
        logo: bestRoute?.swaps[0].from.logo || '',
        blockchain: bestRoute?.swaps[0].from.blockchain || '',
        amount: Number(bestRoute?.swaps[0].fromAmount).toFixed(4) || '',
        blockchainLogo: bestRoute?.swaps[0].from.blockchainLogo || '',
        decimals: bestRoute?.swaps[0].from.decimals || 0,
        usdPrice: bestRoute?.swaps[0].from.usdPrice || 0,
      },
      to: {
        ...getToTokenDetails(),
      },
    },
  };
};
