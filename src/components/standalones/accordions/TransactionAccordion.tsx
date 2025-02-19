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
import { useState } from 'react';
import {
  bestRouteAtom,
  finalTokenEstimateAtom,
  isTokenBuyTemplateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  stepsProgressAtom,
  transactionIndexAtom,
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
  const [isLastMileExpanded, setIsLastMileExpanded] = useState(false);

  const bestRoute = useAtomValue(bestRouteAtom);
  const currentStep = useAtomValue(transactionIndexAtom);
  const stepsProgress = useAtomValue(stepsProgressAtom);
  const isTokenBuyTemplate = useAtomValue(isTokenBuyTemplateAtom);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

  const [, setSelectedRoute] = useAtom(selectedRouteAtom);

  const handleRouteSelect = () => {
    setSelectedRoute(bestRoute);
  };

  const onLastMileClick = () => {
    setIsLastMileExpanded(!isLastMileExpanded);
  };

  if (!bestRoute) return <></>;

  return (
    <Accordion
      defaultIndex={[0]}
      allowMultiple
      w={'full'}
      gap={'12px'}
      display={'flex'}
      flexDir={'column'}
    >
      {bestRoute?.swaps.map((swap, index) => (
        <AccordionItem
          key={`${swap.swapperId}-${index}`}
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
                stepsProgress?.steps[index]?.approve ||
                  stepsProgress?.steps[index]?.swap,
              ) &&
                Boolean(
                  currentStep - 1 === index &&
                    stepsProgress?.steps[index]?.approve?.status !== 'failed' && 
                    stepsProgress?.steps[index]?.swap?.status !== 'failed' 
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
                {swap.swapperType === 'BRIDGE' ? 'Bridge' : 'Swap'} tokens using{' '}
                {swap.swapperId}
              </Text>
              {swap.internalSwaps?.length && swap.internalSwaps?.length > 0 ? (
                swap.internalSwaps?.map((internalSwap, index) => {
                  return (
                    <TransactionStep
                      key={`${internalSwap.swapperId}-${index}`}
                      exchangeLogo={internalSwap.swapperLogo}
                      exchangeName={internalSwap.swapperId}
                      fromToken={{
                        name: internalSwap.from.symbol,
                        amount:
                          truncateToDecimals(internalSwap.fromAmount, 3) || '0',
                        tokenLogo: internalSwap.from.logo,
                        chainName: internalSwap.from.blockchain,
                        chainLogo: internalSwap.from.blockchainLogo,
                      }}
                      toToken={{
                        name: internalSwap.to.symbol,
                        amount:
                          truncateToDecimals(internalSwap.toAmount, 3) || '0',
                        chainName: internalSwap.to.blockchain,
                        tokenLogo: internalSwap.to.logo,
                        chainLogo: internalSwap.to.blockchainLogo,
                      }}
                    />
                  );
                })
              ) : (
                <TransactionStep
                  key={`${swap.swapperId}-${index}`}
                  exchangeLogo={swap.swapperLogo}
                  exchangeName={swap.swapperId}
                  fromToken={{
                    name: swap.from.symbol,
                    amount: truncateToDecimals(swap.fromAmount, 3) || '0',
                    tokenLogo: swap.from.logo,
                    chainName: swap.from.blockchain,
                    chainLogo: swap.from.blockchainLogo,
                  }}
                  toToken={{
                    name: swap.to.symbol,
                    amount: truncateToDecimals(swap.toAmount, 3) || '0',
                    chainName: swap.to.blockchain,
                    tokenLogo: swap.to.logo,
                    chainLogo: swap.to.blockchainLogo,
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
                    {swap.estimatedTimeInSeconds}s
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
                    {swap.fee
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

              {stepsProgress?.steps[index]?.approve && (
                <TransactionHash
                  type="Approval"
                  progress={stepsProgress?.steps[index]?.approve}
                />
              )}
              {stepsProgress?.steps[index]?.swap && (
                <TransactionHash
                  type="Swap"
                  progress={stepsProgress?.steps[index]?.swap}
                />
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}

      {!isTokenBuyTemplate && (
        <LastMileTxAccordion
          onLastMileClick={onLastMileClick}
          isLastMileExpanded={isLastMileExpanded}
          bestRoute={bestRoute}
          currentStep={currentStep}
          stepsProgress={stepsProgress}
          protocolFinalToken={protocolFinalToken}
          protocolInputToken={protocolInputToken}
          finalTokenEstimate={finalTokenEstimate}
        />
      )}
    </Accordion>
  );
};
