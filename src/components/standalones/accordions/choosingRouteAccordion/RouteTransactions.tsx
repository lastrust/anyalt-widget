import {
  GetAllRoutesResponseItem,
  SupportedToken,
} from '@anyalt/sdk/dist/adapter/api/api';
import { Skeleton } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { WidgetTemplateType } from '../../../..';
import {
  fiatStepCopyAtom,
  shouldFetchCryptoRoutesAtom,
} from '../../../../store/stateStore';
import { FiatStepSection } from './FiatStep';
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
  const fiatStepCopy = useAtomValue(fiatStepCopyAtom);
  const shouldFetchCryptoRoutes = useAtomValue(shouldFetchCryptoRoutesAtom);

  const isIncludeFiat = useMemo(
    () => Boolean(route.fiatStep) || shouldFetchCryptoRoutes,
    [route.fiatStep, shouldFetchCryptoRoutes],
  );

  if (loading) return <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />;

  return (
    <>
      {isIncludeFiat && (
        <FiatStepSection
          index={0}
          loading={loading}
          isAlreadyCompleted={shouldFetchCryptoRoutes}
          fiatStep={shouldFetchCryptoRoutes ? fiatStepCopy : route.fiatStep}
        />
      )}
      {route.swapSteps.map((swapStep, index) => (
        <RouteTransactionAccordion
          index={isIncludeFiat ? index + 1 : index}
          loading={loading}
          swapStep={swapStep}
          widgetTemplate={widgetTemplate}
          key={`${swapStep.swapperName}-${index}`}
          protocolInputToken={protocolInputToken}
        />
      ))}
    </>
  );
};
