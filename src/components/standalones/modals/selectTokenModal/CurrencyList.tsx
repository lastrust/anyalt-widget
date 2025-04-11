import { SupportedFiat } from '@anyalt/sdk/dist/adapter/api/api';
import { Skeleton, VStack } from '@chakra-ui/react';
import { CurrencyItem } from '../../../molecules/CurrencyItem';

export type CurrencyType = {
  name: string;
  label: string;
  logoUrl: string;
  id: string;
};

type Props = {
  isLoading: boolean;
  currencies: SupportedFiat[];
  onCurrencySelect: (currency: SupportedFiat) => void;
};

export const CurrenciesList = ({
  currencies: allCurrencies,
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
        <CurrencyItem
          key={currency.code}
          tokenSymbol={currency.name}
          tokenIcon={currency.logo}
          onClick={() => {
            onCurrencySelect(currency);
          }}
        />
      ))}
    </>
  );
};
