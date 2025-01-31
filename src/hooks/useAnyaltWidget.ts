import { AnyAlt } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ChainType, EstimateResponse, Token, WalletConnector } from '..';
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

const REFRESH_INTERVAL = 20000;

export const useAnyaltWidget = ({
  estimateCallback,
  inputToken,
  finalToken,
  apiKey,
  minDepositAmount,
  walletConnector,
}: {
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  inputToken: Token;
  finalToken: Token;
  apiKey: string;
  minDepositAmount: number;
  walletConnector?: WalletConnector;
}) => {
  const [loading, setLoading] = useState(false);
  const [isValidAmountIn, setIsValidAmountIn] = useState(true);
  const [openSlippageModal, setOpenSlippageModal] = useState(false);
  const [failedToFetchRoute, setFailedToFetchRoute] = useState(false);

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({
    index: 0,
  });
  const {
    isOpen: isConnectWalletsOpen,
    onClose: connectWalletsClose,
    onOpen: connectWalletsOpen,
  } = useDisclosure();

  const inToken = useAtomValue(inTokenAtom);
  const slippage = useAtomValue(slippageAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);

  const [, setActiveOperationId] = useAtom(activeOperationIdAtom);
  const [, setFinalTokenEstimate] = useAtom(finalTokenEstimateAtom);
  const [, setProtocolFinalToken] = useAtom(protocolFinalTokenAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [bestRoute, setBestRoute] = useAtom(bestRouteAtom);
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);
  const [protocolInputToken, setProtocolInputToken] = useAtom(
    protocolInputTokenAtom,
  );

  useEffect(() => {
    if (bestRoute) {
      const token = {
        ...finalToken,
        amount: bestRoute.outputAmount.toString(),
      };
      estimateCallback(token).then((res) => {
        setFinalTokenEstimate(res);
      });
    }
  }, [bestRoute]);

  useEffect(() => {
    const anyaltInstance = new AnyAlt(apiKey);
    setAnyaltInstance(anyaltInstance);

    if (anyaltInstance)
      anyaltInstance.getChains().then((res) => {
        setAllChains(res.chains);
      });

    setProtocolFinalToken(finalToken);
  }, []);

  useEffect(() => {
    if (selectedRoute) setBestRoute(selectedRoute);
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
      setBestRoute(route);

      const tokensOut = parseFloat(route?.outputAmount || '0');
      const isEnoughDepositTokens = tokensOut > minDepositAmount;

      setIsValidAmountIn(isEnoughDepositTokens);
      setFailedToFetchRoute(false);
      if (withGoNext && isEnoughDepositTokens) goToNext();
    } catch (error) {
      console.error(error);
      setFailedToFetchRoute(true);
    } finally {
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
      if (walletConnector) {
        walletConnector.connect();
      } else {
        connectWalletsOpen();
      }
    }
  };

  const getChain = (blockchain: string) =>
    allChains.find((chain) => chain.name === blockchain);

  const connectWalletsConfirm = async () => {
    try {
      setLoading(true);
      if (!bestRoute?.requestId) return;

      const selectedWallets: Record<string, string> = {};
      bestRoute.swaps.forEach((swap) => {
        const fromBlockchain = swap.from.blockchain;
        const toBlockchain = swap.to.blockchain;
        const isSolanaFrom = fromBlockchain === 'SOLANA';
        const isSolanaTo = toBlockchain === 'SOLANA';

        if (isSolanaFrom || isSolanaTo) {
          selectedWallets['SOLANA'] = solanaAddress?.toString() || '';
        }

        const fromChain = getChain(fromBlockchain);
        const toChain = getChain(toBlockchain);

        const isEvmFrom = fromChain?.chainType === ChainType.EVM;
        const isEvmTo = toChain?.chainType === ChainType.EVM;

        if (isEvmFrom) selectedWallets[fromBlockchain] = evmAddress || '';
        if (isEvmTo) selectedWallets[toBlockchain] = evmAddress || '';
      });

      const res = await anyaltInstance?.confirmRoute({
        selectedRoute: {
          requestId: bestRoute.requestId,
        },
        selectedWallets,
        destination: evmAddress || '',
      });

      if (!res?.operationId || !res?.result)
        throw new Error('Failed to confirm route');

      setActiveOperationId(res?.operationId);
      setBestRoute(res?.result);

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
      setActiveStep(1);
    } else {
      goToPrevious();
    }
  };

  const onTxComplete = () => {
    setActiveStep(3);
  };

  useEffect(() => {
    if (activeStep === 1) {
      const interval = setInterval(() => {
        onGetQuote(false);
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [activeStep]);

  const areWalletsConnected = useMemo(() => {
    let isSolanaRequired = false;
    let isEvmRequired = false;

    if (walletConnector && walletConnector.isConnected) {
      return walletConnector.isConnected;
    }

    bestRoute?.swaps.forEach((swap) => {
      const fromBlockchain = swap.from.blockchain;
      const toBlockchain = swap.to.blockchain;
      const isSolanaFrom = fromBlockchain === 'SOLANA';
      const isSolanaTo = toBlockchain === 'SOLANA';

      if (isSolanaFrom || isSolanaTo) isSolanaRequired = true;

      const fromChain = getChain(fromBlockchain);
      const toChain = getChain(toBlockchain);

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
  }, [isSolanaConnected, isEvmConnected, bestRoute]);

  return {
    loading,
    activeRoute: bestRoute,
    activeStep,
    onGetQuote,
    goToPrevious,
    onChooseRouteButtonClick,
    onConfigClick,
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
