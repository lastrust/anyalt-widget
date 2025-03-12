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
import { useBestRouteAccordion } from './useBestRouteAccordion';

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
  const {
    fees,
    slippage,
    bestRoute,
    fromToken,
    widgetTemplate,
    handleRouteSelect,
    protocolFinalToken,
    protocolInputToken,
    finalTokenEstimate,
  } = useBestRouteAccordion();

  if (!bestRoute) return <></>;

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
                  text={fees}
                  icon={GasIcon}
                  textColor="brand.tertiary.100"
                  bgColor="brand.bg.tag"
                />
                <RouteTag
                  loading={loading}
                  text={`${bestRoute.swapSteps.length + widgetTemplate}`}
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
                <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
              ) : (
                bestRoute.swapSteps.map((swapStep, index) => {
                  return (
                    <VStack
                      gap={'12px'}
                      alignItems={'flex-start'}
                      color="brand.secondary.3"
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
                                  truncateToDecimals(internalSwap.amount, 4) ||
                                  '0',
                                chainName: internalSwap.sourceToken.blockchain,
                                icon: internalSwap.sourceToken.logo,
                                chainIcon:
                                  internalSwap.sourceToken.blockchainLogo,
                              }}
                              toToken={{
                                name: internalSwap.destinationToken.symbol,
                                amount: truncateToDecimals(
                                  internalSwap.payout,
                                  4,
                                ),
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
                    </VStack>
                  );
                })
              )}

              {widgetTemplate === 'DEPOSIT_TOKEN' && (
                <>
                  {loading ? (
                    <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
                  ) : (
                    <Text textStyle={'bold.2'} lineHeight={'120%'}>
                      Transaction {(bestRoute.swapSteps?.length ?? 0) + 1}:
                      Final Transaction
                    </Text>
                  )}
                  <RouteStep
                    loading={loading}
                    key={`last-mile-transaction-${bestRoute.swapSteps.length}`}
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
                </>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
