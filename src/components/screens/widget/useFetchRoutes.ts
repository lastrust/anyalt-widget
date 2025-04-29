import { Account } from '@ant-design/web3';
import { SupportedToken } from '@anyalt/sdk';
import {
  GetAllRoutesResponseItem,
  SupportedChain,
} from '@anyalt/sdk/dist/adapter/api/api';
import { PublicKey } from '@solana/web3.js';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChainType, EstimateResponse, Token } from '../../..';
import {
  DEBOUNCE_TIMEOUT,
  REFRESH_INTERVAL,
} from '../../../constants/transaction';
import {
  allRoutesAtom,
  anyaltInstanceAtom,
  fromTokenAfterFiatTxAtom,
  lastMileTokenEstimateAtom,
  payoutAfterFiatSwapAtom,
  selectedCurrencyAtom,
  selectedRouteAtom,
  selectedTokenAtom,
  selectedTokenOrFiatAmountAtom,
  slippageAtom,
  swapResultTokenAtom,
  tokenFetchErrorAtom,
  transactionsListAtom,
  widgetModeAtom,
} from '../../../store/stateStore';
import { calculateWorstOutput } from '../../../utils';
import { ChainIdToChainConstant } from '../../../utils/chains';
import { useTokenInputBox } from '../../standalones/selectSwap/token/input/useTokenInputBox';

type UseFetchRoutesProps = {
  evmAddress: `0x${string}` | undefined;
  solanaAddress: PublicKey | null;
  bitcoinAccount: Account | undefined;
  finalToken?: Token;
  activeStep: number;
  swapResultToken: Token;
  shouldFetchCryptoRoutes: boolean;
  minDepositAmount: number;
  getChain: (blockchain: string) => SupportedChain | undefined;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  setActiveStep: (step: number) => void;
};

export const useFetchRoutes = ({
  evmAddress,
  solanaAddress,
  bitcoinAccount,
  finalToken,
  activeStep,
  swapResultToken,
  minDepositAmount,
  shouldFetchCryptoRoutes,
  setActiveStep,
  getChain,
  estimateCallback,
}: UseFetchRoutesProps) => {
  const [isValidAmountIn] = useState(true);
  const [loading, setLoading] = useState(false);

  const [isEnoughDepositTokens, setIsEnoughDepositTokens] = useState(true);
  const [failedToFetchRoute, setFailedToFetchRoute] = useState(false);

  const { balance } = useTokenInputBox();

  const slippage = useAtomValue(slippageAtom);
  const widgetMode = useAtomValue(widgetModeAtom);
  const selectedCurrency = useAtomValue(selectedCurrencyAtom);

  const [, setAllRoutes] = useAtom(allRoutesAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const selectedToken = useAtomValue(selectedTokenAtom);
  const swapResultTokenGlobal = useAtomValue(swapResultTokenAtom);
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);
  const fromTokenAfterFiatTx = useAtomValue(fromTokenAfterFiatTxAtom);
  const payoutAfterFiatSwap = useAtomValue(payoutAfterFiatSwapAtom);

  const setTokenFetchError = useSetAtom(tokenFetchErrorAtom);
  const setTransactionsList = useSetAtom(transactionsListAtom);
  const setLastMileTokenEstimate = useSetAtom(lastMileTokenEstimateAtom);

  const selectedWallets = useMemo(() => {
    return (
      selectedRoute?.swapSteps.reduce(
        (wallets: Record<string, string>, swapStep) => {
          const fromBlockchain = swapStep.sourceToken.blockchain;
          const toBlockchain = swapStep.destinationToken.blockchain;

          const isSolanaFrom = fromBlockchain === 'SOLANA';
          const isSolanaTo = toBlockchain === 'SOLANA';
          const isBitcoinFrom = fromBlockchain === 'BTC';
          const isBitcoinTo = toBlockchain === 'BTC';

          if (isSolanaFrom || isSolanaTo) {
            wallets['SOLANA'] = solanaAddress?.toString() || '';
          }
          if (isBitcoinFrom || isBitcoinTo) {
            wallets['BTC'] = bitcoinAccount?.address || '';
          }

          const fromChain = getChain(fromBlockchain);
          const toChain = getChain(toBlockchain);

          const isEvmFrom = fromChain?.chainType === ChainType.EVM;
          const isEvmTo = toChain?.chainType === ChainType.EVM;

          if (isEvmFrom) wallets[fromBlockchain] = evmAddress!;
          if (isEvmTo) wallets[toBlockchain] = evmAddress!;

          return wallets;
        },
        {},
      ) || {}
    );
  }, [bitcoinAccount, solanaAddress, evmAddress]);

  const onGetRoutes = async (withGoNext: boolean = true) => {
    if (shouldFetchCryptoRoutes) {
      await fetchCryptoRoutes(false, fromTokenAfterFiatTx);
      return;
    }

    if (activeStep > 1) return;
    if (!swapResultTokenGlobal || !selectedTokenOrFiatAmount) return;

    if (widgetMode === 'crypto' && !selectedToken) return;
    if (widgetMode === 'fiat' && !selectedCurrency) return;

    const matchWithOutputToken = selectedToken?.id === swapResultTokenGlobal.id;
    if (matchWithOutputToken) {
      setSelectedRoute({
        outputAmount: selectedTokenOrFiatAmount,
        swapSteps: [],
        routeId: '',
        missingWalletForSourceBlockchain: false,
        tags: [],
      });

      setActiveStep(1);

      setTokenFetchError({
        isError: false,
        errorMessage: '',
      });
      return;
    }

    if (widgetMode === 'crypto') await fetchCryptoRoutes(withGoNext);
    else if (widgetMode === 'fiat') await fetchFiatRoutes(withGoNext);
  };

  const fetchCryptoRoutes = async (
    withGoNext: boolean = true,
    fromToken?: { address: string; chainName: string },
  ) => {
    const isFromTokenOrSelectedToken = fromToken || selectedToken;
    if (!isFromTokenOrSelectedToken || !selectedTokenOrFiatAmount) return;

    const fromTokenAddress = fromToken
      ? fromToken?.address
      : selectedToken?.tokenAddress;
    const fromTokenChainName = fromToken
      ? fromToken?.chainName
      : selectedToken?.chainName;

    try {
      setLoading(true);
      const toTokenChainName =
        ChainIdToChainConstant[
          swapResultToken.chainId! as keyof typeof ChainIdToChainConstant
        ];

      const res = await anyaltInstance?.getAllRoutes({
        fromToken: {
          address: fromTokenAddress || '',
          chainName: fromTokenChainName || '',
        },
        toToken: {
          address: swapResultToken.address,
          chainName: toTokenChainName,
        },
        amount: payoutAfterFiatSwap || selectedTokenOrFiatAmount,
        slippage,
        selectedWallets: selectedWallets,
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

  const fetchFiatRoutes = async (withGoNext: boolean = true) => {
    if (
      !selectedCurrency ||
      !swapResultTokenGlobal ||
      !selectedTokenOrFiatAmount
    )
      return;

    try {
      setLoading(true);
      const chainName =
        ChainIdToChainConstant[
          swapResultToken.chainId! as keyof typeof ChainIdToChainConstant
        ];
      const res = await anyaltInstance?.getAllRoutes({
        fromFiatOnramperId: selectedCurrency.onramperId,
        toToken: {
          address: swapResultToken.address,
          chainName,
        },
        amount: selectedTokenOrFiatAmount,
        slippage,
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
      selectedTokenOrFiatAmount &&
      parseFloat(balance) < parseFloat(selectedTokenOrFiatAmount) &&
      widgetMode === 'crypto'
    ) {
      setTokenFetchError({
        isError: true,
        errorMessage: `You don't have enough tokens in your wallet.`,
      });
    }
  }, [selectedRoute, widgetMode]);

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
    if (selectedRoute && swapResultTokenGlobal) {
      setListOfTransactionsFromRoute(selectedRoute, swapResultTokenGlobal);
    }
  }, [selectedRoute, swapResultTokenGlobal, setListOfTransactionsFromRoute]);

  useEffect(() => {
    onGetRoutes(false);
  }, [selectedToken, selectedCurrency, slippage, shouldFetchCryptoRoutes]);

  useEffect(() => {
    const isTokenOrFiatSelected = selectedCurrency || selectedToken;
    console.log(selectedToken?.id !== swapResultTokenGlobal?.id);
    if (
      selectedTokenOrFiatAmount &&
      isTokenOrFiatSelected &&
      swapResultTokenGlobal &&
      selectedToken?.id !== swapResultTokenGlobal.id
    )
      setLoading(true);

    const debounceTimeout = setTimeout(() => {
      const isTokenOrFiatSelected = selectedCurrency || selectedToken;
      if (selectedTokenOrFiatAmount && isTokenOrFiatSelected) {
        onGetRoutes(false);
      }
    }, DEBOUNCE_TIMEOUT);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [
    selectedToken,
    selectedCurrency,
    balance,
    selectedWallets,
    swapResultTokenGlobal,
    selectedTokenOrFiatAmount,
    shouldFetchCryptoRoutes,
  ]);

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
        const currentInTokenAmount = selectedTokenOrFiatAmount;
        const userSelectedToken =
          currentInToken &&
          currentProtocolInputToken &&
          currentInTokenAmount &&
          selectedRoute;

        if (userSelectedToken && activeStep === 1) {
          onGetRoutes(false);
        }
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [selectedRoute, activeStep]);

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
