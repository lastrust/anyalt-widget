import { AnyAlt } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
  activeRouteAtom,
  allChainsAtom,
  anyaltInstanceAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  slippageAtom,
} from '../store/stateStore';
import { EstimateResponse, Token } from '../types/types';

export const useAnyaltWidget = ({
  estimateCallback,
  inputToken,
  finalToken,
  apiKey,
}: {
  estimateCallback: (amountIn: number) => Promise<EstimateResponse>;
  inputToken: Token;
  finalToken: Token;
  apiKey: string;
}) => {
  const [loading, setLoading] = useState(true);
  const { activeStep, goToNext } = useSteps({ index: 0 });
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [protocolInputToken, setProtocolInputToken] = useAtom(
    protocolInputTokenAtom,
  );
  const [, setProtocolFinalToken] = useAtom(protocolFinalTokenAtom);
  const [openSlippageModal, setOpenSlippageModal] = useState(false);
  const inToken = useAtomValue(inTokenAtom);
  const slippage = useAtomValue(slippageAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
  const [, setFinalTokenEstimate] = useAtom(finalTokenEstimateAtom);
  const [routeFailed, setRouteFailed] = useState(false);

  useEffect(() => {
    if (activeRoute) {
      estimateCallback(parseFloat(activeRoute.outputAmount)).then((res) => {
        setFinalTokenEstimate(res);
      });
    }
  }, [activeRoute]);

  useEffect(() => {
    const anyaltInstance = new AnyAlt(apiKey);
    setAnyaltInstance(anyaltInstance);
    if (anyaltInstance) {
      anyaltInstance.getChains().then((res) => {
        setAllChains(res.chains);
      });
    }
    setProtocolFinalToken(finalToken);
  }, []);

  useEffect(() => {
    const inputTokenChain = allChains.find(
      (chain) =>
        chain.chainId === inputToken.chainId &&
        chain.chainType === inputToken.chainType,
    );

    if (inputTokenChain) {
      anyaltInstance
        ?.getToken(inputTokenChain.id, inputToken.address)
        .then((res) => {
          setProtocolInputToken(res);
        });
    }
  }, [allChains, anyaltInstance]);

  const onGetQuote = async () => {
    if (!inToken || !protocolInputToken || !inTokenAmount) return;

    try {
      const route = await anyaltInstance?.getBestRoute({
        from: inToken.id,
        to: protocolInputToken?.id,
        amount: inTokenAmount,
        slippage,
      });

      setActiveRoute(route);
      setLoading(false);
      setRouteFailed(false);
      goToNext();
    } catch (error) {
      console.error(error);
      setRouteFailed(true);
    }
  };

  const { isOpen: isConfirmationOpen, onClose: onConfirmationClose } =
    useDisclosure();

  const handleConfirm = () => {
    setLoading(true);
    goToNext();
  };

  return {
    activeStep,
    onGetQuote,
    handleConfirm,
    isConfirmationOpen,
    onConfirmationClose,
    loading,
    setLoading,
    openSlippageModal,
    setOpenSlippageModal,
    goToNext,
    routeFailed,
  };
};
