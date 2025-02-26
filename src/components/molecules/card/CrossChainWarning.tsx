import { Text, Tooltip } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { TEXTS } from '../../../constants/text';
import { bestRouteAtom } from '../../../store/stateStore';

export const CrossChainWarningCard = () => {
  const bestRoute = useAtomValue(bestRouteAtom);

  const hasInternalSwaps = useMemo(() => {
    return bestRoute?.swapSteps.some(
      (swap) => swap.internalSwapSteps?.length > 0,
    );
  }, [bestRoute]);

  if (!hasInternalSwaps) return null;

  return (
    <Tooltip
      label={TEXTS.crossChainWarning}
      color="brand.text.warning"
      borderRadius="8px"
      padding="12px"
      bgColor="black"
    >
      <Text color="brand.text.warning" textStyle={'regular.3'}>
        Disclaimer
      </Text>
    </Tooltip>
  );
};
