import {
  BoxProps,
  Flex,
  HStack,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { TokenIconBox } from './TokenIconBox';

type Props = BoxProps & {
  amount: string;
  price: string;
  chainIcon: string;
  tokenName: string;
  slippage: string;
  network: string;
  tokenIcon: string;
  loading: boolean;
};

export const TokenRouteInfo: FC<Props> = ({
  amount,
  price,
  chainIcon,
  tokenName,
  tokenIcon,
  network,
  slippage,
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
        <TokenIconBox
          tokenName={tokenName}
          tokenIcon={tokenIcon}
          chainName={'chainName'}
          chainIcon={chainIcon}
          w={'40px'}
          h={'40px'}
          networkWidth={'15px'}
          networkHeight={'15px'}
          leftSmallImg={'24px'}
        />
      )}
      <VStack justifyContent={'start'} alignItems={'start'} gap={'4px'}>
        {loading ? (
          <Skeleton w={'100px'} h={'16px'} borderRadius="12px" />
        ) : (
          <Text
            color="brand.text.primary"
            fontSize="16px"
            fontWeight="extrabold"
          >
            {amount}
          </Text>
        )}
        <HStack>
          {loading ? (
            <Skeleton w={'100px'} h={'16px'} borderRadius="12px" />
          ) : (
            <Text
              color="brand.text.primary"
              fontSize="12px"
              fontWeight="normal"
              opacity={0.4}
            >
              ~${price}
            </Text>
          )}
          {loading ? (
            <Skeleton w={'30px'} h={'16px'} borderRadius="12px" />
          ) : (
            <Text
              color="brand.text.primary"
              fontSize="12px"
              fontWeight="normal"
              opacity={0.4}
            >
              {slippage}
              {isNaN(Number(slippage)) ? '' : '%'}
            </Text>
          )}
          {loading ? (
            <Skeleton w={'100px'} h={'16px'} borderRadius="12px" />
          ) : (
            <Text
              color="brand.text.primary"
              fontSize="12px"
              fontWeight="normal"
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
