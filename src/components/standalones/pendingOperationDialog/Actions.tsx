import { BestRouteResponse } from '@anyalt/sdk';
import { Box, BoxProps, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { Token } from '../../..';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { WarningIcon } from '../../atoms/icons/transaction/WarningIcon';
import { TransactionStep } from '../../molecules/steps/TransactionStep';

type Props = {
  disableActions: boolean;
  onContinuePendingOperation: () => void;
  onDismissPendingOperation: () => void;
  mainButtonText: string;
  pendingOperation: BestRouteResponse;
  destinationToken: Token;
} & BoxProps;

export const Actions = ({
  disableActions,
  onContinuePendingOperation,
  onDismissPendingOperation,
  mainButtonText,
  pendingOperation,
  destinationToken,
}: Props) => {
  const steps = useMemo(() => {
    return pendingOperation.swapSteps
      .filter(
        ({ status, transactions }) =>
          status === 'SUCCESS' &&
          transactions.length &&
          transactions.some(
            ({ confirmedTimestamp, failureMessage }) =>
              confirmedTimestamp && !failureMessage,
          ),
      )
      .map((step) => ({
        ...step,
        transactions: step.transactions.filter(
          ({ confirmedTimestamp, failureMessage }) =>
            confirmedTimestamp && !failureMessage,
        ),
      }));
  }, [pendingOperation]);

  return (
    <Flex
      flexDirection="column"
      gap="16px"
      justifyItems={'center'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100%'}
    >
      <Icon my={8} as={WarningIcon} boxSize={12} color="#f9e154" />
      <Flex
        flexDirection="column"
        gap="16px"
        justifyItems={'center'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
      >
        <Text textAlign={'center'} textStyle={'heading.1'}>
          Transaction/s Pending for {destinationToken.name}
        </Text>
        <Text textAlign={'center'} textStyle={'small.1'} textColor="gray">
          <strong>Transaction(s) completed:</strong>
        </Text>
        <Flex
          flexDirection="column"
          justifyItems={'center'}
          alignItems={'center'}
          justifyContent={'center'}
          w={'full'}
        >
          {steps.length > 0 ? (
            steps.map((step, index) => (
              <Box w="full" mb="6px" key={step.swapperName + index}>
                <TransactionStep
                  justify={'center'}
                  key={index}
                  fromToken={{
                    name: step.sourceToken.symbol,
                    amount: truncateToDecimals(step.amount, 3) || '0',
                    tokenLogo: step.sourceToken.logo,
                    chainName: step.sourceToken.blockchain,
                    chainLogo: step.sourceToken.blockchainLogo,
                  }}
                  toToken={{
                    name: step.destinationToken.symbol,
                    amount: truncateToDecimals(step.payout, 3) || '0',
                    chainName: step.destinationToken.blockchain,
                    tokenLogo: step.destinationToken.logo,
                    chainLogo: step.destinationToken.blockchainLogo,
                  }}
                />
              </Box>
            ))
          ) : (
            <Text textAlign={'center'} textStyle={'small.1'} textColor="gray">
              No transactions completed yet
            </Text>
          )}
        </Flex>
        <Text textAlign={'center'} textStyle={'small.1'} textColor="gray">
          <strong>
            We found pending transaction/s to complete. Do you want to continue
            the transactions?
          </strong>
        </Text>
      </Flex>

      <CustomButton
        disabled={disableActions}
        onButtonClick={onContinuePendingOperation}
      >
        {mainButtonText}
      </CustomButton>
      <Button
        disabled={disableActions}
        p={'16px 20px'}
        width="100%"
        borderRadius="8px"
        fontSize="16px"
        fontWeight="700"
        lineHeight="120%"
        height={'unset'}
        _hover={{
          bg: 'brand.buttons.outline.hover',
        }}
        borderColor="brand.buttons.outline.border"
        borderWidth="1px"
        background={'none'}
        backdropFilter={'blur(50px)'}
        color={'brand.secondary.1'}
        onClick={onDismissPendingOperation}
      >
        Start New Transaction
      </Button>
      <Flex
        justifyContent={'center'}
        justifyItems={'center'}
        alignContent={'center'}
        alignItems={'center'}
        gap={'8px'}
      >
        <Icon as={WarningIcon} color="#f9e154" />
        <Text textAlign={'center'} textStyle={'small.1'} textColor="gray">
          By starting a new transaction you are dismissing this route.
        </Text>
      </Flex>
    </Flex>
  );
};
