import { SupportedToken } from '@anyalt/sdk';
import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { EstimateResponse, Token } from '../../..';
import {
  DEBOUNCE_TIMEOUT,
  REFRESH_INTERVAL,
} from '../../../constants/transaction';
import {
  allRoutesAtom,
  anyaltInstanceAtom,
  lastMileTokenEstimateAtom,
  selectedRouteAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  slippageAtom,
  swapResultTokenAtom,
  tokenFetchErrorAtom,
  transactionsListAtom,
} from '../../../store/stateStore';
import { calculateWorstOutput } from '../../../utils';
import { ChainIdToChainConstant } from '../../../utils/chains';
import { useTokenInputBox } from '../../standalones/selectSwap/token/input/useTokenInputBox';

type UseFetchRoutesProps = {
  finalToken?: Token;
  activeStep: number;
  swapResultToken: Token;
  minDepositAmount: number;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  setActiveStep: (step: number) => void;
};

export const useFetchRoutes = ({
  finalToken,
  activeStep,
  swapResultToken,
  minDepositAmount,
  setActiveStep,
  estimateCallback,
}: UseFetchRoutesProps) => {
  const [loading, setLoading] = useState(false);
  const [isEnoughDepositTokens, setIsEnoughDepositTokens] = useState(true);
  const [isValidAmountIn] = useState(true);
  const [failedToFetchRoute, setFailedToFetchRoute] = useState(false);

  const { balance } = useTokenInputBox();

  const slippage = useAtomValue(slippageAtom);

  const [, setAllRoutes] = useAtom(allRoutesAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const selectedToken = useAtomValue(selectedTokenAtom);
  const swapResultTokenGlobal = useAtomValue(swapResultTokenAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const setTokenFetchError = useSetAtom(tokenFetchErrorAtom);
  const setTransactionsList = useSetAtom(transactionsListAtom);
  const setLastMileTokenEstimate = useSetAtom(lastMileTokenEstimateAtom);

  const onGetRoutes = async (withGoNext: boolean = true) => {
    if (activeStep > 1) return;
    if (!selectedToken || !swapResultTokenGlobal || !selectedTokenAmount)
      return;

    if (selectedToken.id === swapResultTokenGlobal.id) {
      setSelectedRoute({
        outputAmount: selectedTokenAmount,
        swapSteps: [],
        routeId: '',
        missingWalletForSourceBlockchain: false,
        tags: [],
      });

      setTokenFetchError({
        isError: false,
        errorMessage: '',
      });
      return;
    }

    try {
      setLoading(true);

      const res = await anyaltInstance?.getAllRoutes({
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
        selectedWallets: {
          ETH: '0x0000000000000000000000000000000000000000',
        },
        userSessionKeyForSourceDestinationTokenPair:
          '0x0000000000000000000000000000000000000000',
      });

      setAllRoutes(res?.routes);
      setSelectedRoute(res?.routes[0]);

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
    if (activeStep === 0) return;

    if (selectedRoute && swapResultToken) {
      setListOfTransactionsFromRoute(selectedRoute, swapResultToken);
    }

    const tokensOut = parseFloat(selectedRoute?.outputAmount || '0');
    setIsEnoughDepositTokens(tokensOut > minDepositAmount);

    setTokenFetchError({
      isError: !(tokensOut > minDepositAmount),
      errorMessage: `Amount should be equal or greater than ${minDepositAmount} ${swapResultToken?.symbol}`,
    });

    if (isEnoughDepositTokens && selectedRoute) {
      const { humanReadable: worstCaseOutput } = calculateWorstOutput(
        selectedRoute,
        slippage,
      );

      if (parseFloat(worstCaseOutput) < minDepositAmount) {
        setIsEnoughDepositTokens(false);
        setTokenFetchError({
          isError: true,
          errorMessage: `Output possibly low, the transaction might not get executed due to slippage. The protocol expects a minimum of ${minDepositAmount} ${swapResultToken?.symbol} please increase the input amount.`,
        });
      }
    }

    if (
      balance &&
      selectedTokenAmount &&
      parseFloat(balance) < parseFloat(selectedTokenAmount)
    ) {
      setTokenFetchError({
        isError: true,
        errorMessage: `You don't have enough tokens in your wallet.`,
      });
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (selectedRoute && swapResultTokenGlobal) {
      setListOfTransactionsFromRoute(selectedRoute, swapResultTokenGlobal);
    }
  }, [selectedRoute, swapResultTokenGlobal]);

  const setListOfTransactionsFromRoute = useCallback(
    (route: GetAllRoutesResponseItem, inputToken: Partial<SupportedToken>) => {
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
    [lastMileTokenEstimate, finalToken, swapResultTokenGlobal, selectedRoute],
  );

  useEffect(() => {
    onGetRoutes(false);
  }, [selectedToken, slippage, balance]);

  useEffect(() => {
    if (
      selectedTokenAmount &&
      selectedToken &&
      swapResultTokenGlobal &&
      selectedToken.id !== swapResultTokenGlobal.id
    )
      setLoading(true);

    const debounceTimeout = setTimeout(() => {
      if (selectedTokenAmount && selectedToken) {
        onGetRoutes(false);
      }
    }, DEBOUNCE_TIMEOUT);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [selectedToken, swapResultTokenGlobal, selectedTokenAmount]);

  useEffect(() => {
    if (selectedRoute) {
      const token = {
        ...swapResultToken,
        amount: selectedRoute.outputAmount.toString(),
      };
      estimateCallback(token).then((res) => {
        setLastMileTokenEstimate(res);
      });
    }
  }, [selectedRoute]);

  const estimateOutPut = useCallback(
    async (route: GetAllRoutesResponseItem) => {
      const token = {
        ...swapResultToken,
        amount: route.outputAmount.toString(),
      };

      return await estimateCallback(token);
    },
    [],
  );

  useEffect(() => {
    if (activeStep === 1 && selectedRoute) {
      const interval = setInterval(() => {
        const currentInToken = selectedToken;
        const currentProtocolInputToken = swapResultTokenGlobal;
        const currentInTokenAmount = selectedTokenAmount;
        const userSelectedToken =
          currentInToken &&
          currentProtocolInputToken &&
          currentInTokenAmount &&
          selectedRoute;

        if (userSelectedToken) {
          onGetRoutes(false);
        }
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [selectedRoute]);

  return {
    loading,
    isValidAmountIn,
    failedToFetchRoute,
    onGetRoutes,
    setLoading,
    estimateOutPut,
    setListOfTransactionsFromRoute,
  };
};
