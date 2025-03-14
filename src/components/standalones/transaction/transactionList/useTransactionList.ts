import { useAtomValue } from 'jotai';
import { WidgetTemplateType } from '../../../..';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  widgetTemplateAtom,
} from '../../../../store/stateStore';
import { TokenWithAmount } from '../../../molecules/card/TransactionOverviewCard';

export const useTransactionList = () => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const inToken = useAtomValue(inTokenAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

  const getToTokenDetails = () => {
    if (widgetTemplate === WidgetTemplateType.TOKEN_BUY) {
      return {
        contractAddress: protocolInputToken?.tokenAddress || '',
        symbol: protocolInputToken?.symbol || '',
        logo: protocolInputToken?.logoUrl || '',
        blockchain: protocolInputToken?.chain?.displayName || '',
        amount: Number(bestRoute?.outputAmount).toFixed(4) || '',
        blockchainLogo: protocolInputToken?.chain?.logoUrl || '',
        decimals: protocolInputToken?.decimals || 0,
        tokenUsdPrice:
          Number(
            bestRoute?.swapSteps[bestRoute.swapSteps.length - 1]
              .destinationToken.tokenUsdPrice,
          ) || 0,
      };
    }

    return {
      contractAddress: protocolFinalToken?.address || '',
      symbol: protocolFinalToken?.symbol || '',
      logo: protocolFinalToken?.logoUrl || '',
      blockchain: protocolInputToken?.chain?.displayName || '',
      amount: Number(finalTokenEstimate?.amountOut).toFixed(4) || '',
      blockchainLogo: protocolInputToken?.chain?.logoUrl || '',
      decimals: protocolFinalToken?.decimals || 0,
      tokenUsdPrice: Number(finalTokenEstimate?.priceInUSD) || 0,
    };
  };

  if (!bestRoute || bestRoute?.swapSteps.length === 0) {
    return {
      bestRoute,
      tokens: {
        from: {
          contractAddress: inToken?.tokenAddress || '',
          symbol: inToken?.symbol || '',
          logo: inToken?.logoUrl || '',
          blockchain: inToken?.chain?.displayName || '',
          amount: Number(inTokenAmount).toFixed(4) || '',
          blockchainLogo: inToken?.chain?.logoUrl || '',
          decimals: inToken?.decimals || 0,
          tokenUsdPrice: 0,
        } as TokenWithAmount,
        to: {
          ...getToTokenDetails(),
        } as TokenWithAmount,
      },
    };
  }

  return {
    bestRoute,
    tokens: {
      from: {
        contractAddress:
          bestRoute?.swapSteps[0].sourceToken.contractAddress || '',
        symbol: bestRoute?.swapSteps[0].sourceToken.symbol || '',
        logo: bestRoute?.swapSteps[0].sourceToken.logo || '',
        blockchain: bestRoute?.swapSteps[0].sourceToken.blockchain || '',
        amount: Number(bestRoute?.swapSteps[0].amount).toFixed(4) || '',
        blockchainLogo:
          bestRoute?.swapSteps[0].sourceToken.blockchainLogo || '',
        decimals: bestRoute?.swapSteps[0].sourceToken.decimals || 0,
        tokenUsdPrice: bestRoute?.swapSteps[0].sourceToken.tokenUsdPrice || 0,
      } as TokenWithAmount,
      to: {
        ...getToTokenDetails(),
      } as TokenWithAmount,
    },
  };
};
