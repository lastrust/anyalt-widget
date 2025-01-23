import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { CopyIcon } from '../../atoms/icons/transaction/CopyIcon';
interface TransactionStatusProps {
  requestId: string;
  status: string;
}

export const TransactionStatus: FC<TransactionStatusProps> = ({
  requestId,
  status,
}) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(requestId);
  };

  return (
    <VStack
      p="24px"
      w="100%"
      borderRadius={'16px'}
      alignItems="flex-start"
      spacing="16px"
      borderColor={'brand.border.primary'}
      borderWidth={'1px'}
    >
      <Text color="brand.secondary.3">Transaction Status</Text>
      <Box
        w="100%"
        p="24px"
        borderRadius="16px"
        borderWidth="1px"
        borderColor="brand.border.primary"
      >
        <VStack alignItems="flex-start" spacing="16px">
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Text color="brand.secondary.3" fontSize="14px">
              Request ID:
            </Text>
            <Flex alignItems="center" gap="8px">
              <Text color="brand.secondary.2" fontSize="14px">
                {requestId}
              </Text>
              <Box
                as="button"
                onClick={handleCopyClick}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
              >
                <CopyIcon />
              </Box>
            </Flex>
          </Flex>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Text color="brand.secondary.3" fontSize="14px">
              Status:
            </Text>
            <Text
              color={status === 'Completed' ? 'green.500' : 'yellow.500'}
              fontSize="14px"
              fontWeight="medium"
            >
              {status}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </VStack>
  );
};
