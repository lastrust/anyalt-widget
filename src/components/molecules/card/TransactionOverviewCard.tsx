import { Token } from '@anyalt/sdk/dist/adapter/api/api';
import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { CopyIcon } from '../../atoms/icons/CopyIcon';
import { ArrowRightIcon } from '../../atoms/icons/transaction/ArrowRightIcon';
import { TokenCard } from './TokenCard';

export type TokenWithAmount = Token & { amount: string };

type Props = {
  operationId: string;
  from: TokenWithAmount | undefined;
  to: TokenWithAmount | undefined;
};

export const TransactionOverviewCard = ({ operationId, to, from }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setIsCopied(true);
    navigator.clipboard.writeText(operationId);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, []);

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
        <Text color="brand.text.primary" textStyle={'bold.0'}>
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
          <Box>
            <ArrowRightIcon />
          </Box>
          <TokenCard
            tokenName={to?.symbol || ''}
            tokenIcon={to?.logo || ''}
            chainName={to?.blockchain || ''}
            chainIcon={to?.blockchainLogo || ''}
            amount={to?.amount || ''}
          />
        </HStack>
      </VStack>
      <Divider w="100%" h="1px" bgColor="brand.secondary.8" />
      <HStack justifyContent={'space-between'} w="100%">
        <Text textStyle={'regular.3'} color="brand.secondary.3">
          OperationID: {isCopied ? 'Copied' : operationId}
        </Text>
        <Box cursor={'pointer'} onClick={handleCopy}>
          <CopyIcon />
        </Box>
      </HStack>
    </VStack>
  );
};
