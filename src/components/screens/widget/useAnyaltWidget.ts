import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { AnyAlt, BestRouteResponse, SupportedToken } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  ChainType,
  EstimateResponse,
  Token,
  WalletConnector,
  WidgetTemplateType,
} from '../../..';
import { ANYALT_PLACEHOLDER_LOGO } from '../../../constants/links';
import {
  DEBOUNCE_TIMEOUT,
  REFRESH_INTERVAL,
} from '../../../constants/transaction';
import {
  activeOperationIdAtom,
  allChainsAtom,
  anyaltInstanceAtom,
  bestRouteAtom,
  currentStepAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  selectedRouteAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  showStuckTransactionDialogAtom,
  slippageAtom,
  swapDataAtom,
  swapResultTokenAtom,
  tokenFetchErrorAtom,
  transactionIndexAtom,
  transactionsListAtom,
  transactionsProgressAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';
import { TransactionsProgress } from '../../../types/transaction';
import {
  calculateWorstOutput,
  convertSwapTransactionToTransactionProgress,
} from '../../../utils';
import { ChainIdToChainConstant } from '../../../utils/chains';
import { usePendingOperation } from '../../standalones/pendingOperationDialog/usePendingOperation';
import { useTokenInputBox } from '../../standalones/selectSwap/token/input/useTokenInputBox';

type Props = {
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  apiKey: string;
  swapResultToken: Token;
  finalToken?: Token;
  widgetTemplate: WidgetTemplateType;
  minDepositAmount: number;
  walletConnector?: WalletConnector;
  onClose: () => void;
};

export const useAnyaltWidget = ({
  apiKey,
  swapResultToken,
  finalToken,
  walletConnector,
  minDepositAmount,
  widgetTemplate,
  estimateCallback,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [isValidAmountIn, setIsValidAmountIn] = useState(true);
  const [openSlippageModal, setOpenSlippageModal] = useState(false);
  const [failedToFetchRoute, setFailedToFetchRoute] = useState(false);

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { publicKey: solanaAddress, connected: isSolanaConnected } =
    useWallet();
  const { account: bitcoinAccount } = useBitcoinWallet();
  const { activeStep, setActiveStep, goToPrevious } = useSteps({
    index: 0,
  });

  const {
    isOpen: isConnectWalletsOpen,
    onClose: connectWalletsClose,
    onOpen: connectWalletsOpen,
  } = useDisclosure();

  const slippage = useAtomValue(slippageAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);

  const [selectedToken, setSelectedToken] = useAtom(selectedTokenAtom);
  const [selectedTokenAmount, setSelectedTokenAmount] = useAtom(
    selectedTokenAmountAtom,
  );
  const [swapResultTokenGlobal, setSwapResultToken] =
    useAtom(swapResultTokenAtom);
  const [, setLastMileToken] = useAtom(lastMileTokenAtom);
  const [lastMileTokenEstimate, setLastMileTokenEstimate] = useAtom(
    lastMileTokenEstimateAtom,
  );

  const [, setCurrentStep] = useAtom(currentStepAtom);

  const [, setTemplate] = useAtom(widgetTemplateAtom);

  const [swapData, setSwapData] = useAtom(swapDataAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [bestRoute, setBestRoute] = useAtom(bestRouteAtom);
  const [, setTokenFetchError] = useAtom(tokenFetchErrorAtom);
  const [, setTransactionsList] = useAtom(transactionsListAtom);
  const [, setTransactionIndex] = useAtom(transactionIndexAtom);
  const [, setActiveOperationId] = useAtom(activeOperationIdAtom);

  const [, setTransactionsProgress] = useAtom(transactionsProgressAtom);
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);

  const { balance } = useTokenInputBox();

  useEffect(() => {
    onGetQuote(false);
  }, [selectedToken, slippage, balance]);

  const isButtonDisabled = useMemo(() => {
    if (activeStep === 0) {
      return (
        Number(selectedTokenAmount ?? 0) == 0 ||
        selectedToken == null ||
        !bestRoute
      );
    }
    return Number(selectedTokenAmount ?? 0) == 0 || selectedToken == null;
  }, [selectedTokenAmount, selectedToken, bestRoute, activeStep]);

  const resetState = useCallback(() => {
    setActiveStep(0);
    setActiveOperationId(undefined);
    setLastMileTokenEstimate(undefined);
    setTransactionsList(undefined);
    setSelectedTokenAmount(undefined);
    setSelectedToken(undefined);
    setTokenFetchError({ isError: false, errorMessage: '' });
    setBestRoute(undefined);
    setSwapData({
      swapIsFinished: false,
      isCrosschainSwapError: false,
      crosschainSwapOutputAmount: '',
      totalSteps: 0,
      currentStep: 1,
    });
    setTransactionsProgress({});
    setTransactionIndex(1);
    localStorage.removeItem('operationId');
    localStorage.removeItem('tokenBuyOperationId');
  }, [
    setActiveOperationId,
    setActiveOperationId,
    setLastMileTokenEstimate,
    setTransactionsList,
    setSelectedTokenAmount,
    setSelectedToken,
    setTokenFetchError,
    setBestRoute,
    setSwapData,
    setTransactionsProgress,
    setTransactionIndex,
  ]);

  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);

  //TODO: Should be triggered, once all routes has been setted. Also figure out how to handle for multiple routes.
  useEffect(() => {
    if (bestRoute) {
      const token = {
        ...swapResultToken,
        amount: bestRoute.outputAmount.toString(),
      };
      estimateCallback(token).then((res) => {
        setLastMileTokenEstimate(res);
      });
    }
  }, [bestRoute]);

  //TODO: Related to the 1st step of the widget. Intial call to setup widget.
  useEffect(() => {
    const anyaltInstance = new AnyAlt(apiKey);
    setAnyaltInstance(anyaltInstance);

    if (anyaltInstance)
      try {
        anyaltInstance.getChains().then((res) => {
          setAllChains(res.chains);
        });
      } catch (error) {
        console.error(error);
      }

    setLastMileToken(finalToken);
    setTemplate(widgetTemplate);
  }, []);

  //TODO: Should be refactored to handle it to handle selected route. Probably can be deleted
  useEffect(() => {
    if (selectedRoute) setBestRoute(selectedRoute);
  }, [selectedRoute]);

  //TODO: Related to the 1st step of the widget. Can be moved to the another hook.
  useEffect(() => {
    const outputTokenChain = allChains.find(
      (chain) =>
        (swapResultToken.chainId &&
          chain.chainId === swapResultToken.chainId &&
          chain.chainType === swapResultToken.chainType) ||
        (!swapResultToken.chainId &&
          chain.chainType === swapResultToken.chainType),
    );

    if (outputTokenChain) {
      anyaltInstance
        ?.getToken(outputTokenChain.name, swapResultToken.address)
        .then((res) => {
          if (
            res.logoUrl === ANYALT_PLACEHOLDER_LOGO &&
            swapResultToken.logoUrl
          ) {
            res.logoUrl = swapResultToken.logoUrl;
          }
          setSwapResultToken(res);
        });
    }
  }, [allChains, anyaltInstance]);

  const setListOfTransactionsFromRoute = useCallback(
    (route: BestRouteResponse, inputToken: Partial<SupportedToken>) => {
      const lastStepOfOperation = route?.swapSteps[route?.swapSteps.length - 1];
      const lastTokenOfOperation = lastStepOfOperation?.destinationToken;

      setTransactionsList({
        steps: [
          ...(route?.swapSteps.map((step) => {
            const toPayout = !isNaN(parseInt(step.payout))
              ? step.payout
              : step.quotePayout;
            return {
              from: {
                tokenName: step.sourceToken.symbol,
                tokenLogo: step.sourceToken.logo,
                tokenAmount: step.amount,
                tokenPrice: (
                  parseFloat(step.amount) * step.sourceToken.tokenUsdPrice
                ).toFixed(2),
                tokenUsdPrice: step.sourceToken.tokenUsdPrice.toFixed(2),
                tokenDecimals: step.sourceToken.decimals,
                blockchain: step.sourceToken.blockchain,
                blockchainLogo: step.sourceToken.blockchainLogo,
              },
              to: {
                tokenName: step.destinationToken.symbol,
                tokenLogo: step.destinationToken.logo,
                tokenAmount: toPayout,
                tokenPrice: (
                  parseFloat(toPayout) * step.destinationToken.tokenUsdPrice
                ).toFixed(2),
                tokenUsdPrice: step.destinationToken.tokenUsdPrice.toFixed(2),
                tokenDecimals: step.destinationToken.decimals,
                blockchain: step.destinationToken.blockchain,
                blockchainLogo: step.destinationToken.blockchainLogo,
              },
            };
          }) || []),
          {
            from: {
              tokenName: lastTokenOfOperation?.symbol || '',
              tokenLogo: lastTokenOfOperation?.logo || '',
              tokenAmount: lastStepOfOperation?.amount || '',
              tokenPrice: lastStepOfOperation?.amount || '',
              tokenUsdPrice:
                lastTokenOfOperation?.tokenUsdPrice.toFixed(2) || '',
              tokenDecimals: lastTokenOfOperation?.decimals || 0,
              blockchain: lastTokenOfOperation?.blockchain || '',
              blockchainLogo: lastTokenOfOperation?.blockchainLogo || '',
            },
            to: {
              tokenName: finalToken?.name || '',
              tokenLogo: finalToken?.logoUrl || '',
              tokenAmount: lastMileTokenEstimate?.amountOut || '',
              tokenPrice:
                (
                  parseFloat(lastMileTokenEstimate?.priceInUSD || '0') /
                  parseFloat(lastMileTokenEstimate?.amountOut || '1')
                ).toFixed(2) || '',
              tokenUsdPrice: lastMileTokenEstimate?.priceInUSD || '0',
              tokenDecimals: finalToken?.decimals || 0,
              blockchain: inputToken.chain?.displayName || '',
              blockchainLogo: inputToken.chain?.logoUrl || '',
            },
          },
        ],
      });
    },
    [lastMileTokenEstimate, finalToken, swapResultTokenGlobal],
  );

  const onGetQuote = async (withGoNext: boolean = true) => {
    if (activeStep > 1) return;
    if (!selectedToken || !swapResultTokenGlobal || !selectedTokenAmount)
      return;

    if (selectedToken.id === swapResultTokenGlobal.id) {
      setBestRoute({
        outputAmount: selectedTokenAmount,
        swapSteps: [],
        operationId: '',
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
        fromToken: {
          address: selectedToken.tokenAddress ?? '',
          chainName: selectedToken.chainName,
        },
        toToken: {
          address: swapResultToken.address,
          chainName:
            ChainIdToChainConstant[
              swapResultToken.chainId! as keyof typeof ChainIdToChainConstant
            ],
        },
        amount: selectedTokenAmount,
        slippage,
      });

      //TODO: Instead of setting best route. It should set all routes.
      setBestRoute(route);

      if (route && swapResultToken) {
        setListOfTransactionsFromRoute(route, swapResultToken);
      }

      const tokensOut = parseFloat(route?.outputAmount || '0');
      let isEnoughDepositTokens = tokensOut > minDepositAmount;

      setTokenFetchError({
        isError: !isEnoughDepositTokens,
        errorMessage: `Amount should be equal or greater than ${minDepositAmount} ${swapResultToken?.symbol}`,
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
            errorMessage: `Output possibly low, the transaction might not get executed due to slippage. The protocol expects a minimum of ${minDepositAmount} ${swapResultToken?.symbol} please increase the input amount.`,
          });
        }
      }

      if (balance && parseFloat(balance) < parseFloat(selectedTokenAmount)) {
        setTokenFetchError({
          isError: true,
          errorMessage: `You don't have enough tokens in your wallet.`,
        });
      }

      setIsValidAmountIn(isEnoughDepositTokens);
      setFailedToFetchRoute(false);
      if (activeStep === 0) setActiveStep(1);
      if (withGoNext && isEnoughDepositTokens) setActiveStep(1);
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

  //TODO: Can be part of getting routes hook.
  useEffect(() => {
    //Show loading state immediatly instead of waiting for a delay
    if (selectedTokenAmount && selectedToken) setLoading(true);

    const debounceTimeout = setTimeout(() => {
      if (selectedTokenAmount && selectedToken) {
        onGetQuote(false);
      }
    }, DEBOUNCE_TIMEOUT);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [selectedToken, swapResultTokenGlobal, selectedTokenAmount]);

  //TODO: This code is realted to modal, can be move to another places
  const onConfigClick = () => {
    setOpenSlippageModal(true);
  };

  const onChooseRouteButtonClick = async () => {
    try {
      if (areWalletsConnected) {
        await confirmSelectedRoute();
        setTransactionsProgress({});
      } else {
        if (walletConnector) {
          walletConnector.connect();
        } else {
          connectWalletsOpen();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getChain = (blockchain: string) =>
    allChains.find((chain) => chain.name === blockchain);

  const confirmSelectedRoute = async () => {
    try {
      setLoading(true);

      let destination = '';

      const selectedWallets: Record<string, string> = {};
      //TODO: It shoudl read data from selected route.
      bestRoute?.swapSteps.forEach((swapStep, index) => {
        const fromBlockchain = swapStep.sourceToken.blockchain;
        const toBlockchain = swapStep.destinationToken.blockchain;

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

        if (isEvmFrom || isEvmTo) {
          if (!evmAddress) {
            throw new Error('EVM Wallet not connected');
          }
        }

        if (isSolanaFrom || isSolanaTo) {
          if (!solanaAddress) {
            throw new Error('Solana Wallet not connected');
          }
        }

        if (isBitcoinFrom || isBitcoinTo) {
          if (!bitcoinAccount) {
            throw new Error('Bitcoin Wallet not connected');
          }
        }

        if (isEvmFrom) selectedWallets[fromBlockchain] = evmAddress!;
        if (isEvmTo) selectedWallets[toBlockchain] = evmAddress!;

        if (index === bestRoute.swapSteps.length - 1) {
          switch (true) {
            case isEvmTo:
              destination = evmAddress!;
              break;
            case isSolanaTo:
              destination = solanaAddress!.toString();
              break;
            case isBitcoinTo:
              destination = bitcoinAccount!.address;
              break;
            default:
              throw new Error('Destination not found');
          }
        }
      });

      if (bestRoute?.swapSteps.length === 0) {
        const res = await anyaltInstance?.createOperation();
        if (!res?.operationId) throw new Error('Failed to create operation');

        setActiveOperationId(res?.operationId);
      } else {
        if (!bestRoute?.operationId) return;
        const res = await anyaltInstance?.confirmRoute({
          operationId: bestRoute?.operationId,
          selectedWallets,
          destination: destination,
        });

        if (!res?.operationId || !res?.ok)
          throw new Error('Failed to confirm route');

        setActiveOperationId(res?.operationId);
        setBestRoute(bestRoute);
        const localStorageKey =
          widgetTemplate === 'TOKEN_BUY'
            ? 'tokenBuyOperationId'
            : 'operationId';
        localStorage.setItem(localStorageKey, res.operationId);
      }

      connectWalletsClose();
      setActiveStep(2);
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
    if (activeStep === 1 && bestRoute) {
      const interval = setInterval(() => {
        // Capture latest values inside the interval callback
        const currentInToken = selectedToken;
        const currentProtocolInputToken = swapResultTokenGlobal;
        const currentInTokenAmount = selectedTokenAmount;
        const userSelectedToken =
          currentInToken &&
          currentProtocolInputToken &&
          currentInTokenAmount &&
          bestRoute;

        if (userSelectedToken) {
          onGetQuote(false);
        }
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [bestRoute]);

  const areWalletsConnected = useMemo(() => {
    let isSolanaRequired = false;
    let isEvmRequired = false;
    let isBitcoinRequired = false;

    if (walletConnector && walletConnector.isConnected) {
      return walletConnector.isConnected;
    }

    // Set chain flags for last mile tx
    if (swapResultTokenGlobal?.chain?.chainType === ChainType.EVM) {
      isEvmRequired = true;
    } else if (swapResultTokenGlobal?.chain?.chainType === ChainType.SOLANA) {
      isSolanaRequired = true;
    }

    bestRoute?.swapSteps.forEach((swapStep) => {
      const fromBlockchain = swapStep.sourceToken.blockchain;
      const toBlockchain = swapStep.destinationToken.blockchain;
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
    if (isSolanaRequired && !isSolanaConnected) isWalletConnected = false;
    if (isEvmRequired && !isEvmConnected) isWalletConnected = false;
    if (isBitcoinRequired && !bitcoinAccount) isWalletConnected = false;

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
    resetState();
  };

  const setOperationToCurrentRoute = useCallback(
    (operation: BestRouteResponse) => {
      setBestRoute(operation);
      setActiveOperationId(operation.operationId);
      setActiveStep(2);

      const newTransactionProgress = {} as TransactionsProgress;
      let lastFinishedTransactionIndex = 0;

      operation.swapSteps.forEach((step, index) => {
        step.transactions
          .sort(
            (a, b) =>
              (Number(a.confirmedTimestamp) || 0) -
              (Number(b.confirmedTimestamp) || 0),
          )
          .forEach((transaction) => {
            newTransactionProgress[index] = {};
            switch (transaction.type) {
              case 'MAIN':
                newTransactionProgress[index].swap =
                  convertSwapTransactionToTransactionProgress(
                    step,
                    transaction,
                  );

                if (
                  newTransactionProgress[index].swap?.status === 'confirmed'
                ) {
                  lastFinishedTransactionIndex = index + 1;
                }

                break;
              case 'APPROVE':
                newTransactionProgress[index].approve =
                  convertSwapTransactionToTransactionProgress(
                    step,
                    transaction,
                  );
                break;
              default:
                break;
            }
          });
      });

      setTransactionsProgress(newTransactionProgress);
      setTransactionIndex(lastFinishedTransactionIndex + 1);
      setListOfTransactionsFromRoute(
        operation,
        operation.swapSteps[operation.swapSteps.length - 1].destinationToken,
      );
    },
    [],
  );

  const { showPendingOperationDialog, allNecessaryWalletsConnected } =
    usePendingOperation({ closeConnectWalletsModal: connectWalletsClose });

  const showStuckTransactionDialog = useAtomValue(
    showStuckTransactionDialogAtom,
  );

  // Memoize values that determine rendering to prevent unnecessary re-renders
  const modalWrapperMaxWidth = useMemo(() => {
    if (showPendingOperationDialog || showStuckTransactionDialog) {
      return '976px';
    }
    if (activeStep === 0 || activeStep === 3) {
      return '512px';
    }
    return '976px';
  }, [showPendingOperationDialog, showStuckTransactionDialog, activeStep]);

  const headerCustomText = useMemo(() => {
    if (showPendingOperationDialog || showStuckTransactionDialog) {
      return 'Transaction';
    }
    return undefined;
  }, [showPendingOperationDialog, showStuckTransactionDialog]);

  return {
    loading,
    activeStep,
    activeRoute: bestRoute,
    isValidAmountIn,
    isButtonDisabled,
    isConnectWalletsOpen,
    failedToFetchRoute,
    areWalletsConnected,
    onBackClick,
    onComplete,
    onTxComplete,
    onConfigClick,
    openSlippageModal,
    connectWalletsOpen,
    connectWalletsClose,
    setOpenSlippageModal,
    onChooseRouteButtonClick,
    setOperationToCurrentRoute,
    resetState,
    showPendingOperationDialog,
    showStuckTransactionDialog,
    allNecessaryWalletsConnected,
    modalWrapperMaxWidth,
    headerCustomText,
  };
};
