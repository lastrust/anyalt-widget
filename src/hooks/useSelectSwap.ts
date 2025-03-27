import { SupportedToken } from '@anyalt/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import {
  bestRouteAtom,
  depositTokenAtom,
  finalTokenEstimateAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  swapResultTokenAtom,
} from '../store/stateStore';

export const useSelectSwap = () => {
  const [openTokenSelect, setOpenTokenSelect] = useState<boolean>(false);
  const [, setSelectedToken] = useAtom(selectedTokenAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const depositToken = useAtomValue(depositTokenAtom);

  const bestRoute = useAtomValue(bestRouteAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);

  const onTokenSelect = (token: SupportedToken) => {
    setSelectedToken(token);
    setOpenTokenSelect(false);
  };

  const inTokenPrice = useMemo(() => {
    if (!bestRoute || !selectedTokenAmount) return '';

    const tokenPrice = bestRoute.swapSteps[0].sourceToken.tokenUsdPrice;
    if (!tokenPrice) return '';

    return (tokenPrice * parseFloat(selectedTokenAmount)).toFixed(2);
  }, [bestRoute, selectedTokenAmount]);

  // This is just copy pasted code from `src/components/standalones/selectSwap/useSelectToken.ts`
  const outTokenPrice = useMemo(() => {
    if (!bestRoute) return '';

    const lastStep = bestRoute.swapSteps[bestRoute.swapSteps.length - 1];
    const tokenPrice = lastStep.destinationToken.tokenUsdPrice || 0;

    return (tokenPrice * parseFloat(bestRoute.outputAmount)).toFixed(2);
  }, [bestRoute]);

  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  return {
    finalTokenEstimate,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    setOpenTokenSelect,
    protocolInputToken: swapResultToken,
    protocolFinalToken: depositToken,
    activeRoute: bestRoute,
    inTokenAmount: selectedTokenAmount,
  };
};
