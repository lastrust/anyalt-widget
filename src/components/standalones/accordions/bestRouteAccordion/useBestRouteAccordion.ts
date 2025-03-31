import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import {
  allRoutesAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  selectedRouteAtom,
  selectedTokenAmountAtom,
  slippageAtom,
  swapResultTokenAtom,
  widgetTemplateAtom,
} from '../../../../store/stateStore';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';

export const useBestRouteAccordion = () => {
  const slippage = useAtomValue(slippageAtom);
  const allRoutes = useAtomValue(allRoutesAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const [, setSelectedRoute] = useAtom(selectedRouteAtom);

  const fees = useMemo(() => {
    if (!allRoutes) return '0.00';

    const totalFees = allRoutes?.swapSteps
      ?.flatMap((step) => step.fees)
      ?.reduce((acc, fee) => {
        const amount = parseFloat(fee.amount);
        const price = fee.price || 0;
        return acc + amount * price;
      }, 0);

    const totalWithFinalFees =
      totalFees + parseFloat(lastMileTokenEstimate?.estimatedFeeInUSD ?? '0');

    return `$${totalWithFinalFees.toFixed(2).toString() || '0.00'}`;
  }, [allRoutes, lastMileTokenEstimate]);

  const areSwapsExists = useMemo(() => {
    return Boolean(allRoutes?.swapSteps?.length);
  }, [allRoutes]);

  const recentSwap = useMemo(() => {
    return allRoutes?.swapSteps?.[allRoutes?.swapSteps?.length - 1];
  }, [allRoutes]);

  const handleRouteSelect = () => {
    setSelectedRoute(allRoutes);
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
      name: swapResultToken?.symbol || '',
      icon: swapResultToken?.logoUrl || '',
      chainIcon: swapResultToken?.logoUrl || '',
      amount: truncateToDecimals(selectedTokenAmount || '0', 4),
      chainName: swapResultToken?.chain?.displayName || '',
    };
  }, [swapResultToken, selectedTokenAmount]);

  return {
    fees,
    slippage,
    bestRoute: allRoutes,
    widgetTemplate,
    fromToken: areSwapsExists ? finalSwapToken : protocolDepositToken,
    handleRouteSelect,
    protocolFinalToken: lastMileToken,
    protocolInputToken: swapResultToken,
    finalTokenEstimate: lastMileTokenEstimate,
    finalSwapToken,
  };
};
