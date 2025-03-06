import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { AnyAlt } from '@anyalt/sdk';
import { useDisclosure, useSteps } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ChainType, EstimateResponse, Token, WalletConnector } from '../../..';
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
import { ChainIdToChainConstant } from '../../../utils/chains';
import { useTokenInputBox } from '../../standalones/selectSwap/token/input/useTokenInputBox';

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
  finalToken?: Token;
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

  const slippage = useAtomValue(slippageAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);

  const [inTokenAmount, setInTokenAmount] = useAtom(inTokenAmountAtom);
  const [inToken, setInToken] = useAtom(inTokenAtom);
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

  const isButtonDisabled = useMemo(() => {
    if (activeStep === 0) {
      return Number(inTokenAmount ?? 0) == 0 || inToken == null || !bestRoute;
    }
    return Number(inTokenAmount ?? 0) == 0 || inToken == null;
  }, [inTokenAmount, inToken, bestRoute, activeStep]);

  const resetState = () => {
    setActiveOperationId(undefined);
    setFinalTokenEstimate(undefined);
    setTransactionsList(undefined);
    setInTokenAmount(undefined);
    setInToken(undefined);
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
    setTransactionsList(undefined);
    setTransactionIndex(1);
    setCurrentUiStep(0);
  };

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
      try {
        anyaltInstance.getChains().then((res) => {
          setAllChains(res.chains);
        });
      } catch (error) {
        console.error(error);
      }

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
        ?.getToken(inputTokenChain.name, inputToken.address)
        .then((res) => {
          if (res.logoUrl === ANYALT_PLACEHOLDER_LOGO && inputToken.logoUrl) {
            res.logoUrl = inputToken.logoUrl;
          }
          setProtocolInputToken(res);
        });
    }
  }, [allChains, anyaltInstance]);

  const onGetQuote = async (withGoNext: boolean = true) => {
    if (!inToken || !protocolInputToken || !inTokenAmount) return;

    if (inToken.id === protocolInputToken.id) {
      setBestRoute({
        outputAmount: inTokenAmount,
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
          address: inToken.tokenAddress ?? '',
          chainName: inToken.chainName,
        },
        toToken: {
          address: inputToken.address,
          chainName:
            ChainIdToChainConstant[
              inputToken.chainId! as keyof typeof ChainIdToChainConstant
            ],
        },
        amount: inTokenAmount,
        slippage,
      });
      setBestRoute(route);

      const lastStepOfOperation = route?.swapSteps[route?.swapSteps.length - 1];
      const lastTokenOfOperation = lastStepOfOperation?.destinationToken;

      setTransactionsList({
        steps: [
          ...(route?.swapSteps.map((step) => {
            return {
              from: {
                tokenName: step.sourceToken.symbol,
                tokenLogo: step.sourceToken.logo,
                tokenAmount: step.amount,
                tokenPrice: step.amount,
                tokenUsdPrice: step.sourceToken.tokenUsdPrice.toFixed(2),
                tokenDecimals: step.sourceToken.decimals,
                blockchain: step.sourceToken.blockchain,
                blockchainLogo: step.sourceToken.blockchainLogo,
              },
              to: {
                tokenName: step.destinationToken.symbol,
                tokenLogo: step.destinationToken.logo,
                tokenAmount: step.payout,
                tokenPrice: step.payout,
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
              tokenAmount: finalEstimateToken?.amountOut || '',
              tokenPrice:
                (
                  parseFloat(finalEstimateToken?.priceInUSD || '0') /
                  parseFloat(finalEstimateToken?.amountOut || '1')
                ).toFixed(2) || '',
              tokenUsdPrice: finalEstimateToken?.priceInUSD || '0',
              tokenDecimals: finalToken?.decimals || 0,
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

  useEffect(() => {
    //Show loading state immediatly instead of waiting for a delay
    if (inTokenAmount && inToken) setLoading(true);

    const debounceTimeout = setTimeout(() => {
      if (inTokenAmount && inToken) {
        onGetQuote(false);
      }
    }, DEBOUNCE_TIMEOUT);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [inToken, protocolInputToken, inTokenAmount]);

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
    if (activeStep === 1 && bestRoute) {
      const interval = setInterval(() => {
        // Capture latest values inside the interval callback
        const currentInToken = inToken;
        const currentProtocolInputToken = protocolInputToken;
        const currentInTokenAmount = inTokenAmount;
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
    if (protocolInputToken?.chain?.chainType === ChainType.EVM) {
      isEvmRequired = true;
    } else if (protocolInputToken?.chain?.chainType === ChainType.SOLANA) {
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
  };
};
