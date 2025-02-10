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
  currentStepAtom,
  finalTokenEstimateAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  selectedRouteAtom,
  stepsProgressAtom,
} from '../../../store/stateStore';
import { CheckIcon } from '../../atoms/icons/transaction/CheckIcon';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TransactionStep } from '../../molecules/steps/TransactionStep';
import { TransactionHash } from '../../molecules/text/TransactionHash';

export const TransactionAccordion = () => {
  const [isLastMileExpanded, setIsLastMileExpanded] = useState(false);

  const bestRoute = useAtomValue(bestRouteAtom);
  const currentStep = useAtomValue(currentStepAtom);
  const stepsProgress = useAtomValue(stepsProgressAtom);
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
          borderWidth={'3px'}
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
              {currentStep - 1 === index && (
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
            >
              <AccordionIcon w={'24px'} h={'24px'} />
            </Box>
          </AccordionButton>
          <AccordionPanel p={'0px'} mt="12px">
            <VStack gap={'12px'} alignItems={'flex-start'}>
              <Text textStyle={'regular.1'} color="brand.secondary.3">
                Swap tokens using {swap.swapperId}
              </Text>
              {swap.internalSwaps?.map((internalSwap, index) => {
                return (
                  <TransactionStep
                    key={`${internalSwap.swapperId}-${index}`}
                    exchangeLogo={internalSwap.swapperLogo}
                    exchangeName={internalSwap.swapperId}
                    fromToken={{
                      name: internalSwap.from.symbol,
                      amount: String(
                        Number(internalSwap.fromAmount).toFixed(2) || '0',
                      ),
                      tokenLogo: internalSwap.from.logo,
                      chainName: internalSwap.from.blockchain,
                      chainLogo: internalSwap.from.blockchainLogo,
                    }}
                    toToken={{
                      name: internalSwap.to.symbol,
                      amount: String(
                        Number(internalSwap.toAmount).toFixed(2) || '0',
                      ),
                      chainName: internalSwap.to.blockchain,
                      tokenLogo: internalSwap.to.logo,
                      chainLogo: internalSwap.to.blockchainLogo,
                    }}
                  />
                );
              })}
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
              <Box w={'100%'}>
                {stepsProgress?.steps[index].approve && (
                  <TransactionHash
                    type="Approval"
                    progress={stepsProgress?.steps[index].approve}
                  />
                )}
                {stepsProgress?.steps[index].swap && (
                  <TransactionHash
                    type="Swap"
                    progress={stepsProgress?.steps[index].swap}
                  />
                )}
              </Box>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}

      <AccordionItem
        key={'last mile tx'}
        border="1px solid"
        borderColor="brand.border.primary"
        borderRadius={'10px'}
        p={'16px'}
        cursor={'pointer'}
        onClick={onLastMileClick}
        bg={isLastMileExpanded ? 'brand.secondary.12' : 'transparent'}
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
              Transaction {bestRoute.swaps.length + 1}
            </Text>
            {currentStep === bestRoute.swaps.length + 1 && (
              <Text textStyle={'bold.1'} color="brand.tertiary.100">
                In Progress
              </Text>
            )}
          </HStack>
          <Box
            bg="brand.tertiary.100"
            borderRadius={'50%'}
            w={'24px'}
            h={'24px'}
          >
            <AccordionIcon w={'24px'} h={'24px'} />
          </Box>
        </AccordionButton>
        <AccordionPanel p={'0px'} mt="12px">
          <VStack gap={'12px'}>
            <TransactionStep
              exchangeLogo={protocolFinalToken?.logoUrl || ''}
              exchangeName={'Last mile transaction'}
              fromToken={{
                name: protocolInputToken?.symbol || '',
                amount:
                  bestRoute.swaps[bestRoute.swaps.length - 1].toAmount || '0',
                tokenLogo: protocolInputToken?.logoUrl || '',
                chainName: protocolInputToken?.chain?.displayName || '',
                chainLogo: protocolInputToken?.chain?.logoUrl || '',
              }}
              toToken={{
                name: protocolFinalToken?.symbol || '',
                amount: finalTokenEstimate?.amountOut || '0',
                tokenLogo: protocolInputToken?.logoUrl || '',
                chainName: protocolInputToken?.chain?.displayName || '',
                chainLogo: protocolInputToken?.chain?.logoUrl || '',
              }}
            />
            <HStack w={'100%'}>
              <HStack>
                <TimeIcon />
                <Text
                  color={'brand.secondary.3'}
                  lineHeight={'120%'}
                  textStyle={'regular.3'}
                >
                  {finalTokenEstimate?.estimatedTimeInSeconds}s
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
                  ${finalTokenEstimate?.estimatedFeeInUSD}
                </Text>
              </HStack>
            </HStack>
          </VStack>

          <Box>
            {stepsProgress?.steps[bestRoute.swaps.length].approve && (
              <TransactionHash
                type="Approval"
                progress={stepsProgress?.steps[bestRoute.swaps.length].approve}
              />
            )}
            {stepsProgress?.steps[bestRoute.swaps.length].swap && (
              <TransactionHash
                type="Swap"
                progress={stepsProgress?.steps[bestRoute.swaps.length].swap}
              />
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
