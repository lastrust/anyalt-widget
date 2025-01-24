import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { activeRouteAtom, selectedRouteAtom } from '../../../store/stateStore';
import { TransactionStep } from '../../molecules/steps/TransactionStep';

export const TransactionAccordion = () => {
  const [activeRoute] = useAtom(activeRouteAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const handleRouteSelect = () => {
    setSelectedRoute(activeRoute);
  };

  return (
    <Accordion
      defaultIndex={[0]}
      allowMultiple
      w={'full'}
      gap={'12px'}
      display={'flex'}
      flexDir={'column'}
    >
      {activeRoute?.swaps.map((swap, swapIndex) =>
        swap.internalSwaps?.map((step, index) => {
          return (
            <AccordionItem
              key={`${swap.swapperId}-${index}`}
              border="1px solid"
              borderColor="brand.border.primary"
              borderRadius={'10px'}
            p={'16px'}
            cursor={'pointer'}
            onClick={handleRouteSelect}
            bg={
              selectedRoute?.swaps[swapIndex].swapperId ===
              activeRoute?.swaps[swapIndex].swapperId
                ? 'brand.secondary.12'
                : 'transparent'
            }
            _hover={{
              bgColor: 'bg.secondary.1',
            }}
            w={'100%'}
          >
            <AccordionButton
              display={'flex'}
              flexDir={'row'}
              justifyContent={'space-between'}
              gap="12px"
              p={'0px'}
            >
              <Text textStyle={'bold.0'}>Step {index + 1}</Text>
              <AccordionIcon w={'24px'} h={'24px'} />
            </AccordionButton>
            <AccordionPanel p={'0px'} mt="12px">
              <VStack gap={'12px'}>
                <TransactionStep
                  key={`${swap.swapperId}-${index}`}
                  stepNumber={index + 1}
                  exchangeIcon={swap.swapperLogo}
                  exchangeName={swap.swapperId}
                  fromToken={{
                    name: step.from.symbol,
                    amount: String(Number(step.fromAmount).toFixed(4) || '0'),
                  }}
                  toToken={{
                    name: step.to.symbol,
                    amount: String(Number(step.toAmount).toFixed(4) || '0'),
                  }}
                />
              </VStack>
            </AccordionPanel>
            </AccordionItem>
          );
        })
      )}
    </Accordion>
  );
};
