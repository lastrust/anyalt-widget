import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  transactionIndexAtom,
  transactionsProgressAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { CheckIcon } from '../../atoms/icons/transaction/CheckIcon';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TransactionStep } from '../../molecules/steps/TransactionStep';
import { TransactionHash } from '../../molecules/text/TransactionHash';
import { LastMileTxAccordion } from './LastMileTxAccordion';

export const TransactionAccordion = () => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const bestRoute = useAtomValue(bestRouteAtom);
  const currentStep = useAtomValue(transactionIndexAtom);
  const widgetTemplate = useAtomValue(widgetTemplateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const transactionsProgress = useAtomValue(transactionsProgressAtom);

  const [, setSelectedRoute] = useAtom(selectedRouteAtom);

  const handleRouteSelect = () => {
    setSelectedRoute(bestRoute);
  };

  useEffect(() => {
    if (currentStep > 0) {
      setExpandedIndexes([currentStep - 1]);
    }
  }, [currentStep]);

  if (!bestRoute) return <></>;

  return (
    <Accordion
      index={expandedIndexes}
      onChange={(indexes) => setExpandedIndexes(indexes as number[])}
      allowMultiple
      w={'full'}
      gap={'12px'}
      display={'flex'}
      flexDir={'column'}
    >
      {bestRoute?.swapSteps.map((swapStep, index) => (
        <AccordionItem
          key={`${swapStep.executionOrder}-${index}`}
          p={'16px'}
          cursor={'pointer'}
          bg="brand.secondary.6"
          onClick={handleRouteSelect}
          borderRadius={'10px'}
          borderWidth={'3px!important'}
          borderColor={
            currentStep - 1 === index ? 'brand.tertiary.100' : 'transparent'
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
            <HStack justifyContent={'flex-start'}>
              <Text textStyle={'bold.1'} mr="8px">
                Transaction {index + 1}
              </Text>
              {currentStep - 1 > index && <CheckIcon />}
              {Boolean(
                transactionsProgress![index]?.approve ||
                  transactionsProgress![index]?.swap,
              ) &&
                Boolean(
                  currentStep - 1 === index &&
                    transactionsProgress![index]?.approve?.status !==
                      'failed' &&
                    transactionsProgress![index]?.swap?.status !== 'failed',
                ) && (
                  <Text textStyle={'bold.2'} color="brand.tertiary.100">
                    In Progress
                  </Text>
                )}
            </HStack>
            <Box
              bg="brand.tertiary.100"
              borderRadius={'50%'}
              w={'24px'}
              h={'24px'}
              color="brand.primary"
            >
              <AccordionIcon
                pt={'2px'}
                w={'24px'}
                h={'24px'}
                color="brand.buttons.accordion.primary"
              />
            </Box>
          </AccordionButton>
          <AccordionPanel p={'0px'} mt="12px">
            <VStack gap={'12px'} alignItems={'flex-start'}>
              <Text textStyle={'regular.1'} color="brand.secondary.3">
                {swapStep.swapperType === 'BRIDGE' ? 'Bridge' : 'Swap'} tokens
                using {swapStep.swapperName}
              </Text>
              {swapStep.internalSwapSteps?.length &&
              swapStep.internalSwapSteps?.length > 0 ? (
                swapStep.internalSwapSteps?.map((internalSwap, index) => {
                  return (
                    <TransactionStep
                      key={`${internalSwap.swapperName}-${index}`}
                      exchangeLogo={internalSwap.swapperLogoUrl}
                      exchangeName={internalSwap.swapperName}
                      fromToken={{
                        name: internalSwap.sourceToken.symbol,
                        amount:
                          truncateToDecimals(internalSwap.amount, 3) || '0',
                        tokenLogo: internalSwap.sourceToken.logo,
                        chainName: internalSwap.sourceToken.blockchain,
                        chainLogo: internalSwap.sourceToken.blockchainLogo,
                      }}
                      toToken={{
                        name: internalSwap.destinationToken.symbol,
                        amount:
                          truncateToDecimals(internalSwap.payout, 3) || '0',
                        chainName: internalSwap.destinationToken.blockchain,
                        tokenLogo: internalSwap.destinationToken.logo,
                        chainLogo: internalSwap.destinationToken.blockchainLogo,
                      }}
                    />
                  );
                })
              ) : (
                <TransactionStep
                  key={`${swapStep.swapperName}-${index}`}
                  exchangeLogo={swapStep.swapperLogoUrl}
                  exchangeName={swapStep.swapperName}
                  fromToken={{
                    name: swapStep.sourceToken.symbol,
                    amount: truncateToDecimals(swapStep.amount, 3) || '0',
                    tokenLogo: swapStep.sourceToken.logo,
                    chainName: swapStep.sourceToken.blockchain,
                    chainLogo: swapStep.sourceToken.blockchainLogo,
                  }}
                  toToken={{
                    name: swapStep.destinationToken.symbol,
                    amount: truncateToDecimals(swapStep.payout, 3) || '0',
                    chainName: swapStep.destinationToken.blockchain,
                    tokenLogo: swapStep.destinationToken.logo,
                    chainLogo: swapStep.destinationToken.blockchainLogo,
                  }}
                />
              )}
              <HStack w={'100%'}>
                <HStack>
                  <TimeIcon />
                  <Text
                    color={'brand.secondary.3'}
                    lineHeight={'120%'}
                    textStyle={'regular.3'}
                  >
                    {/* // TODO: Readd this to `BestRouteResponse` */}
                    {swapStep.estimatedTimeInSeconds}s
                  </Text>
                </HStack>
                <DividerIcon />
                <HStack>
                  <GasIcon />
                  <Text
                    color={'brand.secondary.3'}
                    lineHeight={'120%'}
                    textStyle={'regular.3'}
                  >
                    ${' '}
                    {swapStep.fees
                      .reduce((acc, fee) => {
                        const amount = parseFloat(fee.amount);
                        const price = fee.price || 0;
                        return acc + amount * price;
                      }, 0)
                      .toFixed(2)
                      .toString()}
                  </Text>
                </HStack>
              </HStack>

              {transactionsProgress![index]?.approve && (
                <TransactionHash
                  type="Approval"
                  progress={transactionsProgress![index]?.approve}
                />
              )}
              {transactionsProgress![index]?.swap && (
                <TransactionHash
                  type="Swap"
                  progress={transactionsProgress![index]?.swap}
                />
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}

      {widgetTemplate === 'DEPOSIT_TOKEN' && (
        <LastMileTxAccordion
          bestRoute={bestRoute}
          currentStep={currentStep}
          isLastMileExpanded={expandedIndexes.includes(currentStep - 1)}
          protocolFinalToken={protocolFinalToken}
          protocolInputToken={protocolInputToken}
          finalTokenEstimate={finalTokenEstimate}
          transactionsProgress={transactionsProgress}
        />
      )}
    </Accordion>
  );
};
