import {
  BoxProps,
  Flex,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  amount: number;
  price: number;
  tokenName: string;
  difference: number;
  network: string;
  tokenIcon: string;
  loading: boolean;
};

export const TokenRouteInfo: FC<Props> = ({
  amount,
  price,
  tokenName,
  tokenIcon,
  network,
  difference,
  loading,
  ...props
}) => {
  return (
    <Flex justifyContent={'start'} w={'full'} alignItems={'center'} {...props}>
      {loading ? (
        <Skeleton
          w={'40px'}
          h={'40px'}
          borderRadius={'50%'}
          marginRight={'8px'}
        />
      ) : (
        <Image
          src={tokenIcon}
          alt={`${tokenName} Icon`}
          marginRight={'8px'}
          width="40px"
          height="40px"
        />
      )}
      <VStack justifyContent={'start'} alignItems={'start'} gap={'8px'}>
        {loading ? (
          <Skeleton w={'100px'} h={'16px'} />
        ) : (
          <Text color="white" fontSize="16px" fontWeight="extrabold">
            {amount}
          </Text>
        )}
        <HStack>
          {loading ? (
            <Skeleton w={'100px'} h={'16px'} />
          ) : (
            <Text
              color="white"
              fontSize="12px"
              fontWeight="regular"
              opacity={0.4}
            >
              ~${price}
            </Text>
          )}
          {loading ? (
            <Skeleton w={'30px'} h={'16px'} />
          ) : (
            <Text
              color="white"
              fontSize="12px"
              fontWeight="regular"
              opacity={0.4}
            >
              {difference}%
            </Text>
          )}
          {loading ? (
            <Skeleton w={'100px'} h={'16px'} />
          ) : (
            <Text
              color="white"
              fontSize="12px"
              fontWeight="regular"
              opacity={0.4}
            >
              {network}
            </Text>
          )}
        </HStack>
      </VStack>
    </Flex>
  );
};
