import { BestRouteResponse } from '@anyalt/sdk';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { ChainType } from '../../../..';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  pendingOperationAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  transactionIndexAtom,
  widgetTemplateAtom,
} from '../../../../store/stateStore';
import { mapBlockchainToChainType } from '../../../../utils/chains';
import { TokenWithAmount } from '../../../molecules/card/TransactionOverviewCard';

type Props = {
  operationType: 'CURRENT' | 'PENDING';
};

export const useTransactionList = ({ operationType }: Props) => {
  const bestRoute = useAtomValue(bestRouteAtom);
  const pendingOperation = useAtomValue(pendingOperationAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const inToken = useAtomValue(inTokenAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);
  const currentStep = useAtomValue(transactionIndexAtom);

  const destinationTokenDetails: TokenWithAmount = useMemo(() => {
    if (widgetTemplate === 'TOKEN_BUY') {
      const chainType = protocolInputToken?.chainName
        ? mapBlockchainToChainType(protocolInputToken?.chainName)
        : ChainType.EVM;

      return {
        name: protocolFinalToken?.name || '',
        contractAddress: protocolInputToken?.tokenAddress || '',
        symbol: protocolInputToken?.symbol || '',
        logo: protocolInputToken?.logoUrl || '',
        blockchain: protocolInputToken?.chain?.displayName || '',
        amount: Number(bestRoute?.outputAmount).toFixed(4) || '',
        blockchainLogo: protocolInputToken?.chain?.logoUrl || '',
        decimals: protocolInputToken?.decimals || 0,
        tokenUsdPrice:
          Number(
            bestRoute?.swapSteps[bestRoute.swapSteps.length - 1]
              .destinationToken.tokenUsdPrice,
          ) || 0,
        chainType: chainType!,
      };
    }

    return {
      name: protocolFinalToken?.name || '',
      contractAddress: protocolFinalToken?.address || '',
      symbol: protocolFinalToken?.symbol || '',
      logo: protocolFinalToken?.logoUrl || '',
      blockchain: protocolInputToken?.chain?.displayName || '',
      amount: Number(finalTokenEstimate?.amountOut).toFixed(4) || '',
      blockchainLogo: protocolInputToken?.chain?.logoUrl || '',
      decimals: protocolFinalToken?.decimals || 0,
      tokenUsdPrice: Number(finalTokenEstimate?.priceInUSD) || 0,
      chainType: protocolFinalToken?.chainType || ChainType.EVM,
    };
  }, [
    bestRoute,
    finalTokenEstimate,
    protocolFinalToken,
    protocolInputToken,
    widgetTemplate,
  ]);

  const sourceTokenDetails: TokenWithAmount = useMemo(() => {
    const sourceOfInfo =
      operationType === 'CURRENT' ? bestRoute : pendingOperation;

    if (!sourceOfInfo || sourceOfInfo?.swapSteps.length === 0) {
      const chainType = inToken?.chainName
        ? mapBlockchainToChainType(inToken?.chainName)
        : ChainType.EVM;

      return {
        name: inToken?.name || '',
        contractAddress: inToken?.tokenAddress || '',
        symbol: inToken?.symbol || '',
        logo: inToken?.logoUrl || '',
        blockchain: inToken?.chain?.displayName || '',
        amount: Number(inTokenAmount).toFixed(4) || '',
        blockchainLogo: inToken?.chain?.logoUrl || '',
        decimals: inToken?.decimals || 0,
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
  }, [operationType, bestRoute, pendingOperation, inToken]);

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
    operation: operationType === 'CURRENT' ? bestRoute : pendingOperation,
    currentStep:
      operationType === 'CURRENT'
        ? currentStep
        : getStepOfPendingOperation(pendingOperation),
    tokens: {
      from: sourceTokenDetails,
      to: destinationTokenDetails,
    },
  };
};
