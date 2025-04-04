import { AnyAlt } from '@anyalt/sdk';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { Token, WidgetTemplateType } from '../../..';
import { ANYALT_PLACEHOLDER_LOGO } from '../../../constants/links';
import {
  allChainsAtom,
  anyaltInstanceAtom,
  lastMileTokenAtom,
  showPendingRouteDialogAtom,
  showStuckTransactionDialogAtom,
  swapResultTokenAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';

type UseSetupWidgetProps = {
  apiKey: string;
  activeStep: number;
  swapResultToken: Token;
  finalToken: Token | undefined;
  widgetTemplate: WidgetTemplateType;
};

type UseSetupWidgetReturn = {
  modalWrapperMaxWidth: string;
  headerCustomText: string | undefined;
};

export const useSetupWidget = ({
  apiKey,
  activeStep,
  finalToken,
  swapResultToken,
  widgetTemplate,
}: UseSetupWidgetProps): UseSetupWidgetReturn => {
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [anyaltInstance, setAnyaltInstance] = useAtom(anyaltInstanceAtom);

  const setTemplate = useSetAtom(widgetTemplateAtom);
  const setLastMileToken = useSetAtom(lastMileTokenAtom);
  const setSwapResultToken = useSetAtom(swapResultTokenAtom);
  const showPendingOperationDialog = useAtomValue(showPendingRouteDialogAtom);
  const showStuckTransactionDialog = useAtomValue(
    showStuckTransactionDialogAtom,
  );

  useEffect(() => {
    const anyaltInstance = new AnyAlt(apiKey);
    setAnyaltInstance(anyaltInstance);

    if (anyaltInstance)
      try {
        anyaltInstance.getChains().then((res) => {
          setAllChains(res.chains);
        });
      } catch (error) {
        console.error(error);
      }

    setLastMileToken(finalToken);
    setTemplate(widgetTemplate);
  }, []);

  useEffect(() => {
    const outputTokenChain = allChains.find(
      (chain) =>
        (swapResultToken.chainId &&
          chain.chainId === swapResultToken.chainId &&
          chain.chainType === swapResultToken.chainType) ||
        (!swapResultToken.chainId &&
          chain.chainType === swapResultToken.chainType),
    );

    if (outputTokenChain) {
      anyaltInstance
        ?.getToken(outputTokenChain.name, swapResultToken.address)
        .then((res) => {
          const isLogoPlaceholder =
            res.logoUrl === ANYALT_PLACEHOLDER_LOGO && swapResultToken.logoUrl;

          if (isLogoPlaceholder) res.logoUrl = swapResultToken?.logoUrl ?? '';

          setSwapResultToken(res);
        });
    }
  }, [allChains, anyaltInstance]);

  const modalWrapperMaxWidth = useMemo(() => {
    if (showPendingOperationDialog || showStuckTransactionDialog) {
      return '976px';
    }
    if (activeStep === 0 || activeStep === 3) {
      return '512px';
    }
    return '976px';
  }, [showPendingOperationDialog, showStuckTransactionDialog, activeStep]);

  const headerCustomText = useMemo(() => {
    if (showPendingOperationDialog || showStuckTransactionDialog) {
      return 'Transaction';
    }
    return undefined;
  }, [showPendingOperationDialog, showStuckTransactionDialog]);

  return { modalWrapperMaxWidth, headerCustomText };
};
