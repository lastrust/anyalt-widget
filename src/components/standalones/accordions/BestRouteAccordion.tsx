import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  slippageAtom,
  transactionIndexAtom,
} from '../../../store/stateStore';
import { TransactionDetailsType } from '../../../types/transaction';
import { getTransactionGroupData } from '../../../utils/getTransactionGroupData';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { GasIcon } from '../../atoms/icons/GasIcon';
import { StepsIcon } from '../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../atoms/icons/TimeIcon';
import { NoRouteCard } from '../../molecules/card/NoRouteCard';
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
  const [swaps, setSwaps] = useState<TransactionDetailsType[]>([]);

  const slippage = useAtomValue(slippageAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const [bestRoute] = useAtom(bestRouteAtom);
  const currentStep = useAtomValue(transactionIndexAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const [, setSelectedRoute] = useAtom(selectedRouteAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);

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
    return <NoRouteCard />;
  }

  return (
    <Box w={'100%'} mt="16px">
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem
          border="3px solid"
          borderWidth={loading ? '1px' : '3px!important'}
          borderColor={
            loading ? 'rgba(145, 158, 171, 0.12)' : 'brand.border.bestRoute'
          }
          borderRadius={'10px'}
          p={'16px'}
          cursor={'pointer'}
          onClick={handleRouteSelect}
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
                  text={`${bestRoute.swaps.reduce((acc, swap) => acc + swap.estimatedTimeInSeconds, 0) + (finalTokenEstimate?.estimatedTimeInSeconds ?? 0) || finalTokenEstimate?.estimatedTimeInSeconds}s`}
                  icon={TimeIcon}
                  textColor="brand.tertiary.100"
                  bgColor="brand.bg.tag"
                />
                <RouteTag
                  loading={loading}
                  text={
                    (
                      bestRoute.swaps.reduce((acc, swap) => {
                        let feeAmount = 0;
                        for (const fee of swap.fee) {
                          const amount = parseFloat(fee.amount);
                          const price = fee.price || 0;
                          feeAmount += amount * price;
                        }
                        return acc + feeAmount;
                      }, 0) +
                      parseFloat(finalTokenEstimate?.estimatedFeeInUSD ?? '0')
                    )
                      .toFixed(2)
                      .toString() || finalTokenEstimate?.estimatedFeeInUSD + '$'
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
              chainIcon={
                isTokenBuyTemplate
                  ? protocolInputToken?.chain?.logoUrl || ''
                  : protocolInputToken?.chain?.logoUrl || ''
              }
              tokenName={
                isTokenBuyTemplate
                  ? protocolInputToken?.name || ''
                  : protocolFinalToken?.name || ''
              }
              tokenIcon={
                isTokenBuyTemplate
                  ? protocolInputToken?.logoUrl || ''
                  : protocolFinalToken?.logoUrl || ''
              }
              amount={Number(finalTokenEstimate?.amountOut ?? '0.00')}
              price={Number(finalTokenEstimate?.priceInUSD ?? '0.00')}
              slippage={slippage}
              network={
                !isTokenBuyTemplate
                  ? `${protocolFinalToken?.name} on ${protocolInputToken?.chain?.displayName}`
                  : bestRoute.swaps[0]?.swapperId
              }
              bg={'brand.secondary.6'}
              p="12px"
              borderRadius={'8px'}
            />
          </AccordionButton>
          <AccordionPanel p={'0px'} mt="12px">
            <VStack
              gap={'12px'}
              alignItems={'flex-start'}
              color="brand.secondary.3"
            >
              <>
                {bestRoute.swaps.length > 0 && (
                  <>
                    {loading ? (
                      <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
                    ) : (
                      <Text textStyle={'bold.2'} lineHeight={'120%'}>
                        Transaction {currentStep}:{' '}
                        {bestRoute?.swaps[currentStep - 1]?.swapperId}
                      </Text>
                    )}
                  </>
                )}
                {swaps?.map((step, index) => {
                  return (
                    <RouteStep
                      loading={loading}
                      key={`${step.swapperName}-${index}`}
                      stepNumber={index + 1}
                      exchangeIcon={step.swapperLogo}
                      exchangeName={step.swapperName}
                      exchangeType={step.swapperType}
                      fromToken={{
                        name: step.from.name,
                        icon: step.from.icon || '',
                        chainIcon: step.from.chainIcon || '',
                        amount: truncateToDecimals(step.from.amount, 4) || '0',
                        chainName: step.from.chainName || '',
                      }}
                      toToken={{
                        name: step.to.name,
                        icon: step.to.icon || '',
                        chainIcon: step.to.chainIcon || '',
                        amount: truncateToDecimals(step.to.amount, 4) || '0',
                        chainName: step.to.chainName || '',
                      }}
                    />
                  );
                })}
                {!isTokenBuyTemplate && (
                  <>
                    {swaps.length > 0 && <Divider my="16px" />}
                    <VStack
                      gap={'12px'}
                      alignItems={'flex-start'}
                      color="brand.secondary.3"
                      mb="5px"
                    >
                      {!isTokenBuyTemplate && (
                        <>
                          {loading ? (
                            <Skeleton
                              w={'180px'}
                              h={'18px'}
                              borderRadius="12px"
                            />
                          ) : (
                            <Text textStyle={'bold.2'} lineHeight={'120%'}>
                              Transaction {(bestRoute.swaps?.length ?? 0) + 1}:
                              Last Mile Transaction
                            </Text>
                          )}
                          <RouteStep
                            loading={loading}
                            key={`last-mile-transaction-${swaps.length}`}
                            stepNumber={swaps.length + 1}
                            exchangeIcon={protocolFinalToken?.logoUrl || ''}
                            exchangeName={'Final Transaction'}
                            exchangeType={'LAST_MILE'}
                            fromToken={{
                              name:
                                swaps.length > 0
                                  ? swaps[swaps.length - 1]?.to?.name
                                  : protocolInputToken?.symbol || '',
                              icon:
                                swaps.length > 0
                                  ? swaps[swaps.length - 1]?.to?.icon || ''
                                  : protocolInputToken?.logoUrl || '',
                              chainIcon:
                                swaps.length > 0
                                  ? swaps[swaps.length - 1]?.to?.chainIcon || ''
                                  : protocolInputToken?.logoUrl || '',
                              amount: truncateToDecimals(
                                swaps.length > 0
                                  ? swaps[swaps.length - 1]?.to?.amount
                                  : inTokenAmount || '0',
                                4,
                              ),
                              chainName:
                                swaps.length > 0
                                  ? swaps[swaps.length - 1]?.to?.chainName || ''
                                  : protocolInputToken?.chain?.displayName ||
                                    '',
                            }}
                            toToken={{
                              name: protocolFinalToken?.name || '',
                              icon: protocolFinalToken?.logoUrl || '',
                              chainIcon:
                                protocolInputToken?.chain?.logoUrl || '',
                              amount: truncateToDecimals(
                                finalTokenEstimate?.amountOut ?? '0.00',
                                4,
                              ),
                              chainName:
                                protocolInputToken?.chain?.displayName || '',
                            }}
                          />
                        </>
                      )}
                    </VStack>
                  </>
                )}
              </>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
