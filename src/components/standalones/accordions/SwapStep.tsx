import { SwapOperationStep } from '@anyalt/sdk/dist/adapter/api/api';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { TransactionsProgress } from '../../../types/transaction';
import { convertSwapTransactionToTransactionProgress } from '../../../utils';
import { GasIcon } from '../../atoms/icons/GasIcon';
import { TimeIcon } from '../../atoms/icons/TimeIcon';
import { CheckIcon } from '../../atoms/icons/transaction/CheckIcon';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { TransactionHash } from '../../molecules/text/TransactionHash';
import { TransactionsSteps } from './TransactionsSteps';

type Props = {
  swapStep: SwapOperationStep;
  index: number;
  currentStep: number;
  transactionsProgress: TransactionsProgress | undefined;
  operationType: 'CURRENT' | 'PENDING';
};

export const SwapStep = ({
  swapStep,
  index,
  currentStep,
  operationType,
  transactionsProgress,
}: Props) => {
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

  return (
    <AccordionItem
      key={`${swapStep.executionOrder}-${index}`}
      p={'16px'}
      bg="brand.text.secondary.3"
      borderRadius={'10px'}
      borderWidth={'3px!important'}
      borderColor={
        currentStep - 1 === index ? 'brand.border.active' : 'transparent'
      }
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
            {swapStep.swapperType === 'BRIDGE' ? 'Bridge' : 'Swap'} tokens using{' '}
            {swapStep.swapperName}
          </Text>

          <TransactionsSteps index={index} swapStep={swapStep} />

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
  );
};
