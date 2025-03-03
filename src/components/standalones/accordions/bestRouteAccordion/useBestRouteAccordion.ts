import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  slippageAtom,
} from '../../../../store/stateStore';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';

export const useBestRouteAccordion = () => {
  const slippage = useAtomValue(slippageAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const [bestRoute] = useAtom(bestRouteAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const [, setSelectedRoute] = useAtom(selectedRouteAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

  const fees = useMemo(() => {
    if (!bestRoute) return '0.00';

    const totalFees = bestRoute?.swapSteps
      ?.flatMap((step) => step.fees)
      ?.reduce((acc, fee) => {
        const amount = parseFloat(fee.amount);
        const price = fee.price || 0;
        return acc + amount * price;
      }, 0);

    const totalWithFinalFees =
      totalFees + parseFloat(finalTokenEstimate?.estimatedFeeInUSD ?? '0');

    return `$${totalWithFinalFees.toFixed(2).toString() || '0.00'}`;
  }, [bestRoute, finalTokenEstimate]);

  const areSwapsExists = useMemo(() => {
    return Boolean(bestRoute?.swapSteps?.length);
  }, [bestRoute]);

  const recentSwap = useMemo(() => {
    return bestRoute?.swapSteps?.[bestRoute?.swapSteps?.length - 1];
  }, [bestRoute]);

  const handleRouteSelect = () => {
    setSelectedRoute(bestRoute);
  };

  const finalSwapToken = useMemo(() => {
    return {
      name: recentSwap?.destinationToken?.symbol || '',
      amount: truncateToDecimals(recentSwap?.payout || '0', 4),
      chainName: recentSwap?.destinationToken?.blockchain || '',
      icon: recentSwap?.destinationToken?.logo || '',
      chainIcon: recentSwap?.destinationToken?.blockchainLogo || '',
    };
  }, [recentSwap]);

  const protocolDepositToken = useMemo(() => {
    return {
      name: protocolInputToken?.symbol || '',
      icon: protocolInputToken?.logoUrl || '',
      chainIcon: protocolInputToken?.logoUrl || '',
      amount: truncateToDecimals(inTokenAmount || '0', 4),
      chainName: protocolInputToken?.chain?.displayName || '',
    };
  }, [protocolInputToken, inTokenAmount]);

  return {
    fees,
    slippage,
    bestRoute,
    fromToken: areSwapsExists ? finalSwapToken : protocolDepositToken,
    handleRouteSelect,
    isTokenBuyTemplate,
    protocolFinalToken,
    protocolInputToken,
    finalTokenEstimate,
    finalSwapToken,
  };
};
