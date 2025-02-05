import { SwapResultAsset } from '@anyalt/sdk/dist/adapter/api/api';
import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { CopyIcon } from '../../atoms/icons/CopyIcon';
import { TokenCard } from '../../molecules/card/TokenCard';

type SwapResultAssetWithAmount = SwapResultAsset & { amount: string };

type Props = {
  requestId: string;
  from?: SwapResultAssetWithAmount | undefined;
  to?: SwapResultAssetWithAmount | undefined;
};

export const GeneralTransactionInfo = ({ requestId, to, from }: Props) => {
  return (
    <VStack
      w="100%"
      p="16px"
      gap={'12px'}
      borderWidth={'1px'}
      borderRadius="10px"
      bg="brand.secondary.6"
      borderColor="brand.border.primary"
    >
      <VStack w="100%" gap={'16px'} alignItems="flex-start">
        <Text color="white" fontSize="24px" fontWeight="bold">
          Transaction Overview
        </Text>
        <HStack justifyContent={'space-between'} w="100%">
          <TokenCard
            tokenName={from?.symbol || ''}
            tokenIcon={from?.logo || ''}
            chainName={from?.blockchain || ''}
            chainIcon={from?.blockchainLogo || ''}
            amount={from?.amount || ''}
          />
          <TokenCard
            tokenName={to?.symbol || ''}
            tokenIcon={to?.logo || ''}
            chainName={to?.blockchain || ''}
            chainIcon={to?.blockchainLogo || ''}
            amount={to?.amount || ''}
          />
        </HStack>
      </VStack>
      <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
      <HStack justifyContent={'space-between'} w="100%">
        <Text textStyle={'regular.3'} color="brand.secondary.3">
          RequestID: {requestId}
        </Text>
        <Box cursor={'pointer'}>
          <CopyIcon />
        </Box>
      </HStack>
    </VStack>
  );
};
