import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { ArrowRightIcon } from '../../atoms/icons/transaction/ArrowRightIcon';

type Props = {
  exchangeName: string;
  exchangeLogo: string;
  fromToken: {
    name: string;
    amount: string;
    chainName: string;
    chainLogo: string;
  };
  toToken: {
    name: string;
    amount: string;
    chainName: string;
    chainLogo: string;
  };
};

export const TransactionStep = ({
  exchangeName,
  exchangeLogo,
  fromToken,
  toToken,
}: Props) => {
  const textFirst = `${fromToken.amount} ${fromToken.name} on ${fromToken.chainName}`;
  const textSecond = `${toToken.amount} ${toToken.name} on ${toToken.chainName}`;
  return (
    <Flex w={'full'}>
      <HStack gap={'20px'}>
        <HStack>
          <Image
            src={exchangeLogo}
            alt={`${exchangeLogo} Icon`}
            width="20px"
            height="20px"
          />
          <Text
            color="brand.secondary.3"
            textStyle={'bold.3'}
            fontSize={'12px'}
            noOfLines={1}
            minW={'100px'}
          >
            {exchangeName}:
          </Text>
        </HStack>
        <HStack alignItems={'center'} gap="3px">
          <HStack gap={'2px'}>
            <Image
              src={fromToken.chainLogo}
              alt={`${fromToken.chainLogo} Icon`}
              width="20px"
              height="20px"
            />
            <Text
              color="brand.secondary.3"
              fontSize="12px"
              fontWeight="regular"
              noOfLines={1}
            >
              {textFirst}
            </Text>
          </HStack>
          <Box>
            <ArrowRightIcon />
          </Box>
          <HStack>
            <Image
              src={toToken.chainLogo}
              alt={`${toToken.chainLogo} Icon`}
              width="20px"
              height="20px"
            />
            <Box>
              <Text
                color="brand.secondary.3"
                textStyle={'regular.3'}
                noOfLines={1}
              >
                {textSecond}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </HStack>
    </Flex>
  );
};
