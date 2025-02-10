import {
  Box,
  Flex,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '../../atoms/icons/transaction/ArrowRightIcon';

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
          borderRadius={'50%'}
          border="1px solid white"
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
              {fromToken.amount} {fromToken.name}.{fromToken.chainName}{' '}
            </Text>
            <Box>
              <ArrowRightIcon />
            </Box>
            <Text
              color="brand.secondary.3"
              fontSize="12px"
              fontWeight="regular"
            >
              {toToken.amount} {toToken.name}.{toToken.chainName}
            </Text>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};
