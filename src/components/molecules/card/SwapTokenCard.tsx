import { HStack, Text, VStack } from '@chakra-ui/react';
import { TokenIconBox } from '../TokenIconBox';

type Props = {
  tokenName: string;
  tokenIcon: string;
  tokenAmount: string;
  networkName: string;
  networkIcon: string;
};

export const SwapTokenCard = ({
  tokenName,
  tokenIcon,
  tokenAmount,
  networkName,
  networkIcon,
}: Props) => {
  return (
    <HStack>
      <TokenIconBox
        tokenName={tokenName}
        tokenIcon={tokenIcon}
        chainName={networkName}
        chainIcon={networkIcon}
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
