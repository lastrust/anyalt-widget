import { SupportedToken } from '@anyalt/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import {
  activeRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';

export const useSelectSwap = () => {
  const [openTokenSelect, setOpenTokenSelect] = useState<boolean>(false);
  const [, setInToken] = useAtom(inTokenAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const activeRoute = useAtomValue(activeRouteAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

  const onTokenSelect = (token: SupportedToken) => {
    setInToken(token);
    setOpenTokenSelect(false);
  };

  const inTokenPrice = useMemo(() => {
    if (!activeRoute || !inTokenAmount) return '';
    const tokenPrice = activeRoute.swaps[0].from.usdPrice;
    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(inTokenAmount)).toFixed(2);
  }, [activeRoute, inTokenAmount]);

  const outTokenPrice = useMemo(() => {
    if (!activeRoute) return '';
    const lastSwap = activeRoute.swaps[activeRoute.swaps.length - 1];
    const tokenPrice = lastSwap.to.usdPrice;
    if (!tokenPrice) return '';
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
