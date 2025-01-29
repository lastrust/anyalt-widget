import { AnyAlt } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ChainType, EstimateResponse, Token } from '..';
import {
  activeOperationIdAtom,
  allChainsAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  slippageAtom,
} from '../store/stateStore';

export const useAnyaltWidget = ({
  estimateCallback,
  inputToken,
  finalToken,
  apiKey,
  minDepositAmount,
}: {
  estimateCallback: (amount: string) => Promise<EstimateResponse>;
  inputToken: Token;
  finalToken: Token;
  apiKey: string;
  minDepositAmount: number;
}) => {
  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const {
    address: evmAddress,
    isConnected: isEvmConnected,
    chain,
  } = useAccount();

  const [loading, setLoading] = useState(false);
  const [secondPageButtonText, setSecondPageButtonText] = useState<string>('');
  const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({
    index: 0,
  });

  const inToken = useAtomValue(inTokenAtom);
  const slippage = useAtomValue(slippageAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

  const [openSlippageModal, setOpenSlippageModal] = useState(false);

  const [activeRoute, setActiveRoute] = useAtom(bestRouteAtom);
  const [, setFinalTokenEstimate] = useAtom(finalTokenEstimateAtom);
  const [selectedRoute] = useAtom(selectedRouteAtom);
  const [, setProtocolFinalToken] = useAtom(protocolFinalTokenAtom);
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [protocolInputToken, setProtocolInputToken] = useAtom(
    protocolInputTokenAtom,
  );
  const [, setActiveOperationId] = useAtom(activeOperationIdAtom);
  const [failedToFetchRoute, setFailedToFetchRoute] = useState(false);
  const [isValidAmountIn, setIsValidAmountIn] = useState(true);

  const {
    isOpen: isConnectWalletsOpen,
    onClose: connectWalletsClose,
    onOpen: connectWalletsOpen,
  } = useDisclosure();

  useEffect(() => {
    if (activeRoute) {
      estimateCallback(activeRoute.outputAmount.toString()).then((res) => {
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

    if (inputTokenChain) {
      anyaltInstance
        ?.getToken(inputTokenChain.id, inputToken.address)
        .then((res) => {
          setProtocolInputToken(res);
        });
    }
  }, [allChains, anyaltInstance]);

  const onGetQuote = async (withGoNext: boolean = true) => {
    if (!inToken || !protocolInputToken || !inTokenAmount) return;

    try {
      setLoading(true);

      const route = await anyaltInstance?.getBestRoute({
        from: inToken.id,
        to: protocolInputToken?.id,
        amount: inTokenAmount,
        slippage,
      });

      setActiveRoute(route);
      setLoading(false);

      if (route && parseFloat(route.outputAmount) < minDepositAmount) {
        setIsValidAmountIn(false);
      } else {
        setIsValidAmountIn(true);
        setFailedToFetchRoute(false);
        if (withGoNext) {
          goToNext();
        }
      }
    } catch (error) {
      console.error(error);
      setFailedToFetchRoute(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inTokenAmount) {
      onGetQuote(false);
    }
  }, [inTokenAmount]);

  const onConfigClick = () => {
    setOpenSlippageModal(true);
  };

  const onChooseRouteButtonClick = () => {
    if (areWalletsConnected) {
      connectWalletsConfirm();
    } else {
      connectWalletsOpen();
    }
  };

  const connectWalletsConfirm = async () => {
    try {
      setLoading(true);
      if (!activeRoute?.requestId) return;

      const selectedWallets: Record<string, string> = {};
      activeRoute.swaps.forEach((swap) => {
        if (
          swap.from.blockchain === 'SOLANA' ||
          swap.to.blockchain === 'SOLANA'
        ) {
          selectedWallets['SOLANA'] = solanaAddress?.toString() || '';
        }
        const fromChain = allChains.find(
          (chain) => chain.name === swap.from.blockchain,
        );
        const toChain = allChains.find(
          (chain) => chain.name === swap.to.blockchain,
        );
        if (fromChain?.chainType === ChainType.EVM) {
          selectedWallets[swap.from.blockchain] = evmAddress || '';
        }
        if (toChain?.chainType === ChainType.EVM) {
          selectedWallets[swap.to.blockchain] = evmAddress || '';
        }
      });

      const res = await anyaltInstance?.confirmRoute({
        selectedRoute: {
          requestId: activeRoute.requestId,
        },
        selectedWallets,
        destination: evmAddress || '',
      });

      console.log(res);

      if (!res?.operationId || !res?.result)
        throw new Error('Failed to confirm route');

      setActiveOperationId(res?.operationId);
      setActiveRoute(res?.result);

      connectWalletsClose();
      goToNext();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onBackClick = () => {
    if (activeStep === 2) {
      setActiveStep(0);
    } else {
      goToPrevious();
    }
  };

  const onTxComplete = () => {
    setActiveStep(3);
  };

  const areWalletsConnected = useMemo(() => {
    let isSolanaRequired = false;
    let isEvmRequired = false;
    activeRoute?.swaps.forEach((swap) => {
      if (
        swap.from.blockchain === 'SOLANA' ||
        swap.to.blockchain === 'SOLANA'
      ) {
        isSolanaRequired = true;
      }
      const fromChain = allChains.find(
        (chain) => chain.name === swap.from.blockchain,
      );
      const toChain = allChains.find(
        (chain) => chain.name === swap.to.blockchain,
      );
      if (
        fromChain?.chainType === ChainType.EVM ||
        toChain?.chainType === ChainType.EVM
      ) {
        isEvmRequired = true;
      }
    });
    let isWalletConnected = true;
    if (isSolanaRequired && !isSolanaConnected) {
      isWalletConnected = false;
    }
    if (isEvmRequired && !isEvmConnected) {
      isWalletConnected = false;
    }
    return isWalletConnected;
  }, [isSolanaConnected, isEvmConnected, activeRoute]);

  return {
    loading,
    activeRoute,
    activeStep,
    onGetQuote,
    goToPrevious,
    onChooseRouteButtonClick,
    onConfigClick,
    isSolanaConnected,
    isEvmConnected,
    openSlippageModal,
    setOpenSlippageModal,
    isConnectWalletsOpen,
    connectWalletsClose,
    failedToFetchRoute,
    isValidAmountIn,
    connectWalletsOpen,
    onBackClick,
    onTxComplete,
    areWalletsConnected,
    setActiveStep,
  };
};
