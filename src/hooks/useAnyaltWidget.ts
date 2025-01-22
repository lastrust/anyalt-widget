import { AnyAlt } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  activeRouteAtom,
  allChainsAtom,
  anyaltInstanceAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
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
  const { connected: isSolanaConnected } = useWallet();
  const { isConnected: isEvmConnected } = useAccount();

  const [loading, setLoading] = useState(false);
  const { activeStep, goToNext } = useSteps({ index: 0 });

  const inToken = useAtomValue(inTokenAtom);
  const slippage = useAtomValue(slippageAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

  const [openSlippageModal, setOpenSlippageModal] = useState(false);

  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
  const [, setFinalTokenEstimate] = useAtom(finalTokenEstimateAtom);
  const [selectedRoute] = useAtom(selectedRouteAtom);
  const [, setProtocolFinalToken] = useAtom(protocolFinalTokenAtom);
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [protocolInputToken, setProtocolInputToken] = useAtom(
    protocolInputTokenAtom,
  );

  const {
    isOpen: isConnectWalletsOpen,
    onClose: connectWalletsClose,
    onOpen: connectWalletsOpen,
  } = useDisclosure();

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
    if (selectedRoute) {
      setActiveRoute(selectedRoute);
    }
  }, [selectedRoute]);

  useEffect(() => {
    const inputTokenChain = allChains.find(
      (chain) =>
        chain.chainId === inputToken.chainId &&
        chain.chainType === inputToken.chainType,
    );

    console.log(inToken);
    if (inputTokenChain) {
      anyaltInstance
        ?.getToken(inputTokenChain.id, inputToken.address)
        .then((res) => {
          setProtocolInputToken(res);
        });
    }
  }, [allChains, anyaltInstance]);

  const onCalculateButtonClick = async () => {
    try {
      setLoading(true);
      if (!inToken || !protocolInputToken || !inTokenAmount) return;

      const route = await anyaltInstance?.getBestRoute({
        from: inToken.id,
        to: protocolInputToken?.id,
        amount: inTokenAmount,
        slippage,
      });

      setActiveRoute(route);
      goToNext();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onChooseRouteButtonClick = () => {
    if (isSolanaConnected && isEvmConnected) goToNext();
    else connectWalletsOpen();
  };

  const onConfigClick = () => {
    setOpenSlippageModal(true);
  };

  const { isOpen: isConfirmationOpen, onClose: onConfirmationClose } =
    useDisclosure();

  const handleConfirm = () => {
    goToNext();
  };

  return {
    loading,
    goToNext,
    setLoading,
    activeStep,
    activeRoute,
    onConfigClick,
    isSolanaConnected,
    isEvmConnected,
    onCalculateButtonClick,
    onChooseRouteButtonClick,
    handleConfirm,
    openSlippageModal,
    isConfirmationOpen,
    connectWalletsOpen,
    onConfirmationClose,
    connectWalletsClose,
    isConnectWalletsOpen,
    setOpenSlippageModal,
  };
};
