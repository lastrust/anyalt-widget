import {
  Box,
  BoxProps,
  Flex,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
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
    icon: string;
    chainIcon: string;
    amount: string;
    chainName: string;
  };
  toToken: {
    name: string;
    icon: string;
    chainIcon: string;
    amount: string;
    chainName: string;
  };
} & BoxProps;

export const RouteStep = ({
  exchangeIcon,
  exchangeName,
  stepNumber,
  exchangeType,
  fromToken,
  toToken,
  loading,
  ...props
}: Props) => {
  return (
    <Flex
      justifyContent={'start'}
      w={'full'}
      alignItems={'center'}
      width={'100%'}
      {...props}
    >
      <VStack justifyContent={'space-between'} alignItems={'start'} gap={'8px'}>
        <HStack gap={'4px'}>
          {loading ? (
            <Skeleton w={'40px'} h={'16px'} mr={'4px'} borderRadius="12px" />
          ) : (
            <Text textStyle={'extraBold.5'} color="brand.text.secondary.2">
              Step {stepNumber}:
            </Text>
          )}
          {loading ? (
            <Skeleton w={'16px'} h={'16px'} borderRadius={'50%'} mr={'4px'} />
          ) : (
            <Image
              src={exchangeIcon}
              alt={`${exchangeIcon} Icon`}
              width="16px"
              height="16px"
              borderRadius={'50%'}
              border="1px solid white"
            />
          )}
          {loading ? (
            <Skeleton w={'180px'} h={'18px'} borderRadius="12px" />
          ) : (
            <Text color="brand.text.secondary.2" textStyle={'regular.3'}>
              {exchangeType === 'BRIDGE'
                ? 'Bridge token using'
                : exchangeType === 'LAST_MILE'
                  ? ''
                  : 'Swap token using'}{' '}
              {exchangeName}
            </Text>
          )}
        </HStack>
        {loading ? (
          <Skeleton w={'250px'} h={'18px'} borderRadius="12px" />
        ) : (
          <HStack gap={'6px'} width={'100%'} justifyContent={'space-between'}>
            <HStack gap={'8px'}>
              <Box position="relative">
                <Image
                  src={fromToken.icon}
                  alt={`${fromToken.icon} Icon`}
                  w={'16px'}
                  h={'16px'}
                  minW={'16px'}
                  minH={'16px'}
                  borderRadius={'50%'}
                  border="1px solid white"
                />
                <Box
                  position="absolute"
                  bottom="-3px"
                  left="10px"
                  w={'8px'}
                  h={'8px'}
                >
                  {fromToken.chainIcon !== '' ? (
                    <Image
                      src={fromToken.chainIcon}
                      alt={`${fromToken.chainName} Icon`}
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                    />
                  ) : (
                    <SkeletonCircle size="14px" bgColor="brand.secondary.9" />
                  )}
                </Box>
              </Box>

              <Text
                color="brand.text.secondary.2"
                textStyle={'regular.3'}
                noOfLines={1}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    lineHeight: '120%',
                    color: 'white',
                    marginRight: '4px',
                  }}
                >
                  {fromToken.amount}
                </span>
                {`${fromToken.name} on ${fromToken.chainName.slice(0, 1).toUpperCase() + fromToken.chainName.slice(1).toLowerCase()} `}
              </Text>
            </HStack>
            <Box>
              <ArrowRightIcon />
            </Box>
            <HStack gap={'8px'}>
              <Box position="relative">
                <Image
                  src={toToken.icon}
                  w={'16px'}
                  h={'16px'}
                  alt={`${toToken.icon} Icon`}
                  borderRadius={'50%'}
                  border="1px solid white"
                />
                <Box
                  position="absolute"
                  bottom="-3px"
                  left="10px"
                  w={'8px'}
                  h={'8px'}
                >
                  {toToken.chainIcon !== '' ? (
                    <Image
                      src={toToken.chainIcon}
                      alt={`${toToken.chainName} Icon`}
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                    />
                  ) : (
                    <SkeletonCircle size="14px" bgColor="brand.secondary.9" />
                  )}
                </Box>
              </Box>
              <Text
                color="brand.text.secondary.2"
                textStyle={'regular.3'}
                noOfLines={1}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    lineHeight: '120%',
                    color: 'white',
                    marginRight: '4px',
                  }}
                >
                  {toToken.amount}
                </span>
                {`${toToken.name} on ${toToken.chainName.slice(0, 1).toUpperCase() + toToken.chainName.slice(1).toLowerCase()}`}
              </Text>
            </HStack>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};
