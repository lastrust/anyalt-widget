import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  slippageAtom,
} from '../../../store/stateStore';
import { ChainIdToChainConstant } from '../../../utils/chains';
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
  const slippage = useAtomValue(slippageAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const [bestRoute] = useAtom(bestRouteAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const [, setSelectedRoute] = useAtom(selectedRouteAtom);

  if (!bestRoute) return <></>;

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
                  text={`${bestRoute.swapSteps.reduce((acc, swap) => acc + swap.estimatedTimeInSeconds, 0 + Number(finalTokenEstimate?.estimatedTimeInSeconds ?? 0)) || finalTokenEstimate?.estimatedTimeInSeconds}s`}
                  icon={TimeIcon}
                  textColor="brand.tertiary.100"
                  bgColor="brand.bg.tag"
                />
                <RouteTag
                  loading={loading}
                  text={
                    bestRoute.swapSteps
                      .flatMap((step) => step.fees)
                      .reduce((acc, fee) => {
                        const amount = parseFloat(fee.amount);
                        const price = fee.price || 0;
                        return acc + amount * price;
                      }, 0) +
                      parseFloat(finalTokenEstimate?.estimatedFeeInUSD ?? '0')
                        .toFixed(2)
                        .toString() ||
                    finalTokenEstimate?.estimatedFeeInUSD + '$'
                  }
                  icon={GasIcon}
                  textColor="brand.tertiary.100"
                  bgColor="brand.bg.tag"
                />
                <RouteTag
                  loading={loading}
                  text={`${bestRoute.swapSteps.length}`}
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
                  : bestRoute.swapSteps[0]?.swapperName
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
              {loading ? (
                <Skeleton
                  w={'180px'}
                  h={'18px'}
                  ml="24px"
                  borderRadius="12px"
                />
              ) : (
                bestRoute.swapSteps.map((swapStep, index) => {
                  return (
                    <>
                      <Text textStyle={'bold.2'} lineHeight={'120%'}>
                        Transaction {index + 1}: {swapStep.swapperName}
                      </Text>
                      {swapStep.internalSwapSteps.map(
                        (internalSwap, internalIndex) => {
                          return (
                            <RouteStep
                              loading={loading}
                              key={`${swapStep.executionOrder}-${index}-${internalIndex}`}
                              stepNumber={internalIndex + 1}
                              exchangeIcon={internalSwap.swapperLogoUrl}
                              exchangeName={internalSwap.swapperName}
                              exchangeType={internalSwap.swapperType}
                              fromToken={{
                                name: internalSwap.sourceToken.symbol,
                                amount:
                                  truncateToDecimals(internalSwap.amount) ||
                                  '0',
                                chainName: internalSwap.sourceToken.blockchain,
                                icon: internalSwap.sourceToken.logo,
                                chainIcon:
                                  internalSwap.sourceToken.blockchainLogo,
                              }}
                              toToken={{
                                name: internalSwap.destinationToken.symbol,
                                amount: truncateToDecimals(internalSwap.payout),
                                chainName:
                                  internalSwap.destinationToken.blockchain,
                                icon: internalSwap.destinationToken.logo,
                                chainIcon:
                                  internalSwap.destinationToken.blockchainLogo,
                              }}
                            />
                          );
                        },
                      )}
                    </>
                  );
                })
              )}

              {!isTokenBuyTemplate && bestRoute.swapSteps.length && (
                <>
                  {loading ? (
                    <Skeleton
                      w={'180px'}
                      h={'18px'}
                      ml="24px"
                      borderRadius="12px"
                    />
                  ) : (
                    <Text textStyle={'bold.2'} lineHeight={'120%'}>
                      Transaction {(bestRoute.swapSteps?.length ?? 0) + 1}:
                      Final Transaction
                    </Text>
                  )}
                  <RouteStep
                    loading={loading}
                    key={`last-mile-transaction-${bestRoute.swapSteps.length}`}
                    stepNumber={bestRoute.swapSteps.length}
                    exchangeIcon={protocolFinalToken?.logoUrl || ''}
                    exchangeName={'Last Mile TX'}
                    exchangeType={'LAST_MILE'}
                    fromToken={{
                      name: bestRoute.swapSteps[bestRoute.swapSteps.length - 1]
                        .destinationToken.symbol,
                      amount:
                        truncateToDecimals(
                          bestRoute.swapSteps[bestRoute.swapSteps.length - 1]
                            .payout,
                        ) || '0',
                      chainName:
                        bestRoute.swapSteps[bestRoute.swapSteps.length - 1]
                          .destinationToken.blockchain,
                      icon: bestRoute.swapSteps[bestRoute.swapSteps.length - 1]
                        .destinationToken.logo,
                      chainIcon:
                        bestRoute.swapSteps[bestRoute.swapSteps.length - 1]
                          .destinationToken.blockchainLogo,
                    }}
                    toToken={{
                      name: protocolFinalToken?.name || '',
                      amount: truncateToDecimals(
                        finalTokenEstimate?.amountOut ?? '0.00',
                        4,
                      ),
                      chainName:
                        protocolInputToken?.chain?.displayName ||
                        protocolFinalToken?.chainId != undefined
                          ? ChainIdToChainConstant[
                              protocolFinalToken!
                                .chainId! as keyof typeof ChainIdToChainConstant
                            ]
                          : '',
                      icon: protocolFinalToken?.logoUrl || '',
                      chainIcon: protocolInputToken?.chain?.logoUrl || '',
                    }}
                  />
                </>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
