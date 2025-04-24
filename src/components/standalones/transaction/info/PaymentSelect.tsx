import { SupportedPaymentType } from '@anyalt/sdk/dist/adapter/api/api';
import { HStack, Text } from '@chakra-ui/react';
import { ArrowIcon } from '../../../atoms/icons/payments/ArrowIcon';
import { CardIcon } from '../../../atoms/icons/payments/CardIcon';
import { LoadingFallback } from '../../../molecules/fallback/LoadingFallback';

type Props = {
  isOnramperStep: boolean;
  isPaymentMethodLoading: boolean;
  choosenFiatPaymentMethod: SupportedPaymentType | undefined;
  setIsPaymentMethodModalOpen: (open: boolean) => void;
};

export const PaymentSelect = ({
  isOnramperStep,
  isPaymentMethodLoading,
  choosenFiatPaymentMethod,
  setIsPaymentMethodModalOpen,
}: Props) => {
  if (!isOnramperStep) return null;

  return (
    <HStack
      onClick={() => setIsPaymentMethodModalOpen(true)}
      cursor={'pointer'}
      w={'100%'}
      justifyContent={'space-between'}
      borderRadius={'8px'}
      bgColor={'brand.bg.cardBg'}
      p="8px"
    >
      <LoadingFallback
        loading={isPaymentMethodLoading}
        w={'80px'}
        h={'16px'}
        borderRadius={'12px'}
      >
        <HStack gap="8px">
          <CardIcon />
          <Text color={'brand.text.secondary.2'} textStyle={'regular.3'}>
            {choosenFiatPaymentMethod?.name}
          </Text>
        </HStack>
        <ArrowIcon />
      </LoadingFallback>
    </HStack>
  );
};
