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
  fromToken,
  toToken,
  loading,
}: Props) => {
  return (
    <Flex justifyContent={'start'} w={'full'} alignItems={'center'}>
      <VStack justifyContent={'space-between'} alignItems={'start'} gap={'8px'}>
        <HStack gap={'4px'}>
          {loading ? (
            <Skeleton w={'16px'} h={'16px'} borderRadius={'50%'} mr={'8px'} />
          ) : (
            <Image
              src={exchangeIcon}
              alt={`${exchangeIcon} Icon`}
              marginRight={'4px'}
              width="16px"
              height="16px"
              borderRadius={'50%'}
              border="1px solid white"
            />
          )}
          {loading ? (
            <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
          ) : (
            <Text color="brand.secondary.3" textStyle={'regular.3'}>
              {/* {exchangeType === 'BRIDGE' ? 'Bridge' : 'Swap'} token using{' '} */}
              {exchangeName}:
            </Text>
          )}
        </HStack>
        {loading ? (
          <Skeleton w={'250px'} h={'18px'} borderRadius="12px" />
        ) : (
          <HStack gap={'4px'}>
            <Text
              color="brand.secondary.3"
              textStyle={'regular.3'}
              noOfLines={1}
            >
              {`${fromToken.amount} ${fromToken.name} on ${fromToken.chainName.slice(0, 1).toUpperCase() + fromToken.chainName.slice(1).toLowerCase()} `}
            </Text>
            <Box>
              <ArrowRightIcon />
            </Box>
            <Text
              color="brand.secondary.3"
              textStyle={'regular.3'}
              noOfLines={1}
            >
              {`${toToken.amount} ${toToken.name} on ${toToken.chainName.slice(0, 1).toUpperCase() + toToken.chainName.slice(1).toLowerCase()}`}
            </Text>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};
