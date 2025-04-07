import { SupportedToken } from '@anyalt/sdk';
import { Skeleton, VStack } from '@chakra-ui/react';
import { TokenItem } from '../../../molecules/TokenItem';

type Props = {
  isLoading: boolean;
  allCurrencies: SupportedToken[];
  onCurrencySelect: (currency: SupportedToken) => void;
};

export const CurrenciesList = ({
  allCurrencies,
  isLoading,
  onCurrencySelect,
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

  return (
    <>
      {allCurrencies.map((currency) => (
        <TokenItem
          key={currency.id}
          tokenSymbol={currency.symbol}
          tokenIcon={currency.logoUrl}
          tokenAddress={currency.tokenAddress ?? ''}
          onClick={() => {
            onCurrencySelect(currency);
          }}
        />
      ))}
    </>
  );
};
