import { BestRouteResponse } from '@anyalt/sdk';
import { BoxProps, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { Token } from '../../..';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { WarningIcon } from '../../atoms/icons/transaction/WarningIcon';

type Props = {
  onContinuePendingOperation: () => void;
  onDismissPendingOperation: () => void;
  pendingOperation: BestRouteResponse;
  destinationToken: Token;
} & BoxProps;

export const Actions = ({
  onContinuePendingOperation,
  onDismissPendingOperation,
  pendingOperation,
  destinationToken,
}: Props) => {
  const transactions = useMemo(() => {
    return pendingOperation.swapSteps
      .filter(({ status }) => status === 'SUCCESS' || status !== 'CANCELLED')
      .map(({ sourceToken, destinationToken, amount, payout }) => ({
        sourceToken,
        destinationToken,
        amount,
        payout,
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
        >
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Flex
                key={transaction.sourceToken.symbol}
                justifyContent="center"
                alignItems="center"
                textStyle={'small.1'}
                textColor="gray"
              >
                <Image
                  width={4}
                  height={4}
                  src={transaction.sourceToken.logo}
                  mr={1}
                />
                <Text>
                  {transaction.amount} {transaction.sourceToken.symbol} on{' '}
                  {transaction.sourceToken.blockchain} →
                </Text>
                <Image
                  width={4}
                  height={4}
                  src={transaction.destinationToken.logo}
                  mx={1}
                />
                <Text>
                  {transaction.payout} {transaction.destinationToken.symbol} on{' '}
                  {transaction.destinationToken.blockchain}
                </Text>
              </Flex>
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

      <CustomButton onButtonClick={onContinuePendingOperation}>
        Continue transaction(s)
      </CustomButton>
      <Button
        p={'16px 20px'}
        width="100%"
        borderRadius="8px"
        fontSize="16px"
        fontWeight="700"
        lineHeight="120%"
        height={'unset'}
        _hover={{
          bg: 'brand.secondary.12',
        }}
        borderColor="brand.secondary.1"
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
