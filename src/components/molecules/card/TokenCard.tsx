import { HStack, Text, VStack } from '@chakra-ui/react';
import { TokenIconBox } from '../TokenIconBox';

type Props = {
  tokenName: string;
  tokenIcon: string;
  chainName: string;
  chainIcon: string;
  amount: string;
};

export const TokenCard = ({
  tokenName,
  tokenIcon,
  chainName,
  chainIcon,
  amount,
}: Props) => {
  return (
    <HStack gap={'8px'}>
      <TokenIconBox
        tokenName={tokenName}
        tokenIcon={tokenIcon}
        chainName={chainName}
        chainIcon={chainIcon}
      />
      <VStack alignItems={'flex-start'} gap={'4px'}>
        <Text fontSize="16px" fontWeight="bold">
          {amount}
        </Text>
        <Text fontSize="12px" color="brand.secondary.3">
          {tokenName} On {chainName}
        </Text>
      </VStack>
    </HStack>
  );
};
