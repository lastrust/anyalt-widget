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
  VStack,
} from '@chakra-ui/react';
import { EstimateResponse } from '../../../..';
import { ChainIdToChainConstant } from '../../../../utils/chains';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { GasIcon } from '../../../atoms/icons/GasIcon';
import { StepsIcon } from '../../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../../atoms/icons/TimeIcon';
import { NoRouteCard } from '../../../molecules/card/NoRouteCard';
import { RouteTag } from '../../../molecules/routeTag/RouteTag';
import { RouteStep } from '../../../molecules/steps/RouteStep';
import { TokenRouteInfo } from '../../../molecules/TokenRouteInfo';
import { FinalTransaction } from './FinalTransaction';
import { RouteHeader } from './RouteHeader';
import { RouteTransactions } from './RouteTransactions';
import { useChoosingRoutesAccordion } from './useChoosingRoutesAccordion';

type Props = {
  loading: boolean;
  failedToFetchRoute: boolean;
  estimateOutPut: (
    route: GetAllRoutesResponseItem,
  ) => Promise<EstimateResponse>;
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
          allRoutes?.map((route, index) => {
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
                <RouteHeader
                  loading={loading}
                  route={route}
                  widgetTemplate={widgetTemplate}
                  protocolInputToken={protocolInputToken}
                  protocolFinalToken={protocolFinalToken}
                  calcFees={calcFees}
                  calcTokenPrice={calcTokenPrice}
                  finalTokenEstimate={finalTokenEstimate}
                  routeEstimates={routeEstimates}
                  slippage={slippage}
                />
                <AccordionPanel p={'0px'}>
                  <Divider my={'12px'} bg="rgba(51, 51, 51, 0.20)" />
                  <VStack
                    gap={'12px'}
                    alignItems={'flex-start'}
                    color="brand.text.secondary.2"
                  >
                    <RouteTransactions
                      route={route}
                      loading={loading}
                      widgetTemplate={widgetTemplate}
                      protocolInputToken={protocolInputToken}
                    />
                    <FinalTransaction
                      route={route}
                      loading={loading}
                      widgetTemplate={widgetTemplate}
                      routeEstimates={routeEstimates}
                      protocolFinalToken={protocolFinalToken}
                      protocolInputToken={protocolInputToken}
                    />
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            );
          })}

        {isSameToken && (
          <AccordionItem
            key={`${selectedRoute?.outputAmount}-${selectedRoute?.routeId}`}
            border="2px solid"
            borderWidth={loading ? '1px' : '2px!important'}
            borderColor={'brand.border.bestRoute'}
            borderRadius={'10px'}
            p={'16px'}
            cursor={'pointer'}
            bg={'brand.bg.bestRoute'}
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
                    : selectedRoute?.swapSteps[0]?.swapperName || ''
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
