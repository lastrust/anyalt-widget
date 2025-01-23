import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { CopyIcon } from '../../atoms/icons/transaction/CopyIcon';
interface TransactionStatusProps {
  requestId: string;
  status: string;
}

type SwapTokenProps = {
  tokenName: string;
  tokenIcon: string;
  tokenAmount: string;
  networkName: string;
  networkIcon: string;
};

const SwapToken = ({
  tokenName,
  tokenIcon,
  tokenAmount,
  networkName,
}: SwapTokenProps) => {
  return (
    <HStack>
      <Image
        src={tokenIcon}
        alt={tokenName}
        width="32px"
        height="32px"
        bg={'gray'}
        borderRadius={'50%'}
      />
      <VStack alignItems="flex-start" justifyContent={'space-between'}>
        <Text color="white" textStyle={'extraBold.3'}>
          {tokenAmount}
        </Text>
        <Text color="brand.secondary.3" textStyle={'regular.3'}>
          {tokenName} on {networkName}
        </Text>
      </VStack>
    </HStack>
  );
};

export const TransactionStatus: FC<TransactionStatusProps> = ({
  requestId,
}) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(requestId);
  };

  return (
    <VStack
      p="24px"
      w="100%"
      borderRadius={'16px'}
      alignItems="flex-start"
      spacing="16px"
      borderColor={'brand.border.primary'}
      borderWidth={'1px'}
    >
      <VStack
        w="100%"
        p="24px"
        borderRadius="16px"
        borderWidth="1px"
        borderColor="brand.border.primary"
        alignItems="flex-start"
        gap={'16px'}
      >
        <Text color="white" textStyle={'heading.2'}>
          Transaction Status
        </Text>
        <HStack justifyContent={'space-between'} w={'100%'}>
          <SwapToken
            tokenName="ETH"
            tokenIcon="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628"
            tokenAmount="1.000"
            networkName="Ethereum"
            networkIcon="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628"
          />
          <SwapToken
            tokenName="ETH"
            tokenIcon="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628"
            tokenAmount="1.000"
            networkName="Ethereum"
            networkIcon="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628"
          />
        </HStack>
        <Divider />
        <VStack alignItems="flex-start" spacing="16px" w={'100%'}>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Text color="brand.secondary.3" fontSize="14px">
              Request ID:
            </Text>
            <Flex alignItems="center" gap="8px">
              <Text color="brand.secondary.2" fontSize="14px">
                {requestId}
              </Text>
              <Box
                as="button"
                onClick={handleCopyClick}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
              >
                <CopyIcon />
              </Box>
            </Flex>
          </Flex>
        </VStack>
      </VStack>
    </VStack>
  );
};
