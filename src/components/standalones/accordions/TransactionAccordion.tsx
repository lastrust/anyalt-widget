import { BestRouteResponse } from '@anyalt/sdk';
import { SwapOperationStep } from '@anyalt/sdk/dist/adapter/api/api';
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
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
  finalTokenEstimateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  transactionsProgressAtom,
  widgetTemplateAtom,
} from '../../../store/stateStore';
import { convertSwapTransactionToTransactionProgress } from '../../../utils';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { CheckIcon } from '../../atoms/icons/transaction/CheckIcon';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TransactionStep } from '../../molecules/steps/TransactionStep';
import { TransactionHash } from '../../molecules/text/TransactionHash';
import { LastMileTxAccordion } from './LastMileTxAccordion';

type Props = {
  operation: BestRouteResponse | undefined;
  currentStep: number;
  operationType: 'CURRENT' | 'PENDING';
};

export const TransactionAccordion = ({
  operation,
  currentStep,
  operationType,
}: Props) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const widgetTemplate = useAtomValue(widgetTemplateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);
  const transactionsProgress = useAtomValue(transactionsProgressAtom);

  useEffect(() => {
    if (operationType === 'CURRENT') {
      if (currentStep > 0) {
        setExpandedIndexes([currentStep - 1]);
      }
    } else {
      setExpandedIndexes(
        Array.from(
          {
            length: (operation?.swapSteps || []).filter(
              (step) => step.transactions.length,
            ).length,
          },
          (_, i) => i,
        ),
      );
    }
  }, [currentStep]);

  const isStepCurrentOne = (stepIndex: number, swapStep: SwapOperationStep) => {
    if (currentStep - 1 !== stepIndex) return false;

    if (operationType === 'PENDING') {
      return swapStep.transactions.length;
    } else {
      return (
        Boolean(
          transactionsProgress![stepIndex]?.approve ||
            transactionsProgress![stepIndex]?.swap,
        ) &&
        Boolean(
          transactionsProgress![stepIndex]?.approve?.status !== 'failed' &&
            transactionsProgress![stepIndex]?.swap?.status !== 'failed',
        )
      );
    }
  };

  if (!operation) return <></>;

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
      {operation?.swapSteps.map((swapStep, index) => (
        <AccordionItem
          key={`${swapStep.executionOrder}-${index}`}
          p={'16px'}
          bg="brand.text.secondary.3"
          borderRadius={'10px'}
          borderWidth={'3px!important'}
          borderColor={
            currentStep - 1 === index ? 'brand.border.active' : 'transparent'
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
              {currentStep - 1 > index &&
                (operationType === 'CURRENT' ? (
                  <CheckIcon />
                ) : (
                  <Text textStyle={'bold.2'} color="brand.text.highlight">
                    Completed
                  </Text>
                ))}
              {isStepCurrentOne(index, swapStep) && (
                <Text
                  textStyle={'bold.2'}
                  color={
                    operationType === 'CURRENT'
                      ? 'brand.text.active'
                      : 'brand.text.warning'
                  }
                >
                  {operationType === 'CURRENT' ? 'In Progress' : 'Pending'}
                </Text>
              )}
            </HStack>
            <Box
              bg="brand.bg.active"
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
              <Text textStyle={'regular.1'} color="brand.text.secondary.2">
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
                    amount:
                      truncateToDecimals(
                        !isNaN(parseInt(swapStep.amount))
                          ? swapStep.amount
                          : swapStep.quoteAmount,
                        3,
                      ) || '0',
                    tokenLogo: swapStep.sourceToken.logo,
                    chainName: swapStep.sourceToken.blockchain,
                    chainLogo: swapStep.sourceToken.blockchainLogo,
                  }}
                  toToken={{
                    name: swapStep.destinationToken.symbol,
                    amount:
                      truncateToDecimals(
                        !isNaN(parseInt(swapStep.payout))
                          ? swapStep.payout
                          : swapStep.quotePayout,
                        3,
                      ) || '0',
                    chainName: swapStep.destinationToken.blockchain,
                    tokenLogo: swapStep.destinationToken.logo,
                    chainLogo: swapStep.destinationToken.blockchainLogo,
                  }}
                />
              )}
              {operationType === 'CURRENT' && (
                <HStack w={'100%'}>
                  <HStack>
                    <TimeIcon />
                    <Text
                      color={'brand.text.secondary.2'}
                      lineHeight={'120%'}
                      textStyle={'regular.3'}
                    >
                      {swapStep.estimatedTimeInSeconds}s
                    </Text>
                  </HStack>
                  <DividerIcon />
                  <HStack>
                    <GasIcon />
                    <Text
                      color={'brand.text.secondary.2'}
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
              )}

              {operationType === 'CURRENT' ? (
                <>
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
                </>
              ) : (
                <>
                  {swapStep.transactions.map((transaction, index) => (
                    <TransactionHash
                      key={index}
                      type={transaction.type === 'MAIN' ? 'Swap' : 'Approval'}
                      progress={convertSwapTransactionToTransactionProgress(
                        swapStep,
                        transaction,
                      )}
                    />
                  ))}
                </>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}

      {widgetTemplate === 'DEPOSIT_TOKEN' && (
        <LastMileTxAccordion
          bestRoute={operation}
          currentStep={currentStep}
          isLastMileExpanded={expandedIndexes.includes(currentStep - 1)}
          protocolFinalToken={protocolFinalToken}
          protocolInputToken={protocolInputToken}
          finalTokenEstimate={finalTokenEstimate}
          transactionsProgress={transactionsProgress}
          operationType={operationType}
        />
      )}
    </Accordion>
  );
};
