import { SupportedToken } from '@anyalt/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import {
  allRoutesAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
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

  const allRoutes = useAtomValue(allRoutesAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);

  const onTokenSelect = (token: SupportedToken) => {
    setSelectedToken(token);
    setOpenTokenSelect(false);
  };

  const inTokenPrice = useMemo(() => {
    if (!allRoutes || !selectedTokenAmount) return '';

    const tokenPrice = allRoutes.swapSteps[0].sourceToken.tokenUsdPrice;
    if (!tokenPrice) return '';

    return (tokenPrice * parseFloat(selectedTokenAmount)).toFixed(2);
  }, [allRoutes, selectedTokenAmount]);

  // This is just copy pasted code from `src/components/standalones/selectSwap/useSelectToken.ts`
  const outTokenPrice = useMemo(() => {
    if (!allRoutes) return '';

    const lastStep = allRoutes.swapSteps[allRoutes.swapSteps.length - 1];
    const tokenPrice = lastStep.destinationToken.tokenUsdPrice || 0;

    return (tokenPrice * parseFloat(allRoutes.outputAmount)).toFixed(2);
  }, [allRoutes]);

  return {
    depositTokenEstimate: lastMileTokenEstimate,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    setOpenTokenSelect,
    protocolInputToken: swapResultToken,
    protocolFinalToken: lastMileToken,
    activeRoute: allRoutes,
    inTokenAmount: selectedTokenAmount,
  };
};
