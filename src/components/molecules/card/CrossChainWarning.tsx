import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { TEXTS } from '../../../constants/text';
import { bestRouteAtom } from '../../../store/stateStore';
import { WarningIconOrange } from '../../atoms/icons/transaction/WarningIconOrange';

export const CrossChainWarningCard = () => {
  const bestRoute = useAtomValue(bestRouteAtom);

  const isCrossChain = useMemo(() => {
    if (!bestRoute?.swapSteps.length) return false;

    const sourceChain = bestRoute.swapSteps[0].sourceToken.blockchain;
    return bestRoute.swapSteps.some(
      (step) => step.destinationToken.blockchain !== sourceChain,
    );
  }, [bestRoute]);

  if (!isCrossChain) return null;

  return (
    <Tooltip
      label={TEXTS.crossChainWarning}
      color="white"
      borderRadius="8px"
      padding="12px"
      bgColor="black"
      cursor={'pointer'}
    >
      <HStack alignItems="center" gap="4px" ml={'12px'} cursor="pointer">
        <Icon as={WarningIconOrange} color="#f9e154" />
        <Text color="brand.text.warning" textStyle={'regular.3'}>
          Disclaimer
        </Text>
      </HStack>
    </Tooltip>
  );
};
