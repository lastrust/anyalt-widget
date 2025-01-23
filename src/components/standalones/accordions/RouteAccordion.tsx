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
import aarnaIcon from '../../../../assets/imgs/aarna.png';
import { activeRouteAtom, selectedRouteAtom } from '../../../store/stateStore';
import { GasIcon } from '../../atoms/icons/GasIcon';
import { StepsIcon } from '../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../atoms/icons/TimeIcon';
import { RouteStep } from '../../molecules/route/RouteStep';
import { RouteTag } from '../../molecules/routeTag/RouteTag';
import { TokenRouteInfo } from '../../molecules/TokenRouteInfo';

export const RouteAccordion = () => {
  const [activeRoute] = useAtom(activeRouteAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const handleRouteSelect = () => {
    setSelectedRoute(activeRoute);
  };

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem
        border="1px solid"
        borderColor="brand.border.primary"
        borderRadius={'10px'}
        p={'16px'}
        cursor={'pointer'}
        onClick={handleRouteSelect}
        bg={
          selectedRoute?.swaps[0].swapperId === activeRoute?.swaps[0].swapperId
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
                  text={`${activeRoute?.swaps[0].estimatedTimeInSeconds}s`}
                  icon={TimeIcon}
                  textColor="brand.tertiary.100"
                />
                <RouteTag
                  text={`$${activeRoute?.swaps[0].fee
                    .reduce((acc, fee) => acc + Number(fee.amount), 0)
                    .toFixed(2)}`}
                  icon={GasIcon}
                  textColor="brand.tertiary.100"
                />
                <RouteTag
                  text={`${activeRoute?.swaps[0].internalSwaps?.length}`}
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
              network={`${activeRoute?.swaps[0].swapperId}`}
            />
          </AccordionButton>
        </h2>
        <AccordionPanel p={'0px'} mt="12px">
          <VStack gap={'12px'}>
            {activeRoute?.swaps[0].internalSwaps?.map((step, index) => {
              return (
                <RouteStep
                  stepNumber={index + 1}
                  exchangeIcon={activeRoute?.swaps[0].swapperLogo}
                  exchangeName={activeRoute?.swaps[0].swapperId}
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
    </Accordion>
  );
};
