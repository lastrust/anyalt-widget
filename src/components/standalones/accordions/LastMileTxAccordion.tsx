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
import { EstimateResponse, Token } from '../../..';
import { TransactionsProgress } from '../../../types/transaction';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';
import { TransactionStep } from '../../molecules/steps/TransactionStep';
import { TransactionHash } from '../../molecules/text/TransactionHash';

type Props = {
  onLastMileClick: () => void;
  isLastMileExpanded: boolean;
  bestRoute: BestRouteResponse;
  currentStep: number;
  transactionsProgress: TransactionsProgress | undefined;
  protocolFinalToken: Token | undefined;
  finalTokenEstimate: EstimateResponse | undefined;
  protocolInputToken: SupportedToken | undefined;
};

export const LastMileTxAccordion = ({
  onLastMileClick,
  isLastMileExpanded,
  bestRoute,
  currentStep,
  transactionsProgress,
  protocolFinalToken,
  protocolInputToken,
  finalTokenEstimate,
}: Props) => {
  return (
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
        <VStack gap={'12px'}>
          <TransactionStep
            exchangeLogo={protocolFinalToken?.logoUrl || ''}
            exchangeName={'Last mile transaction'}
            fromToken={{
              name: protocolInputToken?.symbol || '',
              amount: truncateToDecimals(
                bestRoute.swaps[bestRoute.swaps.length - 1].toAmount || '0',
                3,
              ),
              tokenLogo: protocolInputToken?.logoUrl || '',
              chainName: protocolInputToken?.chain?.displayName || '',
              chainLogo: protocolInputToken?.chain?.logoUrl || '',
            }}
            toToken={{
              name: protocolFinalToken?.symbol || '',
              amount: truncateToDecimals(
                finalTokenEstimate?.amountOut || '0',
                3,
              ),
              tokenLogo: protocolFinalToken?.logoUrl || '',
              chainName: protocolInputToken?.chain?.displayName || '',
              chainLogo: protocolInputToken?.chain?.logoUrl || '',
            }}
          />
          {finalTokenEstimate?.estimatedTimeInSeconds &&
            finalTokenEstimate?.estimatedFeeInUSD && (
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
            )}
        </VStack>

        <Box>
          {transactionsProgress?.transactions[bestRoute.swaps.length]
            .approve && (
            <TransactionHash
              type="Approval"
              progress={
                transactionsProgress?.transactions[bestRoute.swaps.length]
                  .approve
              }
            />
          )}
          {transactionsProgress?.transactions[bestRoute.swaps.length].swap && (
            <TransactionHash
              type="Swap"
              progress={
                transactionsProgress?.transactions[bestRoute.swaps.length].swap
              }
            />
          )}
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
