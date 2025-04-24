import { FiatStep } from '@anyalt/sdk/dist/adapter/api/api';
import { HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { selectedTokenOrFiatAmountAtom } from '../../../../store/stateStore';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { CheckIcon } from '../../../atoms/icons/transaction/CheckIcon';
import { TransactionFiatStep } from '../../../molecules/steps/TransactionFiatStep';

type Props = {
  index: number;
  loading: boolean;
  isAlreadyCompleted: boolean;
  fiatStep: FiatStep | undefined;
};

export const FiatStepSection = ({
  index,
  fiatStep,
  isAlreadyCompleted,
  loading,
}: Props) => {
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);

  return (
    <VStack
      gap={'12px'}
      alignItems={'flex-start'}
      color="brand.text.secondary.2"
      key={`accordion-onramper-wrapper-${index}`}
    >
      <HStack>
        <Text textStyle={'bold.2'} lineHeight={'120%'}>
          Transaction {index + 1}: Onramper{' '}
        </Text>
        {isAlreadyCompleted && (
          <Icon as={CheckIcon} width={'10px'} height={'10px'} />
        )}
      </HStack>
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
