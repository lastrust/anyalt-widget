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
  const [, setOutputToken] = useAtom(outputTokenAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);

  const bestRoute = useAtomValue(bestRouteAtom);
  const outputTokenAmount = useAtomValue(outputTokenAmountAtom);

  const onTokenSelect = (token: SupportedToken) => {
    setOutputToken(token);
    setOpenTokenSelect(false);
  };

  const inTokenPrice = useMemo(() => {
    if (!bestRoute || !outputTokenAmount) return '';

    const tokenPrice = bestRoute.swapSteps[0].sourceToken.tokenUsdPrice;
    if (!tokenPrice) return '';

    return (tokenPrice * parseFloat(outputTokenAmount)).toFixed(2);
  }, [bestRoute, outputTokenAmount]);

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
    protocolInputToken,
    protocolFinalToken,
    activeRoute: bestRoute,
    inTokenAmount: outputTokenAmount,
  };
};
