import { FiatStep } from '@anyalt/sdk/dist/adapter/api/api';
import { Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { selectedTokenOrFiatAmountAtom } from '../../../../store/stateStore';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { TransactionFiatStep } from '../../../molecules/steps/TransactionFiatStep';

type Props = {
  index: number;
  loading: boolean;
  fiatStep: FiatStep | undefined;
};

export const FiatStepSection = ({ index, fiatStep, loading }: Props) => {
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);

  return (
    <VStack
      gap={'12px'}
      alignItems={'flex-start'}
      color="brand.text.secondary.2"
      key={`accordion-onramper-wrapper-${index}`}
    >
      <Text textStyle={'bold.2'} lineHeight={'120%'}>
        Transaction {index + 1}: Onramper
      </Text>
      <TransactionFiatStep
        loading={loading}
        stepNumber={index + 1}
        fromToken={{
          name: fiatStep?.fiat.code || '',
          amount:
            truncateToDecimals(selectedTokenOrFiatAmount || '0', 4) || '0',
          icon: fiatStep?.fiat.logo || '',
        }}
        toToken={{
          name: fiatStep?.middleToken.symbol || '',
          amount: truncateToDecimals(fiatStep?.payout || '0', 4),
          chainName: fiatStep?.middleToken.chainName || '',
          icon: fiatStep?.middleToken.logoUrl || '',
          chainIcon: fiatStep?.middleToken?.chain?.logoUrl || '',
        }}
      />
    </VStack>
  );
};
