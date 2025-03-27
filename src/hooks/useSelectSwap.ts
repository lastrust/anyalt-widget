import { SupportedToken } from '@anyalt/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  outputTokenAmountAtom,
  outputTokenAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../store/stateStore';

export const useSelectSwap = () => {
  const [openTokenSelect, setOpenTokenSelect] = useState<boolean>(false);
  const [, setInToken] = useAtom(outputTokenAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const activeRoute = useAtomValue(bestRouteAtom);
  const inTokenAmount = useAtomValue(outputTokenAmountAtom);

  const onTokenSelect = (token: SupportedToken) => {
    setInToken(token);
    setOpenTokenSelect(false);
  };

  const inTokenPrice = useMemo(() => {
    if (!activeRoute || !inTokenAmount) return '';

    const tokenPrice = activeRoute.swapSteps[0].sourceToken.tokenUsdPrice;
    if (!tokenPrice) return '';

    return (tokenPrice * parseFloat(inTokenAmount)).toFixed(2);
  }, [activeRoute, inTokenAmount]);

  // This is just copy pasted code from `src/components/standalones/selectSwap/useSelectToken.ts`
  const outTokenPrice = useMemo(() => {
    if (!activeRoute) return '';

    const lastStep = activeRoute.swapSteps[activeRoute.swapSteps.length - 1];
    const tokenPrice = lastStep.destinationToken.tokenUsdPrice || 0;

    return (tokenPrice * parseFloat(activeRoute.outputAmount)).toFixed(2);
  }, [activeRoute]);

  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  return {
    finalTokenEstimate,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    setOpenTokenSelect,
    protocolInputToken,
    protocolFinalToken,
    activeRoute,
    inTokenAmount,
  };
};
