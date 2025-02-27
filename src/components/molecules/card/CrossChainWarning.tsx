import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { TEXTS } from '../../../constants/text';
import { bestRouteAtom } from '../../../store/stateStore';
import { InfoIcon } from '../../atoms/icons/InfoIcon';

type Props = {
  loading: boolean;
};
export const CrossChainWarningCard = ({ loading }: Props) => {
  const bestRoute = useAtomValue(bestRouteAtom);

  const isCrossChainBridge = useMemo(() => {
    if (!bestRoute?.swapSteps.length) return false;

    return (
      bestRoute.swapSteps.some((swap) => swap.swapperType === 'BRIDGE') ||
      bestRoute.swapSteps.some((swap) =>
        swap.internalSwapSteps.some(
          (internalSwap) => internalSwap.swapperType === 'BRIDGE',
        ),
      )
    );
  }, [bestRoute]);

  if (!isCrossChainBridge || loading) return null;

  return (
    <Tooltip
      label={TEXTS.crossChainWarning}
      color="white"
      borderRadius="8px"
      padding="12px"
      bgColor="black"
      cursor={'pointer'}
    >
      <HStack
        alignItems="center"
        gap="4px"
        cursor="pointer"
        w="100%"
        pt={'5px'}
        pr={'12px'}
        justifyContent={'end'}
      >
        <Icon as={InfoIcon} color="#f9e154" />
        <Text color="brand.text.warning" textStyle={'regular.3'}>
          Disclaimer
        </Text>
      </HStack>
    </Tooltip>
  );
};
