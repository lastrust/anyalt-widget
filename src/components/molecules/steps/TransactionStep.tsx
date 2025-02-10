import {
  Box,
  Flex,
  HStack,
  Image,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '../../atoms/icons/transaction/ArrowRightIcon';

type Props = {
  exchangeName: string;
  exchangeLogo: string;
  fromToken: {
    name: string;
    amount: string;
    tokenLogo: string;
    chainName: string;
    chainLogo: string;
  };
  toToken: {
    name: string;
    amount: string;
    tokenLogo: string;
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
            borderRadius={'50%'}
            border="1px solid white"
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
            <Box position="relative" minW={'20px'} minH={'20px'}>
              <Image
                src={fromToken.tokenLogo}
                alt={`${fromToken.name} Icon`}
                width="20px"
                height="20px"
                borderRadius={'50%'}
                border="1px solid white"
              />
              <Box
                position="absolute"
                bottom="-3px"
                left="14px"
                w={'8px'}
                h={'8px'}
              >
                {fromToken.chainLogo !== '' ? (
                  <Image
                    src={fromToken.chainLogo}
                    alt={`${fromToken.chainName} Icon`}
                    width="8px"
                    height="8px"
                    borderRadius="50%"
                  />
                ) : (
                  <SkeletonCircle size="14px" bgColor="brand.secondary.100" />
                )}
              </Box>
            </Box>
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
          <HStack gap={'2px'}>
            <Box position="relative" minW={'20px'} minH={'20px'}>
              <Image
                src={toToken.tokenLogo}
                alt={`${toToken.name} Icon`}
                width="20px"
                height="20px"
                borderRadius={'50%'}
                border="1px solid white"
              />
              <Box
                position="absolute"
                bottom="-3px"
                left="14px"
                w={'8px'}
                h={'8px'}
              >
                {fromToken.chainLogo !== '' ? (
                  <Image
                    src={toToken.chainLogo}
                    alt={`${toToken.chainName} Icon`}
                    width="8px"
                    height="8px"
                    borderRadius="50%"
                  />
                ) : (
                  <SkeletonCircle size="14px" bgColor="brand.secondary.100" />
                )}
              </Box>
            </Box>
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
