import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import {
  bestRouteAtom,
  currentStepAtom,
  protocolFinalTokenAtom,
  selectedRouteAtom,
} from '../../../store/stateStore';
import { getTransactionGroupData } from '../../../utils/getTransactionGroupData';
import { GasIcon } from '../../atoms/icons/GasIcon';
import { StepsIcon } from '../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../atoms/icons/TimeIcon';
import { RouteTag } from '../../molecules/routeTag/RouteTag';
import { RouteStep } from '../../molecules/steps/RouteStep';
import { TokenRouteInfo } from '../../molecules/TokenRouteInfo';

type Props = {
  loading: boolean;
  isButtonHidden?: boolean;
  failedToFetchRoute: boolean;
};

export const BestRouteAccordion = ({
  loading,
  failedToFetchRoute,
  isButtonHidden = true,
}: Props) => {
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const [bestRoute] = useAtom(bestRouteAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);
  const currentStep = useAtomValue(currentStepAtom);

  if (!bestRoute) return <></>;
  const swaps = getTransactionGroupData(bestRoute);

  const handleRouteSelect = () => {
    setSelectedRoute(bestRoute);
  };

  if (failedToFetchRoute) {
    return (
      <Center h={'400px'}>
        <Text textStyle={'bold.1'}>No routes found</Text>
      </Center>
    );
  }

  return (
    <Box w={'100%'} mt="16px">
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem
          border="1px solid"
          borderColor="brand.border.primary"
          borderRadius={'10px'}
          p={'16px'}
          cursor={'pointer'}
          onClick={handleRouteSelect}
          bg={
            selectedRoute?.swaps[0].swapperId === swaps[0].swapperName
              ? 'brand.secondary.12'
              : 'transparent'
          }
          _hover={{
            bgColor: 'bg.secondary.1',
          }}
        >
          <AccordionButton
            display={'flex'}
            flexDir={'column'}
            justifyContent={'space-between'}
            gap="12px"
            p={'0px'}
            w={'100%'}
          >
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems={'center'}
              gap="12px"
              w={'100%'}
            >
              <Flex alignItems="center" gap="8px" w={'100%'}>
                <RouteTag
                  loading={loading}
                  text="Fastest"
                  textColor="brand.secondary.5"
                  bgColor="brand.tertiary.100"
                  withBorder={false}
                />
                <RouteTag
                  loading={loading}
                  text={`${bestRoute.swaps.reduce((acc, swap) => acc + swap.estimatedTimeInSeconds, 0)}s`}
                  icon={TimeIcon}
                  textColor="brand.tertiary.100"
                />
                <RouteTag
                  loading={loading}
                  text={
                    bestRoute.swaps[0].fee
                      .reduce((acc, fee) => {
                        const amount = parseFloat(fee.amount);
                        const price = fee.price || 0;
                        return acc + amount * price;
                      }, 0)
                      .toFixed(2)
                      .toString() + '$'
                  }
                  icon={GasIcon}
                  textColor="brand.tertiary.100"
                />
                <RouteTag
                  loading={loading}
                  text={`${bestRoute.swaps.reduce((acc, swap) => acc + swap.maxRequiredSign, 0)}`}
                  icon={StepsIcon}
                  textColor="brand.tertiary.100"
                />
              </Flex>
              {!isButtonHidden && (
                <Box
                  h={'24px'}
                  w={'24px'}
                  borderRadius={'50%'}
                  bgColor="brand.tertiary.100"
                  cursor="pointer"
                >
                  <AccordionIcon w={'24px'} h={'24px'} />
                </Box>
              )}
            </Flex>
            <TokenRouteInfo
              loading={loading}
              tokenName={protocolFinalToken?.name || ''}
              tokenIcon={protocolFinalToken?.logoUrl || ''}
              amount={Number(bestRoute.outputAmount)}
              price={Number(bestRoute.outputAmount)}
              difference={0.5}
              network={`${swaps[0].swapperName}`}
            />
          </AccordionButton>
          <AccordionPanel p={'0px'} mt="12px">
            <VStack
              gap={'12px'}
              alignItems={'flex-start'}
              color="brand.secondary.3"
            >
              {loading ? (
                <Skeleton
                  w={'180px'}
                  h={'18px'}
                  ml="24px"
                  borderRadius="12px"
                />
              ) : (
                <Text textStyle={'bold.3'} ml={'24px'} lineHeight={'120%'}>
                  Transaction {currentStep}:{' '}
                  {swaps[currentStep - 1].swapperName}
                </Text>
              )}
              {swaps?.map((step, index) => {
                return (
                  <RouteStep
                    loading={loading}
                    key={`${step.swapperName}-${index}`}
                    stepNumber={index + 1}
                    exchangeIcon={step.swapperLogo}
                    exchangeName={step.swapperName}
                    fromToken={{
                      name: step.from.name,
                      amount: String(Number(step.fromAmount).toFixed(4) || '0'),
                      chainName: step.from.chainName || '',
                    }}
                    toToken={{
                      name: step.to.name,
                      amount: String(Number(step.toAmount).toFixed(4) || '0'),
                      chainName: step.to.chainName || '',
                    }}
                  />
                );
              })}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
