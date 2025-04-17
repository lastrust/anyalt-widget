import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EstimateResponse } from '../../../..';
import {
  allRoutesAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  selectedRouteAtom,
  selectedTokenAtom,
  selectedTokenOrFiatAmountAtom,
  slippageAtom,
  swapResultTokenAtom,
  widgetTemplateAtom,
} from '../../../../store/stateStore';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';

type Props = {
  estimateOutPut: (
    route: GetAllRoutesResponseItem,
  ) => Promise<EstimateResponse>;
};

export const useChoosingRoutesAccordion = ({ estimateOutPut }: Props) => {
  const slippage = useAtomValue(slippageAtom);
  const allRoutes = useAtomValue(allRoutesAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const selectedToken = useAtomValue(selectedTokenAtom);

  const selectedRef = useRef<HTMLDivElement>(null);

  const calcTokenPrice = (route: GetAllRoutesResponseItem) => {
    if (!route || route.swapSteps.length === 0) return '';
    const lastStep = route.swapSteps[route.swapSteps.length - 1];
    const tokenPrice = lastStep.destinationToken.tokenUsdPrice;

    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(route.outputAmount)).toFixed(2);
  };

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedRoute]);

  const isSameToken = useMemo(() => {
    return selectedToken?.id === swapResultToken?.id && selectedRoute;
  }, [selectedToken, swapResultToken, selectedRoute]);

  const defaultAccordionOpen = useMemo(() => {
    if (allRoutes)
      return selectedRoute
        ? [
            allRoutes?.findIndex(
              (route) => route.routeId === selectedRoute.routeId,
            ),
          ]
        : [0];
  }, [selectedRoute]);

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

  const [routeEstimates, setRouteEstimates] =
    useState<Record<string, EstimateResponse>>();

  useEffect(() => {
    const fetchEstimates = async () => {
      if (!allRoutes) return;
      const estimates: Record<string, EstimateResponse> = {};
      for (const route of allRoutes) {
        try {
          const res = await estimateOutPut(route);
          estimates[route.routeId] = res;
        } catch (err) {
          console.log(err);
          estimates[route.routeId] = {
            amountOut: '0.00',
            priceInUSD: '0.00',
          };
        }
      }
      setRouteEstimates(estimates);
    };
    fetchEstimates();
  }, [allRoutes, estimateOutPut]);

  const areSwapsExists = useMemo(() => {
    return Boolean(selectedRoute?.swapSteps?.length);
  }, [selectedRoute]);

  const lastSwap = useMemo(() => {
    return selectedRoute?.swapSteps?.[selectedRoute?.swapSteps?.length - 1];
  }, [selectedRoute]);

  const handleRouteSelect = (route: GetAllRoutesResponseItem) => {
    setSelectedRoute(route);
  };

  const finalSwapToken = useMemo(() => {
    return {
      name: lastSwap?.destinationToken?.symbol || '',
      amount: truncateToDecimals(lastSwap?.payout || '0', 4),
      chainName: lastSwap?.destinationToken?.blockchain || '',
      icon: lastSwap?.destinationToken?.logo || '',
      chainIcon: lastSwap?.destinationToken?.blockchainLogo || '',
    };
  }, [lastSwap]);

  const protocolDepositToken = useMemo(() => {
    return {
      name: swapResultToken?.symbol || '',
      icon: swapResultToken?.logoUrl || '',
      chainIcon: swapResultToken?.logoUrl || '',
      amount: truncateToDecimals(selectedTokenOrFiatAmount || '0', 4),
      chainName: swapResultToken?.chain?.displayName || '',
    };
  }, [swapResultToken, selectedTokenOrFiatAmount]);

  return {
    slippage,
    allRoutes,
    isSameToken,
    selectedRoute,
    selectedRef,
    widgetTemplate,
    routeEstimates,
    defaultAccordionOpen,
    fromToken: areSwapsExists ? finalSwapToken : protocolDepositToken,
    protocolFinalToken: lastMileToken,
    protocolInputToken: swapResultToken,
    finalTokenEstimate: lastMileTokenEstimate,
    calcFees,
    calcTokenPrice,
    finalSwapToken,
    handleRouteSelect,
  };
};
