import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
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

export const useAllRoutesAccordion = () => {
  const slippage = useAtomValue(slippageAtom);
  const allRoutes = useAtomValue(allRoutesAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const calcFees = (route: GetAllRoutesResponseItem) => {
    const totalFees = route?.swapSteps
      ?.flatMap((step) => step.fees)
      ?.reduce((acc, fee) => {
        const amount = parseFloat(fee.amount);
        const price = fee.price || 0;
        return acc + amount * price;
      }, 0);

    return `$${totalFees.toFixed(2).toString() || '0.00'}`;
  };

  const areSwapsExists = useMemo(() => {
    return Boolean(selectedRoute?.swapSteps?.length);
  }, [allRoutes]);

  const recentSwap = useMemo(() => {
    return selectedRoute?.swapSteps?.[selectedRoute?.swapSteps?.length - 1];
  }, [allRoutes]);

  const handleRouteSelect = (route: GetAllRoutesResponseItem) => {
    setSelectedRoute(route);
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
    slippage,
    allRoutes,
    widgetTemplate,
    fromToken: areSwapsExists ? finalSwapToken : protocolDepositToken,
    handleRouteSelect,
    protocolFinalToken: lastMileToken,
    protocolInputToken: swapResultToken,
    finalTokenEstimate: lastMileTokenEstimate,
    calcFees,
    finalSwapToken,
  };
};
