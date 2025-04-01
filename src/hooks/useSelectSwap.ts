import { SupportedToken } from '@anyalt/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import {
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  selectedRouteAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  swapResultTokenAtom,
} from '../store/stateStore';

export const useSelectSwap = () => {
  const [openTokenSelect, setOpenTokenSelect] = useState<boolean>(false);
  const [, setSelectedToken] = useAtom(selectedTokenAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const selectedRoute = useAtomValue(selectedRouteAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);

  const onTokenSelect = (token: SupportedToken) => {
    setSelectedToken(token);
    setOpenTokenSelect(false);
  };

  const inTokenPrice = useMemo(() => {
    if (!selectedRoute || !selectedTokenAmount) return '';

    const tokenPrice = selectedRoute.swapSteps[0].sourceToken.tokenUsdPrice;
    if (!tokenPrice) return '';

    return (tokenPrice * parseFloat(selectedTokenAmount)).toFixed(2);
  }, [selectedRoute, selectedTokenAmount]);

  // This is just copy pasted code from `src/components/standalones/selectSwap/useSelectToken.ts`
  const outTokenPrice = useMemo(() => {
    if (!selectedRoute) return '';

    const lastStep =
      selectedRoute.swapSteps[selectedRoute.swapSteps.length - 1];
    const tokenPrice = lastStep.destinationToken.tokenUsdPrice || 0;

    return (tokenPrice * parseFloat(selectedRoute.outputAmount)).toFixed(2);
  }, [selectedRoute]);

  return {
    depositTokenEstimate: lastMileTokenEstimate,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    setOpenTokenSelect,
    protocolInputToken: swapResultToken,
    protocolFinalToken: lastMileToken,
    activeRoute: selectedRoute,
    inTokenAmount: selectedTokenAmount,
  };
};
