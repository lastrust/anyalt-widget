import { Flex, HStack, Image, Skeleton, Text, VStack } from '@chakra-ui/react';

type Props = {
  loading: boolean;
  exchangeIcon: string;
  exchangeName: string;
  stepNumber: number;
  fromToken: {
    name: string;
    amount: string;
    chainName: string;
  };
  toToken: {
    name: string;
    amount: string;
    chainName: string;
  };
};

export const RouteStep = ({
  exchangeIcon,
  exchangeName,
  fromToken,
  toToken,
  loading,
}: Props) => {
  return (
    <Flex justifyContent={'start'} w={'full'} alignItems={'center'}>
      {loading ? (
        <Skeleton w={'16px'} h={'16px'} borderRadius={'50%'} mr={'8px'} />
      ) : (
        <Image
          src={exchangeIcon}
          alt={`${exchangeIcon} Icon`}
          marginRight={'8px'}
          width="16px"
          height="16px"
        />
      )}
      <VStack justifyContent={'start'} alignItems={'start'} gap={'4px'}>
        {loading ? (
          <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
        ) : (
          <Text color="brand.secondary.3" textStyle={'regular.3'}>
            Swap token using {exchangeName}
          </Text>
        )}
        {loading ? (
          <Skeleton w={'250px'} h={'18px'} borderRadius="12px" />
        ) : (
          <HStack>
            <Text
              color="brand.secondary.3"
              fontSize="12px"
              fontWeight="regular"
            >
              {fromToken.amount} {fromToken.name}.{fromToken.chainName} -{' '}
              {toToken.amount} {toToken.name}.{toToken.chainName}
            </Text>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};
