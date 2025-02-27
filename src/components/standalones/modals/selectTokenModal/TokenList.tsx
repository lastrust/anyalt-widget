import { SupportedToken } from '@anyalt/sdk';
import { Skeleton, VStack } from '@chakra-ui/react';
import { TokenAcceptAlert } from '../../../molecules/TokenAcceptAlert';
import { TokenItem } from '../../../molecules/TokenItem';

type Props = {
  isLoading: boolean;
  showAccept: boolean;
  isValidAddress: boolean;
  allTokens: SupportedToken[];
  customToken: SupportedToken | null;
  setShowAccept: (show: boolean) => void;
  onTokenSelect: (token: SupportedToken) => void;
};

export const TokenList = ({
  showAccept,
  allTokens,
  isLoading,
  customToken,
  isValidAddress,
  setShowAccept,
  onTokenSelect,
}: Props) => {
  if (isLoading) {
    return (
      <VStack w="100%" spacing={'28px'}>
        <Skeleton height="53px" w="100%" borderRadius="8px" />
        <Skeleton height="53px" w="100%" borderRadius="8px" />
        <Skeleton height="53px" w="100%" borderRadius="8px" />
      </VStack>
    );
  }

  if (isValidAddress && customToken) {
    if (showAccept)
      return (
        <TokenAcceptAlert
          onClick={() => {
            setShowAccept(false);
            onTokenSelect(customToken);
          }}
        />
      );

    return (
      <TokenItem
        tokenSymbol={customToken.symbol}
        tokenIcon={customToken.logoUrl}
        tokenAddress={customToken.tokenAddress ?? ''}
        onClick={() => {
          setShowAccept(true);
        }}
      />
    );
  }

  return (
    <>
      {allTokens.map((token) => (
        <TokenItem
          key={token.id}
          tokenSymbol={token.symbol}
          tokenIcon={token.logoUrl}
          tokenAddress={token.tokenAddress ?? ''}
          onClick={() => {
            onTokenSelect(token);
          }}
        />
      ))}
    </>
  );
};
