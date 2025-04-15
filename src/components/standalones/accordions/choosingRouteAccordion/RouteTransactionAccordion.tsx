import {
  SupportedToken,
  SwapOperationStep,
} from '@anyalt/sdk/dist/adapter/api/api';
import { Text, VStack } from '@chakra-ui/react';
import { WidgetTemplateType } from '../../../..';
import { RANGO_PLACEHOLDER_LOGO } from '../../../../constants/links';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { RouteStep } from '../../../molecules/steps/RouteStep';

type Props = {
  index: number;
  loading: boolean;
  swapStep: SwapOperationStep;
  widgetTemplate: WidgetTemplateType;
  protocolInputToken: SupportedToken | undefined;
};

export const RouteTransactionAccordion = ({
  index,
  loading,
  swapStep,
  widgetTemplate,
  protocolInputToken,
}: Props) => {
  return (
    <VStack
      gap={'12px'}
      alignItems={'flex-start'}
      color="brand.text.secondary.2"
      key={`accordion-wrapper-${swapStep.executionOrder}-${index}`}
    >
      <Text textStyle={'bold.2'} lineHeight={'120%'}>
        Transaction {index + 1}: {swapStep.swapperName}
      </Text>
      {swapStep.internalSwapSteps.map((internalSwap, internalIndex) => {
        if (
          widgetTemplate === 'TOKEN_BUY' &&
          internalSwap.destinationToken.contractAddress.toLowerCase() ===
            protocolInputToken?.tokenAddress?.toLowerCase() &&
          internalSwap.destinationToken.logo === RANGO_PLACEHOLDER_LOGO &&
          protocolInputToken?.logoUrl
        ) {
          internalSwap.destinationToken.logo = protocolInputToken?.logoUrl;
        }

        return (
          <RouteStep
            loading={loading}
            key={`${swapStep.executionOrder}-${index}-${internalIndex}`}
            stepNumber={internalIndex + 1}
            exchangeIcon={internalSwap.swapperLogoUrl}
            exchangeName={internalSwap.swapperName}
            exchangeType={internalSwap.swapperType}
            fromToken={{
              name: internalSwap.sourceToken.symbol,
              amount: truncateToDecimals(internalSwap.amount, 4) || '0',
              chainName: internalSwap.sourceToken.blockchain,
              icon: internalSwap.sourceToken.logo,
              chainIcon: internalSwap.sourceToken.blockchainLogo,
            }}
            toToken={{
              name: internalSwap.destinationToken.symbol,
              amount: truncateToDecimals(internalSwap.payout, 4),
              chainName: internalSwap.destinationToken.blockchain,
              icon: internalSwap.destinationToken.logo,
              chainIcon: internalSwap.destinationToken.blockchainLogo,
            }}
          />
        );
      })}
    </VStack>
  );
};
