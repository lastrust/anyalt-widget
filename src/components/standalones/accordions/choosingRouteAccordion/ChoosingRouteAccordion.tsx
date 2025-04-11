import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
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
import { EstimateResponse } from '../../../..';
import { RANGO_PLACEHOLDER_LOGO } from '../../../../constants/links';
import { ChainIdToChainConstant } from '../../../../utils/chains';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { GasIcon } from '../../../atoms/icons/GasIcon';
import { StepsIcon } from '../../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../../atoms/icons/TimeIcon';
import { NoRouteCard } from '../../../molecules/card/NoRouteCard';
import { RouteTag } from '../../../molecules/routeTag/RouteTag';
import { RouteStep } from '../../../molecules/steps/RouteStep';
import { TokenRouteInfo } from '../../../molecules/TokenRouteInfo';
import { useChoosingRoutesAccordion } from './useChoosingRoutesAccordion';

type Props = {
  loading: boolean;
  failedToFetchRoute: boolean;
  estimateOutPut: (
    route: GetAllRoutesResponseItem,
  ) => Promise<EstimateResponse>;
};

const colorsMap = {
  fastest: {
    text: '#3777F7',
    bg: 'rgba(55, 119, 247, 0.10)',
  },
  bestReturn: {
    text: '#00A958',
    bg: 'rgba(0, 169, 88, 0.10)',
  },
  lowestFee: {
    text: '#FF2D99',
    bg: 'rgba(255, 45, 153, 0.10)',
  },
  leastTransactions: {
    text: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.10)',
  },
  executable: {
    text: '#006400',
    bg: 'rgba(0, 100, 0, 0.15)',
  },
};

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'fastest':
      return colorsMap.fastest;
    case 'Best Return':
      return colorsMap.bestReturn;
    case 'Lowest Fee':
      return colorsMap.lowestFee;
    case 'Least Transactions':
      return colorsMap.leastTransactions;
    case 'Executable':
      return colorsMap.executable;
    default:
      return colorsMap.fastest;
  }
};

export const ChoosingRouteAccordion = ({
  loading,
  failedToFetchRoute,
  estimateOutPut,
}: Props) => {
  const {
    slippage,
    allRoutes,
    calcFees,
    fromToken,
    isSameToken,
    selectedRef,
    selectedRoute,
    routeEstimates,
    widgetTemplate,
    defaultAccordionOpen,
    calcTokenPrice,
    handleRouteSelect,
    protocolFinalToken,
    protocolInputToken,
    finalTokenEstimate,
  } = useChoosingRoutesAccordion({
    estimateOutPut,
  });

  if (!allRoutes) return <></>;

  if (failedToFetchRoute && !loading) {
    return <NoRouteCard />;
  }

  return (
    <Box w={'100%'} mt="16px">
      <Accordion
        defaultIndex={defaultAccordionOpen}
        allowMultiple
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: widgetTemplate === 'TOKEN_BUY' ? '350px' : '410px',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        }}
      >
        {!isSameToken &&
          allRoutes.map((route, index) => {
            const isSelected = route.routeId === selectedRoute?.routeId;
            return (
              <AccordionItem
                ref={isSelected ? selectedRef : null}
                key={`${route.outputAmount}-${index}`}
                border="2px solid"
                borderWidth={loading ? '1px' : '2px!important'}
                borderColor={
                  selectedRoute?.routeId === route.routeId
                    ? 'brand.border.bestRoute'
                    : 'transparent'
                }
                borderRadius={'10px'}
                p={'16px'}
                cursor={'pointer'}
                bg={'brand.bg.bestRoute'}
                onClick={() => handleRouteSelect(route)}
              >
                <AccordionButton
                  display={'flex'}
                  flexDir={'column'}
                  justifyContent={'space-between'}
                  gap="8px"
                  p={'0px'}
                  w={'100%'}
                  _hover={{
                    bgColor: 'transparent',
                  }}
                >
                  <Flex w={'full'} justifyContent={'space-between'}>
                    <Flex alignItems="center" gap="8px" w={'100%'}>
                      {route?.isExecutable && (
                        <RouteTag
                          loading={loading}
                          text={'#Executable'}
                          textColor={getTagColor('Executable').text}
                          bgColor={getTagColor('Executable').bg}
                          withPadding
                        />
                      )}
                      {route.tags.map((tag, index) => {
                        return (
                          <RouteTag
                            key={`${tag}-${index}`}
                            loading={loading}
                            text={`#${tag}`}
                            textColor={getTagColor(tag).text}
                            bgColor={getTagColor(tag).bg}
                            withPadding
                          />
                        );
                      })}
                    </Flex>
                    <Box
                      h={'24px'}
                      w={'24px'}
                      borderRadius={'50%'}
                      bgColor="brand.bg.active"
                      cursor="pointer"
                    >
                      <AccordionIcon
                        w={'24px'}
                        h={'24px'}
                        color="brand.text.secondary.0"
                      />
                    </Box>
                  </Flex>
                  <Divider bg="rgba(51, 51, 51, 0.20)" m="0px" />
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
                        text={`${route.swapSteps.reduce((acc, swap) => acc + swap.estimatedTimeInSeconds, 0 + Number(finalTokenEstimate?.estimatedTimeInSeconds ?? 0)) || finalTokenEstimate?.estimatedTimeInSeconds}s`}
                        icon={TimeIcon}
                        textColor="brand.tags.route"
                        bgColor="transparent"
                      />
                      <RouteTag
                        loading={loading}
                        text={calcFees(route)}
                        icon={GasIcon}
                        textColor="brand.tags.route"
                        bgColor="transparent"
                      />
                      <RouteTag
                        loading={loading}
                        text={`${route.swapSteps.length + Number(widgetTemplate === 'DEPOSIT_TOKEN')}`}
                        icon={StepsIcon}
                        textColor="brand.tags.route"
                        bgColor="transparent"
                      />
                    </Flex>
                  </Flex>
                  <TokenRouteInfo
                    loading={loading}
                    chainIcon={
                      widgetTemplate === 'TOKEN_BUY'
                        ? protocolInputToken?.chain?.logoUrl || ''
                        : protocolInputToken?.chain?.logoUrl || ''
                    }
                    tokenName={
                      widgetTemplate === 'TOKEN_BUY'
                        ? protocolInputToken?.name || ''
                        : protocolFinalToken?.name || ''
                    }
                    tokenIcon={
                      widgetTemplate === 'TOKEN_BUY'
                        ? protocolInputToken?.logoUrl || ''
                        : protocolFinalToken?.logoUrl || ''
                    }
                    amount={
                      widgetTemplate === 'TOKEN_BUY'
                        ? route?.outputAmount || ''
                        : truncateToDecimals(
                            routeEstimates?.[route.routeId]?.amountOut ??
                              '0.00',
                            4,
                          )
                    }
                    price={
                      widgetTemplate === 'TOKEN_BUY'
                        ? calcTokenPrice(route)
                        : truncateToDecimals(
                            routeEstimates?.[route.routeId]?.priceInUSD ??
                              '0.00',
                            4,
                          )
                    }
                    slippage={slippage}
                    network={
                      widgetTemplate === 'TOKEN_BUY'
                        ? `${protocolInputToken?.name} on ${protocolInputToken?.chain?.displayName}`
                        : route.swapSteps[0]?.swapperName
                    }
                    borderRadius={'8px'}
                  />
                </AccordionButton>
                <AccordionPanel p={'0px'}>
                  <Divider my={'12px'} bg="rgba(51, 51, 51, 0.20)" />
                  <VStack
                    gap={'12px'}
                    alignItems={'flex-start'}
                    color="brand.text.secondary.2"
                  >
                    {loading ? (
                      <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
                    ) : (
                      route.swapSteps.map((swapStep, index) => {
                        return (
                          <VStack
                            gap={'12px'}
                            alignItems={'flex-start'}
                            color="brand.text.secondary.2"
                            key={`accordion-wrapper-${swapStep.executionOrder}-${index}`}
                          >
                            <Text textStyle={'bold.2'} lineHeight={'120%'}>
                              Transaction {index + 1}: {swapStep.swapperName}
                            </Text>
                            {swapStep.internalSwapSteps.map(
                              (internalSwap, internalIndex) => {
                                if (
                                  widgetTemplate === 'TOKEN_BUY' &&
                                  internalSwap.destinationToken.contractAddress.toLowerCase() ===
                                    protocolInputToken?.tokenAddress?.toLowerCase() &&
                                  internalSwap.destinationToken.logo ===
                                    RANGO_PLACEHOLDER_LOGO &&
                                  protocolInputToken?.logoUrl
                                ) {
                                  internalSwap.destinationToken.logo =
                                    protocolInputToken?.logoUrl;
                                }

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
                                        truncateToDecimals(
                                          internalSwap.amount,
                                          4,
                                        ) || '0',
                                      chainName:
                                        internalSwap.sourceToken.blockchain,
                                      icon: internalSwap.sourceToken.logo,
                                      chainIcon:
                                        internalSwap.sourceToken.blockchainLogo,
                                    }}
                                    toToken={{
                                      name: internalSwap.destinationToken
                                        .symbol,
                                      amount: truncateToDecimals(
                                        internalSwap.payout,
                                        4,
                                      ),
                                      chainName:
                                        internalSwap.destinationToken
                                          .blockchain,
                                      icon: internalSwap.destinationToken.logo,
                                      chainIcon:
                                        internalSwap.destinationToken
                                          .blockchainLogo,
                                    }}
                                  />
                                );
                              },
                            )}
                          </VStack>
                        );
                      })
                    )}

                    {widgetTemplate === 'DEPOSIT_TOKEN' && (
                      <>
                        {loading ? (
                          <Skeleton
                            w={'180px'}
                            h={'18px'}
                            borderRadius="12px"
                          />
                        ) : (
                          <Text textStyle={'bold.2'} lineHeight={'120%'}>
                            Transaction {(route.swapSteps?.length ?? 0) + 1}:
                            Final Transaction
                          </Text>
                        )}
                        <RouteStep
                          loading={loading}
                          key={`last-mile-transaction-${route.swapSteps.length}`}
                          stepNumber={1}
                          exchangeIcon={protocolFinalToken?.logoUrl || ''}
                          exchangeName={'Last Mile TX'}
                          exchangeType={'LAST_MILE'}
                          pb={'6px'}
                          fromToken={{
                            name:
                              route.swapSteps[route.swapSteps.length - 1]
                                ?.destinationToken?.symbol || '',
                            amount: truncateToDecimals(
                              route.swapSteps[route.swapSteps.length - 1]
                                ?.payout || '0',
                              4,
                            ),
                            chainName:
                              route.swapSteps[route.swapSteps.length - 1]
                                ?.destinationToken?.blockchain || '',
                            icon:
                              route.swapSteps[route.swapSteps.length - 1]
                                ?.destinationToken?.logo || '',
                            chainIcon:
                              route.swapSteps[route.swapSteps.length - 1]
                                ?.destinationToken?.blockchainLogo || '',
                          }}
                          toToken={{
                            name: protocolFinalToken?.name || '',
                            amount: truncateToDecimals(
                              routeEstimates?.[route.routeId]?.amountOut ??
                                '0.00',
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
            );
          })}
        {isSameToken && selectedRoute && (
          <AccordionItem
            key={`${selectedRoute?.outputAmount}-${selectedRoute?.routeId}`}
            border="2px solid"
            borderWidth={loading ? '1px' : '2px!important'}
            borderColor={
              selectedRoute?.routeId === selectedRoute?.routeId
                ? 'brand.border.bestRoute'
                : 'transparent'
            }
            borderRadius={'10px'}
            p={'16px'}
            cursor={'pointer'}
            bg={'brand.bg.bestRoute'}
            onClick={() => handleRouteSelect(selectedRoute)}
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
                    text={`${finalTokenEstimate?.estimatedTimeInSeconds}s`}
                    icon={TimeIcon}
                    textColor="brand.text.secondary.1"
                    bgColor="transparent"
                  />
                  <RouteTag
                    loading={loading}
                    text={finalTokenEstimate?.estimatedFeeInUSD || '0.00'}
                    icon={GasIcon}
                    textColor="brand.text.secondary.1"
                    bgColor="transparent"
                  />
                  <RouteTag
                    loading={loading}
                    text={'1'}
                    icon={StepsIcon}
                    textColor="brand.text.secondary.1"
                    bgColor="transparent"
                  />
                </Flex>
                <Box
                  h={'24px'}
                  w={'24px'}
                  borderRadius={'50%'}
                  bgColor="brand.bg.active"
                  cursor="pointer"
                >
                  <AccordionIcon
                    w={'24px'}
                    h={'24px'}
                    color="brand.text.secondary.0"
                  />
                </Box>
              </Flex>
              <TokenRouteInfo
                loading={loading}
                chainIcon={
                  widgetTemplate === 'TOKEN_BUY'
                    ? protocolInputToken?.chain?.logoUrl || ''
                    : protocolInputToken?.chain?.logoUrl || ''
                }
                tokenName={
                  widgetTemplate === 'TOKEN_BUY'
                    ? protocolInputToken?.name || ''
                    : protocolFinalToken?.name || ''
                }
                tokenIcon={
                  widgetTemplate === 'TOKEN_BUY'
                    ? protocolInputToken?.logoUrl || ''
                    : protocolFinalToken?.logoUrl || ''
                }
                amount={truncateToDecimals(
                  finalTokenEstimate?.amountOut ?? '0.00',
                  4,
                )}
                price={truncateToDecimals(
                  finalTokenEstimate?.priceInUSD ?? '0.00',
                  4,
                )}
                slippage={slippage}
                network={
                  widgetTemplate === 'TOKEN_BUY'
                    ? `${protocolFinalToken?.name} on ${protocolInputToken?.chain?.displayName}`
                    : selectedRoute.swapSteps[0]?.swapperName
                }
                borderRadius={'8px'}
              />
            </AccordionButton>
            <AccordionPanel p={'0px'}>
              <Divider my={'12px'} bg="rgba(51, 51, 51, 0.20)" />
              <RouteStep
                loading={loading}
                key={`last-mile-transaction-${selectedRoute?.swapSteps.length}`}
                stepNumber={1}
                exchangeIcon={protocolFinalToken?.logoUrl || ''}
                exchangeName={'Last Mile TX'}
                exchangeType={'LAST_MILE'}
                pb={'6px'}
                fromToken={fromToken}
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
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Box>
  );
};
