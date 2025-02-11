import { SupportedToken } from '@anyalt/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';

export const useSelectToken = () => {
  const [openTokenSelect, setOpenTokenSelect] = useState<boolean>(false);

  const [, setInToken] = useAtom(inTokenAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const bestRoute = useAtomValue(bestRouteAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);

  const onTokenSelect = (token: SupportedToken, callback: () => void) => {
    setInToken(token);
    setOpenTokenSelect(false);
    callback();
  };

  const inTokenPrice = useMemo(() => {
    if (!bestRoute || !inTokenAmount) return '';
    const tokenPrice = bestRoute.swaps[0].from.usdPrice;

    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(inTokenAmount)).toFixed(2);
  }, [bestRoute, inTokenAmount]);

  const outTokenPrice = useMemo(() => {
    if (!bestRoute) return '';
    const lastSwap = bestRoute.swaps[bestRoute.swaps.length - 1];
    const tokenPrice = lastSwap.to.usdPrice;

    if (!tokenPrice) return '';
    return (tokenPrice * parseFloat(bestRoute.outputAmount)).toFixed(2);
  }, [bestRoute]);

  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  return {
    isTokenBuyTemplate,
    inTokenPrice,
    outTokenPrice,
    onTokenSelect,
    openTokenSelect,
    setOpenTokenSelect,
    finalTokenEstimate,
    protocolInputToken,
    protocolFinalToken,
    activeRoute: bestRoute,
    inTokenAmount,
  };
};
