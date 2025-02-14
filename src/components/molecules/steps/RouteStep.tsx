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
  exchangeType: 'BRIDGE' | 'DEX' | 'AGGREGATOR' | 'OFF_CHAIN' | 'LAST_MILE';
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
  exchangeType,
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
      <VStack justifyContent={'space-between'} alignItems={'start'} gap={'4px'}>
        {loading ? (
          <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
        ) : (
          <Text color="brand.secondary.3" textStyle={'regular.3'}>
            {exchangeType === 'BRIDGE' ? 'Bridge' : 'Swap'} token using{' '}
            {exchangeName}
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
              {`${fromToken.amount} ${fromToken.name}.${fromToken.chainName} `.toUpperCase()}
            </Text>
            <Box>
              <ArrowRightIcon />
            </Box>
            <Text
              color="brand.secondary.3"
              fontSize="12px"
              fontWeight="regular"
            >
              {`${toToken.amount} ${toToken.name}.${toToken.chainName}`.toUpperCase()}
            </Text>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};
