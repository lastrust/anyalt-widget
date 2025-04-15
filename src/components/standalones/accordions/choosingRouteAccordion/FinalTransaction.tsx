import {
  GetAllRoutesResponseItem,
  SupportedToken,
} from '@anyalt/sdk/dist/adapter/api/api';
import { Skeleton, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { EstimateResponse, Token, WidgetTemplateType } from '../../../..';
import { ChainIdToChainConstant } from '../../../../utils/chains';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { RouteStep } from '../../../molecules/steps/RouteStep';

type Props = {
  widgetTemplate: WidgetTemplateType;
  loading: boolean;
  route: GetAllRoutesResponseItem;
  protocolFinalToken: Token | undefined;
  protocolInputToken: SupportedToken | undefined;
  routeEstimates: Record<string, EstimateResponse> | undefined;
};

export const FinalTransaction = ({
  widgetTemplate,
  loading,
  route,
  protocolFinalToken,
  protocolInputToken,
  routeEstimates,
}: Props) => {
  if (widgetTemplate !== 'DEPOSIT_TOKEN') return null;

  if (loading) return <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />;

  const lastMile = useMemo(
    () => route.swapSteps[route.swapSteps.length - 1],
    [route],
  );

  const destinationToken = useMemo(
    () => lastMile?.destinationToken,
    [lastMile],
  );

  const toTokenChainName = useMemo(
    () =>
      protocolInputToken?.chain?.displayName ||
      protocolFinalToken?.chainId != undefined
        ? ChainIdToChainConstant[
            protocolFinalToken!.chainId! as keyof typeof ChainIdToChainConstant
          ]
        : '',
    [protocolInputToken, protocolFinalToken],
  );

  return (
    <>
      <Text textStyle={'bold.2'} lineHeight={'120%'}>
        Transaction {(route.swapSteps?.length ?? 0) + 1}: Final Transaction
      </Text>

      <RouteStep
        loading={loading}
        key={`last-mile-transaction-${route.swapSteps.length}`}
        stepNumber={1}
        exchangeIcon={protocolFinalToken?.logoUrl || ''}
        exchangeName={'Last Mile TX'}
        exchangeType={'LAST_MILE'}
        pb={'6px'}
        fromToken={{
          name: destinationToken?.symbol || '',
          amount: truncateToDecimals(lastMile?.payout || '0', 4),
          chainName: destinationToken?.blockchain || '',
          icon: destinationToken?.logo || '',
          chainIcon: destinationToken?.blockchainLogo || '',
        }}
        toToken={{
          name: protocolFinalToken?.name || '',
          amount: truncateToDecimals(
            routeEstimates?.[route.routeId]?.amountOut ?? '0.00',
            4,
          ),
          chainName: toTokenChainName,
          icon: protocolFinalToken?.logoUrl || '',
          chainIcon: protocolInputToken?.chain?.logoUrl || '',
        }}
      />
    </>
  );
};
