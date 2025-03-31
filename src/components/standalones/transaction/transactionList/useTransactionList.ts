import { BestRouteResponse } from '@anyalt/sdk';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { ChainType } from '../../../..';
import {
  allRoutesAtom,
  lastMileTokenAtom,
  lastMileTokenEstimateAtom,
  pendingRouteAtom,
  selectedTokenAmountAtom,
  selectedTokenAtom,
  swapResultTokenAtom,
  transactionIndexAtom,
  widgetTemplateAtom,
} from '../../../../store/stateStore';
import { mapBlockchainToChainType } from '../../../../utils/chains';
import { TokenWithAmount } from '../../../molecules/card/TransactionOverviewCard';

type Props = {
  operationType: 'CURRENT' | 'PENDING';
};

export const useTransactionList = ({ operationType }: Props) => {
  const allRoutes = useAtomValue(allRoutesAtom);
  const pendingRoute = useAtomValue(pendingRouteAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);

  const selectedToken = useAtomValue(selectedTokenAtom);
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenEstimate = useAtomValue(lastMileTokenEstimateAtom);
  const currentStep = useAtomValue(transactionIndexAtom);

  const destinationTokenDetails: TokenWithAmount = useMemo(() => {
    if (widgetTemplate === 'TOKEN_BUY') {
      const chainType = swapResultToken?.chainName
        ? mapBlockchainToChainType(swapResultToken?.chainName)
        : ChainType.EVM;

      return {
        name: swapResultToken?.name || '',
        contractAddress: swapResultToken?.tokenAddress || '',
        symbol: swapResultToken?.symbol || '',
        logo: swapResultToken?.logoUrl || '',
        blockchain: swapResultToken?.chain?.displayName || '',
        amount: Number(allRoutes?.outputAmount).toFixed(4) || '',
        blockchainLogo: swapResultToken?.chain?.logoUrl || '',
        decimals: swapResultToken?.decimals || 0,
        tokenUsdPrice:
          Number(
            allRoutes?.swapSteps[allRoutes.swapSteps.length - 1]
              .destinationToken.tokenUsdPrice,
          ) || 0,
        chainType: chainType!,
      };
    }

    return {
      name: lastMileToken?.name || '',
      chainType: lastMileToken?.chainType || ChainType.EVM,
      contractAddress: lastMileToken?.address || '',
      symbol: lastMileToken?.symbol || '',
      logo: lastMileToken?.logoUrl || '',
      blockchain: swapResultToken?.chain?.displayName || '',
      amount: Number(lastMileTokenEstimate?.amountOut).toFixed(4) || '',
      blockchainLogo: swapResultToken?.chain?.logoUrl || '',
      decimals: lastMileToken?.decimals || 0,
      tokenUsdPrice: Number(lastMileTokenEstimate?.priceInUSD) || 0,
    };
  }, [
    allRoutes,
    widgetTemplate,
    swapResultToken,
    lastMileToken,
    lastMileTokenEstimate,
  ]);

  const sourceTokenDetails: TokenWithAmount = useMemo(() => {
    const sourceOfInfo = operationType === 'CURRENT' ? allRoutes : pendingRoute;

    if (!sourceOfInfo || sourceOfInfo?.swapSteps.length === 0) {
      const chainType = selectedToken?.chainName
        ? mapBlockchainToChainType(selectedToken?.chainName)
        : ChainType.EVM;

      return {
        name: selectedToken?.name || '',
        contractAddress: selectedToken?.tokenAddress || '',
        symbol: selectedToken?.symbol || '',
        logo: selectedToken?.logoUrl || '',
        blockchain: selectedToken?.chain?.displayName || '',
        amount: Number(selectedTokenAmount).toFixed(4) || '',
        blockchainLogo: selectedToken?.chain?.logoUrl || '',
        decimals: selectedToken?.decimals || 0,
        tokenUsdPrice: 0,
        chainType: chainType!,
      };
    } else {
      return {
        name: sourceOfInfo.swapSteps[0].sourceToken.name,
        contractAddress: sourceOfInfo.swapSteps[0].sourceToken.contractAddress,
        symbol: sourceOfInfo.swapSteps[0].sourceToken.symbol,
        logo: sourceOfInfo.swapSteps[0].sourceToken.logo,
        blockchain: sourceOfInfo.swapSteps[0].sourceToken.blockchain,
        amount: Number(sourceOfInfo.swapSteps[0].amount).toFixed(4),
        blockchainLogo: sourceOfInfo.swapSteps[0].sourceToken.blockchainLogo,
        decimals: sourceOfInfo.swapSteps[0].sourceToken.decimals,
        tokenUsdPrice: sourceOfInfo.swapSteps[0].sourceToken.tokenUsdPrice,
        chainType: mapBlockchainToChainType(
          sourceOfInfo.swapSteps[0].sourceToken.blockchain,
        )!,
      };
    }
  }, [operationType, allRoutes, pendingRoute, selectedToken]);

  const getStepOfPendingOperation = (
    pendingOperation: BestRouteResponse | undefined,
  ) => {
    return (
      (pendingOperation?.swapSteps ?? []).filter(
        (step) => step.status === 'SUCCESS',
      ).length + 1
    );
  };

  return {
    operation: operationType === 'CURRENT' ? allRoutes : pendingRoute,
    currentStep:
      operationType === 'CURRENT'
        ? currentStep
        : getStepOfPendingOperation(pendingRoute),
    tokens: {
      from: sourceTokenDetails,
      to: destinationTokenDetails,
    },
  };
};
