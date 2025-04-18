import { SwapOperationStep } from '@anyalt/sdk/dist/adapter/api/api';
import { useMemo } from 'react';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { TransactionStep } from '../../molecules/steps/TransactionStep';

type Props = {
  index: number;
  swapStep: SwapOperationStep;
};

export const TransactionsSteps = ({ swapStep, index }: Props) => {
  const hasInternalSwaps = useMemo(
    () =>
      swapStep.internalSwapSteps?.length &&
      swapStep.internalSwapSteps?.length > 0,
    [swapStep.internalSwapSteps],
  );

  if (hasInternalSwaps)
    return swapStep.internalSwapSteps?.map((internalSwap, index) => (
      <TransactionStep
        key={`${internalSwap.swapperName}-${index}`}
        exchangeLogo={internalSwap.swapperLogoUrl}
        exchangeName={internalSwap.swapperName}
        fromToken={{
          name: internalSwap.sourceToken.symbol,
          amount: truncateToDecimals(internalSwap.amount, 3) || '0',
          tokenLogo: internalSwap.sourceToken.logo,
          chainName: internalSwap.sourceToken.blockchain,
          chainLogo: internalSwap.sourceToken.blockchainLogo,
        }}
        toToken={{
          name: internalSwap.destinationToken.symbol,
          amount: truncateToDecimals(internalSwap.payout, 3) || '0',
          chainName: internalSwap.destinationToken.blockchain,
          tokenLogo: internalSwap.destinationToken.logo,
          chainLogo: internalSwap.destinationToken.blockchainLogo,
        }}
      />
    ));

  return (
    <TransactionStep
      key={`${swapStep.swapperName}-${index}`}
      exchangeLogo={swapStep.swapperLogoUrl}
      exchangeName={swapStep.swapperName}
      fromToken={{
        name: swapStep.sourceToken.symbol,
        amount:
          truncateToDecimals(
            !isNaN(parseInt(swapStep.amount))
              ? swapStep.amount
              : swapStep.quoteAmount,
            3,
          ) || '0',
        tokenLogo: swapStep.sourceToken.logo,
        chainName: swapStep.sourceToken.blockchain,
        chainLogo: swapStep.sourceToken.blockchainLogo,
      }}
      toToken={{
        name: swapStep.destinationToken.symbol,
        amount:
          truncateToDecimals(
            !isNaN(parseInt(swapStep.payout))
              ? swapStep.payout
              : swapStep.quotePayout,
            3,
          ) || '0',
        chainName: swapStep.destinationToken.blockchain,
        tokenLogo: swapStep.destinationToken.logo,
        chainLogo: swapStep.destinationToken.blockchainLogo,
      }}
    />
  );
};
