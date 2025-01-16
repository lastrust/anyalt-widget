import { BoxProps, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  amount: number;
  price: number;
  tokenName: string;
  difference: number;
  network: string;
  tokenIcon: string;
};

export const TokenRouteInfo: FC<Props> = ({
  amount,
  price,
  tokenName,
  tokenIcon,
  network,
  difference,
  ...props
}) => {
  return (
    <Flex justifyContent={'start'} w={'full'} alignItems={'center'} {...props}>
      <Image
        src={tokenIcon}
        alt={`${tokenName} Icon`}
        marginRight={'8px'}
        width="40px"
        height="40px"
      />
      <VStack justifyContent={'start'} alignItems={'start'} gap={'8px'}>
        <Text color="white" fontSize="16px" fontWeight="extrabold">
          {amount}
        </Text>
        <HStack>
          <Text
            color="white"
            fontSize="12px"
            fontWeight="regular"
            opacity={0.4}
          >
            ~${price}
          </Text>
          <Text
            color="white"
            fontSize="12px"
            fontWeight="regular"
            opacity={0.4}
          >
            {difference}%
          </Text>
          <Text
            color="white"
            fontSize="12px"
            fontWeight="regular"
            opacity={0.4}
          >
            {network}
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
};
