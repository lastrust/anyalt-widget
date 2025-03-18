import { BestRouteResponse } from '@anyalt/sdk';
import { useAtomValue } from 'jotai';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  isTokenBuyTemplateAtom,
  pendingOperationAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../../store/stateStore';
import { TokenWithAmount } from '../../../molecules/card/TransactionOverviewCard';

type Props = {
  operationType: 'BEST' | 'PENDING';
};

export const useTransactionList = ({ operationType }: Props) => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const pendingOperation = useAtomValue(pendingOperationAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const inToken = useAtomValue(inTokenAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

  const getToTokenDetails = () => {
    if (isTokenBuyTemplate) {
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

  const getTokensFromOperation = (operation: BestRouteResponse) => {
    return {
      from: {
        contractAddress:
          operation?.swapSteps[0].sourceToken.contractAddress || '',
        symbol: operation?.swapSteps[0].sourceToken.symbol || '',
        logo: operation?.swapSteps[0].sourceToken.logo || '',
        blockchain: operation?.swapSteps[0].sourceToken.blockchain || '',
        amount: Number(operation?.swapSteps[0].amount).toFixed(4) || '',
        blockchainLogo:
          operation?.swapSteps[0].sourceToken.blockchainLogo || '',
        decimals: operation?.swapSteps[0].sourceToken.decimals || 0,
        tokenUsdPrice: operation?.swapSteps[0].sourceToken.tokenUsdPrice || 0,
      },
      to: {
        ...getToTokenDetails(),
      },
    };
  };

  return {
    bestRoute,
    pendingOperation,
    tokens: getTokensFromOperation(
      operationType === 'BEST' ? bestRoute! : pendingOperation!,
    ),
  };
};
