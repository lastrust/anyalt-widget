import {
  GetAllRoutesResponseItem,
  SupportedToken,
} from '@anyalt/sdk/dist/adapter/api/api';
import { Skeleton } from '@chakra-ui/react';
import { WidgetTemplateType } from '../../../..';
import { RouteTransactionAccordion } from './RouteTransactionAccordion';

type Props = {
  loading: boolean;
  route: GetAllRoutesResponseItem;
  widgetTemplate: WidgetTemplateType;
  protocolInputToken: SupportedToken | undefined;
};
export const RouteTransactions = ({
  route,
  loading,
  widgetTemplate,
  protocolInputToken,
}: Props) => {
  if (loading) return <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />;

  return route.swapSteps.map((swapStep, index) => {
    return (
      <RouteTransactionAccordion
        index={index}
        loading={loading}
        swapStep={swapStep}
        widgetTemplate={widgetTemplate}
        key={`${swapStep.swapperName}-${index}`}
        protocolInputToken={protocolInputToken}
      />
    );
  });
};
