import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import aarnaIcon from '../../../assets/imgs/aarna.png';
import { activeRouteAtom, selectedRouteAtom } from '../../../store/stateStore';
import { GasIcon } from '../../atoms/icons/GasIcon';
import { StepsIcon } from '../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../atoms/icons/TimeIcon';
import { RouteTag } from '../../molecules/routeTag/RouteTag';
import { RouteStep } from '../../molecules/steps/RouteStep';
import { TokenRouteInfo } from '../../molecules/TokenRouteInfo';

export const RouteAccordion = () => {
  const [activeRoute] = useAtom(activeRouteAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const handleRouteSelect = () => {
    setSelectedRoute(activeRoute);
  };

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      {activeRoute?.swaps.map((swap, swapIndex) => (
        <AccordionItem
          key={swap.swapperId}
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
        >
          <h2>
            <AccordionButton
              display={'flex'}
              flexDir={'column'}
              justifyContent={'space-between'}
              gap="12px"
              p={'0px'}
            >
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems={'center'}
                gap="12px"
              >
                <Flex alignItems="center" gap="8px">
                  <RouteTag
                    text="Fastest"
                    textColor="brand.secondary.5"
                    bgColor="bg.tertiary.100"
                  />
                  <RouteTag
                    text={`${swap.estimatedTimeInSeconds}s`}
                    icon={TimeIcon}
                    textColor="brand.tertiary.100"
                  />
                  <RouteTag
                    text={`$${swap.fee
                      .reduce((acc, fee) => acc + Number(fee.amount), 0)
                      .toFixed(2)}`}
                    icon={GasIcon}
                    textColor="brand.tertiary.100"
                  />
                  <RouteTag
                    text={`${swap.internalSwaps?.length ?? 1}`}
                    icon={StepsIcon}
                    textColor="brand.tertiary.100"
                  />
                </Flex>
                <Box
                  h={'24px'}
                  w={'24px'}
                  borderRadius={'50%'}
                  bgColor="brand.tertiary.100"
                  cursor="pointer"
                >
                  <AccordionIcon w={'24px'} h={'24px'} />
                </Box>
              </Flex>
              <TokenRouteInfo
                tokenName="aarna"
                tokenIcon={aarnaIcon}
                amount={10.19}
                price={2423.53}
                difference={0.5}
                network={`${swap.swapperId}`}
              />
            </AccordionButton>
          </h2>
          <AccordionPanel p={'0px'} mt="12px">
            <VStack gap={'12px'}>
              {swap.internalSwaps?.map((step, index) => {
                return (
                  <RouteStep
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
                );
              })}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
