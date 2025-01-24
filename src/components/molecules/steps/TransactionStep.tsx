import { Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';

type Props = {
  exchangeIcon: string;
  exchangeName: string;
  stepNumber: number;
  fromToken: {
    name: string;
    amount: string;
  };
  toToken: {
    name: string;
    amount: string;
  };
};

export const TransactionStep = ({
  exchangeIcon,
  exchangeName,
  stepNumber,
  fromToken,
  toToken,
}: Props) => {
  return (
    <Flex justifyContent={'start'} w={'full'} alignItems={'center'}>
      <Image
        src={exchangeIcon}
        alt={`${exchangeIcon} Icon`}
        marginRight={'8px'}
        width="16px"
        height="16px"
      />
      <VStack justifyContent={'start'} alignItems={'start'} gap={'4px'}>
        <Text color="brand.secondary.3" fontSize="12px" fontWeight="extrabold">
          Swap token using {exchangeName}
        </Text>
        <HStack>
          <Text color="brand.secondary.3" fontSize="12px" fontWeight="regular">
            {fromToken.amount} {fromToken.name} - {toToken.amount}{' '}
            {toToken.name}
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
};
