import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { getImageURL } from '../../../utils';

type Props = {
  exchangeName: string;
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
  fromToken,
  toToken,
}: Props) => {
  return (
    <Flex w={'full'}>
      <Box>
        <Text
          color="brand.secondary.3"
          fontSize="16px"
          fontWeight="extrabold"
          mb={'8px'}
        >
          Swap token using {exchangeName}
        </Text>
        <Box display={'flex'} flexDir={'row'} alignItems={'center'}>
          <Image
            src={fromToken.chainLogo}
            alt={`${fromToken.chainLogo} Icon`}
            mr={'3px'}
            width="20px"
            height="20px"
          />
          <Text
            color="brand.secondary.3"
            fontSize="12px"
            fontWeight="regular"
            mr={'8px'}
          >
            {fromToken.amount} {fromToken.name} on {fromToken.chainName}
          </Text>
          <Image
            src={getImageURL('arrow-right.svg')}
            alt={'arrow-right'}
            mr={'8px'}
            width="9px"
            height="9px"
          />
          <Image
            src={toToken.chainLogo}
            alt={`${toToken.chainLogo} Icon`}
            mr={'3px'}
            width="20px"
            height="20px"
          />
          <Text
            color="brand.secondary.3"
            fontSize="12px"
            fontWeight="regular"
            mr={'8px'}
          >
            {toToken.amount} {toToken.name} on {toToken.chainName}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};
