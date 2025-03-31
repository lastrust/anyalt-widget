import { BestRouteResponse, SupportedToken } from '@anyalt/sdk';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { EstimateResponse, Token } from '../../..';
import {
  DEBOUNCE_TIMEOUT,
  REFRESH_INTERVAL,
} from '../../../constants/transaction';
import {
  anyaltInstanceAtom,
  bestRouteAtom,
  lastMileTokenEstimateAtom,
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
  const [isValidAmountIn, setIsValidAmountIn] = useState(true);
  const [failedToFetchRoute, setFailedToFetchRoute] = useState(false);

  const { balance } = useTokenInputBox();

  const slippage = useAtomValue(slippageAtom);
  const bestRoute = useAtomValue(bestRouteAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const selectedToken = useAtomValue(selectedTokenAtom);
  const swapResultTokenGlobal = useAtomValue(swapResultTokenAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);

  const setBestRoute = useSetAtom(bestRouteAtom);
  const setTokenFetchError = useSetAtom(tokenFetchErrorAtom);
  const setTransactionsList = useSetAtom(transactionsListAtom);
  const setLastMileTokenEstimate = useSetAtom(lastMileTokenEstimateAtom);

  const onGetRoutes = async (withGoNext: boolean = true) => {
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

  useEffect(() => {
    onGetRoutes(false);
  }, [selectedToken, slippage, balance]);

  //TODO: Can be part of getting routes hook.
  useEffect(() => {
    //Show loading state immediatly instead of waiting for a delay
    if (selectedTokenAmount && selectedToken) setLoading(true);

    const debounceTimeout = setTimeout(() => {
      if (selectedTokenAmount && selectedToken) {
        onGetRoutes(false);
      }
    }, DEBOUNCE_TIMEOUT);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [selectedToken, swapResultTokenGlobal, selectedTokenAmount]);

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
          onGetRoutes(false);
        }
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [bestRoute]);

  return {
    loading,
    isValidAmountIn,
    failedToFetchRoute,
    onGetRoutes,
    setLoading,
    setListOfTransactionsFromRoute,
  };
};
