import { HStack, Text } from '@chakra-ui/react';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';

type Props = {
  isOnramperStep: boolean;
  estimatedTime?: number;
  fees?: string;
};

export const TransactionInfoCard = ({
  isOnramperStep,
  estimatedTime,
  fees,
}: Props) => {
  return (
    <HStack
      w={'100%'}
      p={isOnramperStep ? '8px 12px' : '16px 24px'}
      borderRadius={'16px'}
      borderWidth={'1px'}
      borderColor={'brand.border.primary'}
    >
      {!isOnramperStep && (
        <>
          <HStack>
            <TimeIcon />
            <Text color={'brand.text.secondary.2'} textStyle={'regular.1'}>
              {estimatedTime} s
            </Text>
          </HStack>
          <DividerIcon />
        </>
      )}
      <HStack>
        <GasIcon />
        <Text color={'brand.text.secondary.2'} textStyle={'regular.1'}>
          {isOnramperStep ? 'Transaction Cost: $' : '$'} {fees}
        </Text>
      </HStack>
    </HStack>
  );
};
