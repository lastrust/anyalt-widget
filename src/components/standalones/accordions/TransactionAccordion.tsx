import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Image,
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
import { getImageURL } from '../../../utils';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { ProgressItem } from '../../molecules/ProgressItem';
import { TransactionStep } from '../../molecules/steps/TransactionStep';

export const TransactionAccordion = () => {
  const currentStep = useAtomValue(currentStepAtom);
  const bestRoute = useAtomValue(bestRouteAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);
  const stepsProgress = useAtomValue(stepsProgressAtom);
  const [isLastMileExpanded, setIsLastMileExpanded] = useState(false);
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenEstimate = useAtomValue(finalTokenEstimateAtom);

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
      {currentStep <= bestRoute?.swaps.length &&
        bestRoute?.swaps.map((swap, index) => (
          <AccordionItem
            key={`${swap.swapperId}-${index}`}
            border="1px solid"
            borderColor="brand.border.primary"
            borderRadius={'10px'}
            p={'16px'}
            cursor={'pointer'}
            onClick={handleRouteSelect}
            bg={
              selectedRoute?.swaps[currentStep - 1].swapperId ===
              bestRoute?.swaps[currentStep - 1].swapperId
                ? 'brand.secondary.12'
                : 'transparent'
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
                <Text textStyle={'bold.0'} mr="8px">
                  Step {index + 1}
                </Text>
                {currentStep - 1 > index && (
                  <Image
                    src={getImageURL('check-icon.svg')}
                    alt={'check-icon'}
                    width="20px"
                    height="20px"
                  />
                )}
                {currentStep - 1 === index && (
                  <Text textStyle={'bold.1'} color="brand.tertiary.100">
                    In Progress
                  </Text>
                )}
              </HStack>
              <AccordionIcon w={'24px'} h={'24px'} />
            </AccordionButton>
            <AccordionPanel p={'0px'} mt="12px">
              <VStack gap={'12px'}>
                <TransactionStep
                  exchangeName={swap.swapperId}
                  fromToken={{
                    name: swap.from.symbol,
                    amount: String(Number(swap.fromAmount).toFixed(4) || '0'),
                    chainName: swap.from.blockchain,
                    chainLogo: swap.from.blockchainLogo,
                  }}
                  toToken={{
                    name: swap.to.symbol,
                    amount: String(Number(swap.toAmount).toFixed(4) || '0'),
                    chainName: swap.to.blockchain,
                    chainLogo: swap.to.blockchainLogo,
                  }}
                />
                <HStack w={'100%'}>
                  <HStack>
                    <TimeIcon />
                    <Text
                      color={'brand.secondary.3'}
                      lineHeight={'120%'}
                      fontSize={'16px'}
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
                      fontSize={'16px'}
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
                <VStack w={'100%'}>
                  {stepsProgress?.steps[index].approve && (
                    <ProgressItem
                      progress={stepsProgress.steps[index].approve}
                    />
                  )}
                  {stepsProgress?.steps[index].swap && (
                    <ProgressItem progress={stepsProgress.steps[index].swap} />
                  )}
                </VStack>
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
            <Text textStyle={'bold.0'} mr="8px">
              Step {bestRoute.swaps.length + 1}
            </Text>
            {currentStep === bestRoute.swaps.length + 1 && (
              <Text textStyle={'bold.1'} color="brand.tertiary.100">
                In Progress
              </Text>
            )}
          </HStack>
          <AccordionIcon w={'24px'} h={'24px'} />
        </AccordionButton>
        <AccordionPanel p={'0px'} mt="12px">
          <VStack gap={'12px'}>
            <TransactionStep
              exchangeName={'Last mile transaction'}
              fromToken={{
                name: protocolInputToken?.symbol || '',
                amount: String(
                  Number(
                    bestRoute.swaps[bestRoute.swaps.length - 1].toAmount,
                  ).toFixed(2) || '0',
                ),
                chainName: protocolInputToken?.chain?.displayName || '',
                chainLogo: protocolInputToken?.chain?.logoUrl || '',
              }}
              toToken={{
                name: protocolFinalToken?.symbol || '',
                amount: String(
                  Number(finalTokenEstimate?.amountOut).toFixed(4) || '0',
                ),
                chainName: protocolInputToken?.chain?.displayName || '',
                chainLogo: protocolInputToken?.chain?.logoUrl || '',
              }}
            />
            <VStack w={'100%'}>
              {stepsProgress?.steps[bestRoute.swaps.length].approve && (
                <ProgressItem
                  progress={stepsProgress.steps[bestRoute.swaps.length].approve}
                />
              )}
              {stepsProgress?.steps[bestRoute.swaps.length].swap && (
                <ProgressItem
                  progress={stepsProgress.steps[bestRoute.swaps.length].swap}
                />
              )}
            </VStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
