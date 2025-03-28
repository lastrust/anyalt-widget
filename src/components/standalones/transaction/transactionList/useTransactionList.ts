import { useAtomValue } from 'jotai';
import {
  bestRouteAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  swapResultTokenAtom,
  widgetTemplateAtom,
} from '../../../../store/stateStore';
import { TokenWithAmount } from '../../../molecules/card/TransactionOverviewCard';

export const useTransactionList = () => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const selectedToken = useAtomValue(selectedTokenAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const getToTokenDetails = () => {
    if (widgetTemplate === 'TOKEN_BUY') {
      return {
        contractAddress: swapResultToken?.tokenAddress || '',
        symbol: swapResultToken?.symbol || '',
        logo: swapResultToken?.logoUrl || '',
        blockchain: swapResultToken?.chain?.displayName || '',
        amount: Number(bestRoute?.outputAmount).toFixed(4) || '',
        blockchainLogo: swapResultToken?.chain?.logoUrl || '',
        decimals: swapResultToken?.decimals || 0,
        tokenUsdPrice:
          Number(
            bestRoute?.swapSteps[bestRoute.swapSteps.length - 1]
              .destinationToken.tokenUsdPrice,
          ) || 0,
      };
    }

    return {
      contractAddress: lastMileToken?.address || '',
      symbol: lastMileToken?.symbol || '',
      logo: lastMileToken?.logoUrl || '',
      blockchain: swapResultToken?.chain?.displayName || '',
      amount: Number(lastMileTokenEstimate?.amountOut).toFixed(4) || '',
      blockchainLogo: swapResultToken?.chain?.logoUrl || '',
      decimals: lastMileToken?.decimals || 0,
      tokenUsdPrice: Number(lastMileTokenEstimate?.priceInUSD) || 0,
    };
  };

  if (!bestRoute || bestRoute?.swapSteps.length === 0) {
    return {
      bestRoute,
      tokens: {
        from: {
          contractAddress: selectedToken?.tokenAddress || '',
          symbol: selectedToken?.symbol || '',
          logo: selectedToken?.logoUrl || '',
          blockchain: selectedToken?.chain?.displayName || '',
          amount: Number(selectedTokenAmount).toFixed(4) || '',
          blockchainLogo: selectedToken?.chain?.logoUrl || '',
          decimals: selectedToken?.decimals || 0,
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
