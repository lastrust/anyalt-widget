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
        <Text textStyle={'bold.1'}>{amount}</Text>
        <Text textStyle={'regular.3'} color="brand.text.secondary.2">
          {tokenName} {chainName ? `On ${chainName}` : ''}
        </Text>
      </VStack>
    </HStack>
  );
};
