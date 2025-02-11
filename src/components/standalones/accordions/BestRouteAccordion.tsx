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
import { useEffect, useState } from 'react';
import {
  bestRouteAtom,
  currentStepAtom,
  protocolFinalTokenAtom,
  selectedRouteAtom,
} from '../../../store/stateStore';
import { TransactionDetailsType } from '../../../types/transaction';
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

export const truncateToDecimals = (value: string, decimals?: number) => {
  if (!value) return ''; // Handle empty or invalid values

  if (!decimals) decimals = 6;

  const [integerPart, decimalPart] = value.toString().split('.');
  if (!decimalPart) return integerPart; // No decimals, return as is
  return `${integerPart}.${decimalPart.slice(0, decimals)}`; // Keep only the first 5 decimal places
};

export const BestRouteAccordion = ({
  loading,
  failedToFetchRoute,
  isButtonHidden = true,
}: Props) => {
  const [swaps, setSwaps] = useState<TransactionDetailsType[]>([]);

  const [bestRoute] = useAtom(bestRouteAtom);
  const currentStep = useAtomValue(currentStepAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const [, setSelectedRoute] = useAtom(selectedRouteAtom);

  if (!bestRoute) return <></>;

  useEffect(() => {
    if (bestRoute) {
      const swaps = getTransactionGroupData(bestRoute);
      setSwaps(swaps);
    }
  }, [bestRoute]);

  const handleRouteSelect = () => {
    setSelectedRoute(bestRoute);
  };

  if (failedToFetchRoute && !loading) {
    return (
      <Center h={'400px'}>
        <VStack gap={'0'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M8.02193 41.8359H39.9776C40.4966 41.8358 41.0067 41.7011 41.458 41.4449C41.9094 41.1887 42.2866 40.8197 42.5527 40.3741C42.8188 39.9285 42.9647 39.4215 42.9763 38.9026C42.9878 38.3837 42.8645 37.8707 42.6185 37.4137L26.6416 7.74187C25.5082 5.63812 22.4913 5.63812 21.3579 7.74187L5.38099 37.4137C5.13494 37.8707 5.01167 38.3837 5.0232 38.9026C5.03474 39.4215 5.1807 39.9285 5.44681 40.3741C5.71292 40.8197 6.09008 41.1887 6.54144 41.4449C6.9928 41.7011 7.50291 41.8358 8.02193 41.8359Z"
              stroke="#E53030"
              stroke-width="3.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23.4612 19.6466L23.8919 28.8002L24.3218 19.6504C24.3245 19.5919 24.3152 19.5335 24.2945 19.4787C24.2738 19.4239 24.2421 19.3739 24.2015 19.3318C24.1608 19.2897 24.112 19.2563 24.058 19.2336C24.004 19.211 23.9459 19.1996 23.8874 19.2002C23.8299 19.2008 23.773 19.2129 23.7203 19.2358C23.6675 19.2586 23.6198 19.2919 23.5801 19.3335C23.5404 19.3751 23.5094 19.4242 23.489 19.478C23.4686 19.5318 23.4591 19.5891 23.4612 19.6466Z"
              stroke="#E53030"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M24 36.1504C23.6292 36.1504 23.2666 36.0404 22.9583 35.8344C22.65 35.6284 22.4096 35.3355 22.2677 34.9929C22.1258 34.6503 22.0887 34.2733 22.161 33.9096C22.2334 33.5459 22.412 33.2118 22.6742 32.9496C22.9364 32.6873 23.2705 32.5088 23.6342 32.4364C23.9979 32.3641 24.3749 32.4012 24.7175 32.5431C25.0601 32.685 25.353 32.9254 25.559 33.2337C25.765 33.542 25.875 33.9046 25.875 34.2754C25.875 34.7727 25.6775 35.2496 25.3258 35.6012C24.9742 35.9528 24.4973 36.1504 24 36.1504Z"
              fill="#E53030"
            />
          </svg>

          <Text textStyle={'heading.1'} mt={'24px'}>
            Sorry! No routes found
          </Text>
          <Text
            mt={'16px'}
            textStyle={'regular.1'}
            lineHeight={'140%'}
            color={'brand.secondary.3'}
          >
            Please select different token and try again.
          </Text>
        </VStack>
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
          bg={'brand.secondary.6'}
        >
          <AccordionButton
            display={'flex'}
            flexDir={'column'}
            justifyContent={'space-between'}
            gap="12px"
            p={'0px'}
            w={'100%'}
            _hover={{
              bgColor: 'transparent',
            }}
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
                  bgColor="brand.bg.tag"
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
                  bgColor="brand.bg.tag"
                />
                <RouteTag
                  loading={loading}
                  text={`${bestRoute.swaps.reduce((acc, swap) => acc + swap.maxRequiredSign, 0)}`}
                  icon={StepsIcon}
                  textColor="brand.tertiary.100"
                  bgColor="brand.bg.tag"
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
              network={`${swaps[0]?.swapperName}`}
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
                  {swaps[currentStep - 1]?.swapperName}
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
                      amount: truncateToDecimals(step.from.amount) || '0',
                      chainName: step.from.chainName || '',
                    }}
                    toToken={{
                      name: step.to.name,
                      amount: truncateToDecimals(step.to.amount) || '0',
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
