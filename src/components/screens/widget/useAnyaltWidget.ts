import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { AnyAlt } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ChainType, EstimateResponse, Token, WalletConnector } from '../../..';
import {
  activeOperationIdAtom,
  allChainsAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  currentUiStepAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  slippageAtom,
  swapDataAtom,
  tokenFetchErrorAtom,
  transactionIndexAtom,
  transactionsListAtom,
  transactionsProgressAtom,
} from '../../../store/stateStore';
import { calculateWorstOutput } from '../../../utils';
import { useTokenInputBox } from '../../standalones/selectSwap/token/input/useTokenInputBox';

const REFRESH_INTERVAL = 30000;

export const useAnyaltWidget = ({
  apiKey,
  inputToken,
  finalToken,
  walletConnector,
  minDepositAmount,
  isTokenBuyTemplate: isTokenBuy = false,
  estimateCallback,
  onClose,
}: {
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  apiKey: string;
  inputToken: Token;
  finalToken: Token;
  isTokenBuyTemplate: boolean;
  minDepositAmount: number;
  walletConnector?: WalletConnector;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [isValidAmountIn, setIsValidAmountIn] = useState(true);
  const [openSlippageModal, setOpenSlippageModal] = useState(false);
  const [failedToFetchRoute, setFailedToFetchRoute] = useState(false);

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { account: bitcoinAccount } = useBitcoinWallet();
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

  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [, setCurrentUiStep] = useAtom(currentUiStepAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [bestRoute, setBestRoute] = useAtom(bestRouteAtom);
  const [, setIsTokenBuy] = useAtom(isTokenBuyTemplateAtom);
  const [, setTokenFetchError] = useAtom(tokenFetchErrorAtom);
  const [, setTransactionsList] = useAtom(transactionsListAtom);
  const [, setTransactionIndex] = useAtom(transactionIndexAtom);
  const [, setActiveOperationId] = useAtom(activeOperationIdAtom);
  const [, setProtocolFinalToken] = useAtom(protocolFinalTokenAtom);
  const [, setTransactionsProgress] = useAtom(transactionsProgressAtom);
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);
  const [finalEstimateToken, setFinalTokenEstimate] = useAtom(
    finalTokenEstimateAtom,
  );
  const [protocolInputToken, setProtocolInputToken] = useAtom(
    protocolInputTokenAtom,
  );
  const { balance } = useTokenInputBox();

  useEffect(() => {
    onGetQuote(false);
  }, [inToken, slippage, balance]);

  // const resetState = useCallback(() => {
  //   setInTokenAmount('');
  //   setActiveOperationId(undefined);
  //   setFinalTokenEstimate(undefined);
  //   setTransactionsList(undefined);
  //   setTokenFetchError({ isError: false, errorMessage: '' });
  //   setSelectedRoute(undefined);
  //   setBestRoute(undefined);
  // }, [
  //   setInTokenAmount,
  //   setActiveOperationId,
  //   setFinalTokenEstimate,
  //   setTransactionsList,
  //   setTokenFetchError,
  //   setSelectedRoute,
  //   setBestRoute,
  // ]);

  // useEffect(() => {
  //   if (activeStep === 0) {
  //     resetState();
  //   }
  // }, [activeStep]);

  useEffect(() => {
    setCurrentUiStep(activeStep);
  }, [activeStep]);

  useEffect(() => {
    if (bestRoute) {
      const token = {
        ...inputToken,
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
    setIsTokenBuy(isTokenBuy);
  }, []);

  useEffect(() => {
    if (selectedRoute) setBestRoute(selectedRoute);
  }, [selectedRoute]);

  useEffect(() => {
    const inputTokenChain = allChains.find(
      (chain) =>
        (inputToken.chainId &&
          chain.chainId === inputToken.chainId &&
          chain.chainType === inputToken.chainType) ||
        (!inputToken.chainId && chain.chainType === inputToken.chainType),
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

    if (inToken.id === protocolInputToken.id) {
      setBestRoute({
        outputAmount: inTokenAmount,
        swaps: [],
        requestId: '',
        missingWalletForSourceBlockchain: false,
      });

      setTokenFetchError({
        isError: false,
        errorMessage: '',
      });
      return;
    }

    try {
      setLoading(true);

      const route = await anyaltInstance?.getBestRoute({
        from: inToken.id,
        to: protocolInputToken.id,
        amount: inTokenAmount,
        slippage,
      });
      setBestRoute(route);

      setTransactionsList({
        steps: [
          ...(route?.swaps.map((swap) => ({
            from: {
              tokenName: swap.from.symbol,
              tokenLogo: swap.from.logo,
              tokenAmount: swap.fromAmount,
              tokenPrice: swap.fromAmount,
              tokenUsdPrice: swap.from.usdPrice?.toString() || '0',
              tokenDecimals: swap.from.decimals,
              blockchain: swap.from.blockchain,
              blockchainLogo: swap.from.blockchainLogo,
            },
            to: {
              tokenName: swap.to.symbol,
              tokenLogo: swap.to.logo,
              tokenAmount: swap.toAmount,
              tokenPrice: swap.toAmount,
              tokenUsdPrice: swap.to.usdPrice?.toString() || '0',
              tokenDecimals: swap.to.decimals,
              blockchain: swap.to.blockchain,
              blockchainLogo: swap.to.blockchainLogo,
            },
          })) || []),
          {
            from: {
              tokenName: route?.swaps[route?.swaps.length - 1].to.symbol || '',
              tokenLogo: route?.swaps[route?.swaps.length - 1].to.logo || '',
              tokenAmount: route?.swaps[route?.swaps.length - 1].toAmount || '',
              tokenPrice: route?.swaps[route?.swaps.length - 1].toAmount || '',
              tokenUsdPrice:
                route?.swaps[route?.swaps.length - 1].to.usdPrice?.toString() ||
                '0',
              tokenDecimals:
                route?.swaps[route?.swaps.length - 1].to.decimals || 0,
              blockchain:
                route?.swaps[route?.swaps.length - 1].to.blockchain || '',
              blockchainLogo:
                route?.swaps[route?.swaps.length - 1].to.blockchainLogo || '',
            },
            to: {
              tokenName: finalToken.name,
              tokenLogo: finalToken.logoUrl || '',
              tokenAmount: route?.outputAmount || '',
              tokenPrice: route?.outputAmount || '',
              tokenUsdPrice: finalEstimateToken?.priceInUSD || '0',
              tokenDecimals: finalToken.decimals || 0,
              blockchain: protocolInputToken.chain?.displayName || '',
              blockchainLogo: protocolInputToken.chain?.logoUrl || '',
            },
          },
        ],
      });

      const tokensOut = parseFloat(route?.outputAmount || '0');
      let isEnoughDepositTokens = tokensOut > minDepositAmount;

      setTokenFetchError({
        isError: !isEnoughDepositTokens,
        errorMessage: `Amount should be equal or greater than ${minDepositAmount} ${inputToken?.symbol}`,
      });

      if (isEnoughDepositTokens && route) {
        const { humanReadable: worstCaseOutput } = calculateWorstOutput(
          route,
          slippage,
        );

        if (parseFloat(worstCaseOutput) < minDepositAmount) {
          isEnoughDepositTokens = false;
          setTokenFetchError({
            isError: true,
            errorMessage: `Output possibly low, the transaction might not get executed due to slippage. The protocol expects a minimum of ${minDepositAmount} ${inputToken?.symbol} please increase the input amount.`,
          });
        }
      }

      if (balance && parseFloat(balance) < parseFloat(inTokenAmount)) {
        setTokenFetchError({
          isError: true,
          errorMessage: `You don't have enough tokens in your wallet.`,
        });
      }

      setIsValidAmountIn(isEnoughDepositTokens);
      setFailedToFetchRoute(false);
      if (activeStep === 0) goToNext();
      if (withGoNext && isEnoughDepositTokens) goToNext();
    } catch (error) {
      console.error(error);
      setTokenFetchError({
        isError: true,
        errorMessage: 'No Available Route',
      });
      setFailedToFetchRoute(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (inTokenAmount) {
        onGetQuote(false);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [inTokenAmount]);

  const onConfigClick = () => {
    setOpenSlippageModal(true);
  };

  const onChooseRouteButtonClick = async () => {
    if (areWalletsConnected) {
      // await onGetQuote(false);
      await connectWalletsAndConfirmRoute();
      setTransactionsProgress({});
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

  const connectWalletsAndConfirmRoute = async () => {
    try {
      setLoading(true);

      const selectedWallets: Record<string, string> = {};
      bestRoute?.swaps.forEach((swap) => {
        const fromBlockchain = swap.from.blockchain;
        const toBlockchain = swap.to.blockchain;
        const isSolanaFrom = fromBlockchain === 'SOLANA';
        const isSolanaTo = toBlockchain === 'SOLANA';
        const isBitcoinFrom = fromBlockchain === 'BTC';
        const isBitcoinTo = toBlockchain === 'BTC';

        if (isSolanaFrom || isSolanaTo) {
          selectedWallets['SOLANA'] = solanaAddress?.toString() || '';
        }
        if (isBitcoinFrom || isBitcoinTo) {
          selectedWallets['BTC'] = bitcoinAccount?.address || '';
        }

        const fromChain = getChain(fromBlockchain);
        const toChain = getChain(toBlockchain);

        const isEvmFrom = fromChain?.chainType === ChainType.EVM;
        const isEvmTo = toChain?.chainType === ChainType.EVM;

        if (isEvmFrom) selectedWallets[fromBlockchain] = evmAddress || '';
        if (isEvmTo) selectedWallets[toBlockchain] = evmAddress || '';
      });

      if (bestRoute?.swaps.length === 0) {
        const res = await anyaltInstance?.createOperation();
        if (!res?.operationId) throw new Error('Failed to create operation');

        setActiveOperationId(res?.operationId);
      } else {
        if (!bestRoute?.requestId) return;
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
      }

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
      onGetQuote(false);
      setSwapData({
        ...swapData,
        swapIsFinished: false,
        isCrosschainSwapError: false,
      });
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
        // Capture latest values inside the interval callback
        const currentInToken = inToken;
        const currentProtocolInputToken = protocolInputToken;
        const currentInTokenAmount = inTokenAmount;

        if (
          currentInToken &&
          currentProtocolInputToken &&
          currentInTokenAmount
        ) {
          onGetQuote(false);
        }
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [activeStep, inToken, protocolInputToken, inTokenAmount, onGetQuote]);

  const areWalletsConnected = useMemo(() => {
    let isSolanaRequired = false;
    let isEvmRequired = false;
    let isBitcoinRequired = false;

    if (walletConnector && walletConnector.isConnected) {
      return walletConnector.isConnected;
    }

    // Set chain flags for last mile tx
    if (protocolInputToken?.chain?.chainType === ChainType.EVM) {
      isEvmRequired = true;
    } else if (protocolInputToken?.chain?.chainType === ChainType.SOLANA) {
      isSolanaRequired = true;
    }

    bestRoute?.swaps.forEach((swap) => {
      const fromBlockchain = swap.from.blockchain;
      const toBlockchain = swap.to.blockchain;
      const isSolanaFrom = fromBlockchain === 'SOLANA';
      const isSolanaTo = toBlockchain === 'SOLANA';
      const isBitcoinFrom = fromBlockchain === 'BTC';
      const isBitcoinTo = toBlockchain === 'BTC';

      if (isSolanaFrom || isSolanaTo) isSolanaRequired = true;
      if (isBitcoinFrom || isBitcoinTo) isBitcoinRequired = true;

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
    if (isBitcoinRequired && !bitcoinAccount) {
      isWalletConnected = false;
    }
    return isWalletConnected;
  }, [isSolanaConnected, isEvmConnected, bestRoute, bitcoinAccount]);

  useEffect(() => {
    if (areWalletsConnected && isConnectWalletsOpen) {
      connectWalletsClose();
    }
  }, [areWalletsConnected]);

  const onComplete = () => {
    onClose();
    setActiveStep(0);
    setTransactionIndex(1);
  };

  return {
    loading,
    activeRoute: bestRoute,
    activeStep,
    onGetQuote,
    goToNext,
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
    getChain,
    onComplete,
  };
};
