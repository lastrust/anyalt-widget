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
  stepsProgressAtom,
  swapDataAtom,
  tokenFetchErrorAtom,
  transactionIndexAtom,
  transactionsListAtom,
} from '../../../store/stateStore';
import { calculateWorstOutput } from '../../../utils';
import { ChainIdToChainConstant } from '../../../utils/chains';
import { useTokenInputBox } from '../../standalones/selectSwap/token/input/useTokenInputBox';

const REFRESH_INTERVAL = 20000;

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
  const [, setStepsProgress] = useAtom(stepsProgressAtom);
  const [, setCurrentUiStep] = useAtom(currentUiStepAtom);
  const [, setIsTokenBuy] = useAtom(isTokenBuyTemplateAtom);
  const [, setActiveOperationId] = useAtom(activeOperationIdAtom);
  const [finalEstimateToken, setFinalTokenEstimate] = useAtom(
    finalTokenEstimateAtom,
  );
  const [, setTransactionsList] = useAtom(transactionsListAtom);
  const [, setTokenFetchError] = useAtom(tokenFetchErrorAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [bestRoute, setBestRoute] = useAtom(bestRouteAtom);
  const [, setProtocolFinalToken] = useAtom(protocolFinalTokenAtom);
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);
  const [protocolInputToken, setProtocolInputToken] = useAtom(
    protocolInputTokenAtom,
  );
  const [, setTransactionIndex] = useAtom(transactionIndexAtom);

  useEffect(() => {
    onGetQuote(false);
  }, [inToken, slippage]);

  const { balance } = useTokenInputBox();

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
                tokenUsdPrice: '0', // temporary values
                tokenDecimals: 18,
                blockchain: step.sourceToken.blockchain,
                blockchainLogo: '', // temporary values
              },
              to: {
                tokenName: step.destinationToken.symbol,
                tokenLogo: step.destinationToken.logo,
                tokenAmount: step.payout,
                tokenPrice: step.payout,
                tokenUsdPrice: '0',
                tokenDecimals: 18,
                blockchain: step.destinationToken.blockchain,
                blockchainLogo: '', // temporary values
              },
            };
          }) || []),
          {
            from: {
              tokenName: lastTokenOfOperation?.symbol || '',
              tokenLogo: lastTokenOfOperation?.logo || '',
              tokenAmount: lastStepOfOperation?.amount || '',
              tokenPrice: lastStepOfOperation?.amount || '',
              tokenUsdPrice: '0',
              tokenDecimals: 18,
              blockchain: lastTokenOfOperation?.blockchain || '',
              blockchainLogo: '',
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

      if (
        activeStep !== 0 &&
        balance &&
        parseFloat(balance) < parseFloat(inTokenAmount)
      ) {
        setTokenFetchError({
          isError: true,
          errorMessage: `You don't have enough tokens in your wallet.`,
        });
      }

      setIsValidAmountIn(isEnoughDepositTokens);
      setFailedToFetchRoute(false);
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
      setStepsProgress(undefined);
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
      if (!bestRoute?.operationId) return;

      const selectedWallets: Record<string, string> = {};
      bestRoute.swapSteps.forEach((swapStep) => {
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

        if (isEvmFrom) selectedWallets[fromBlockchain] = evmAddress || '';
        if (isEvmTo) selectedWallets[toBlockchain] = evmAddress || '';
      });

      const res = await anyaltInstance?.confirmRoute({
        operationId: bestRoute.operationId,
        selectedWallets,
        destination: evmAddress || '',
      });

      if (!res?.ok || !res?.operationId)
        throw new Error('Failed to confirm route');

      setActiveOperationId(res.operationId);

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
