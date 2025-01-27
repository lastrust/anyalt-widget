import { Text, VStack } from '@chakra-ui/react';
import { TransactionAccordion } from '../accordions/TransactionAccordion';

export const TransactionStatus = () => {
  return (
    <VStack
      p="16px"
      w="100%"
      borderRadius={'16px'}
      alignItems="flex-start"
      spacing="16px"
      borderColor={'brand.border.primary'}
      borderWidth={'1px'}
    >
      <VStack w={'full'} gap={'16px'} alignItems={'flex-start'}>
        <Text color="white" textStyle={'heading.2'}>
          Swap Steps
        </Text>
        <TransactionAccordion />
      </VStack>
    </VStack>
  );
};
