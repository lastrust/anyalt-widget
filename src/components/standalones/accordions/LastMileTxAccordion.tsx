import { BestRouteResponse, SupportedToken } from '@anyalt/sdk';
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
import { useAtomValue } from 'jotai';
import { EstimateResponse, Token } from '../../..';
import { selectedTokenAmountAtom } from '../../../store/stateStore';
import { TransactionsProgress } from '../../../types/transaction';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TransactionStep } from '../../molecules/steps/TransactionStep';
import { TransactionHash } from '../../molecules/text/TransactionHash';

type Props = {
  isLastMileExpanded: boolean;
  bestRoute: BestRouteResponse;
  currentStep: number;
  transactionsProgress: TransactionsProgress | undefined;
  protocolFinalToken: Token | undefined;
  finalTokenEstimate: EstimateResponse | undefined;
  swapResultToken: SupportedToken | undefined;
};

export const LastMileTxAccordion = ({
  isLastMileExpanded,
  bestRoute,
  currentStep,
  transactionsProgress,
  protocolFinalToken,
  swapResultToken,
  finalTokenEstimate,
}: Props) => {
  const selectedTokenAmount = useAtomValue(selectedTokenAmountAtom);

  return (
    <AccordionItem
      key={'last mile tx'}
      border="1px solid"
      borderColor="brand.border.primary"
      borderRadius={'10px'}
      p={'16px'}
      cursor={'pointer'}
      bg={isLastMileExpanded ? 'brand.bg.primary' : 'transparent'}
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
            Transaction {bestRoute.swapSteps.length + 1}
          </Text>
          {currentStep === bestRoute.swapSteps.length + 1 && (
            <Text textStyle={'bold.1'} color="brand.text.active">
              In Progress
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
      <AccordionPanel
        p={'0px'}
        mt="12px"
        pb={
          !finalTokenEstimate?.estimatedTimeInSeconds &&
          !finalTokenEstimate?.estimatedFeeInUSD
            ? '6px'
            : '0px'
        }
      >
        <VStack gap={'12px'}>
          <TransactionStep
            exchangeLogo={protocolFinalToken?.logoUrl || ''}
            exchangeName={'Final tx'}
            fromToken={{
              name: swapResultToken?.symbol || '',
              amount: truncateToDecimals(
                bestRoute.swapSteps.length === 0
                  ? selectedTokenAmount || '0'
                  : bestRoute.swapSteps[bestRoute.swapSteps.length - 1]
                      ?.payout || '0',
                3,
              ),
              tokenLogo: swapResultToken?.logoUrl || '',
              chainName: swapResultToken?.chain?.displayName || '',
              chainLogo: swapResultToken?.chain?.logoUrl || '',
            }}
            toToken={{
              name: protocolFinalToken?.symbol || '',
              amount: truncateToDecimals(
                finalTokenEstimate?.amountOut || '0',
                3,
              ),
              tokenLogo: protocolFinalToken?.logoUrl || '',
              chainName: swapResultToken?.chain?.displayName || '',
              chainLogo: swapResultToken?.chain?.logoUrl || '',
            }}
          />
          {finalTokenEstimate?.estimatedTimeInSeconds &&
            finalTokenEstimate?.estimatedFeeInUSD && (
              <HStack w={'100%'}>
                <HStack>
                  <TimeIcon />
                  <Text
                    color={'brand.text.secondary.2'}
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
                    color={'brand.text.secondary.2'}
                    lineHeight={'120%'}
                    textStyle={'regular.3'}
                  >
                    ${finalTokenEstimate?.estimatedFeeInUSD}
                  </Text>
                </HStack>
              </HStack>
            )}
        </VStack>

        <Box>
          {transactionsProgress![bestRoute.swapSteps.length]?.approve && (
            <TransactionHash
              type="Approval"
              progress={
                transactionsProgress![bestRoute.swapSteps.length]?.approve
              }
            />
          )}
          {transactionsProgress![bestRoute.swapSteps.length]?.swap && (
            <TransactionHash
              type="Swap"
              progress={transactionsProgress![bestRoute.swapSteps.length]?.swap}
            />
          )}
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
