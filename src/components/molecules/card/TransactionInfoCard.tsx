import { HStack, Text } from '@chakra-ui/react';
import { DividerIcon } from '../../atoms/icons/transaction/DividerIcon';
import { GasIcon } from '../../atoms/icons/transaction/GasIcon';
import { TimeIcon } from '../../atoms/icons/transaction/TimeIcon';

type Props = {
  estimatedTime?: number;
  fees?: string;
};

export const TransactionInfoCard = ({ estimatedTime, fees }: Props) => {
  return (
    <HStack
      w={'100%'}
      p={'16px 24px'}
      borderRadius={'16px'}
      borderWidth={'1px'}
      borderColor={'brand.border.primary'}
    >
      <HStack>
        <TimeIcon />
        <Text color={'brand.secondary.3'} textStyle={'regular.1'}>
          {estimatedTime} s
        </Text>
      </HStack>
      <DividerIcon />
      <HStack>
        <GasIcon />
        <Text color={'brand.secondary.3'} textStyle={'regular.1'}>
          $ {fees}
        </Text>
      </HStack>
    </HStack>
  );
};
