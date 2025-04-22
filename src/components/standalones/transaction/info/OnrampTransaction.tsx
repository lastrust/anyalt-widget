import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { HStack, Image, Skeleton, Text } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  choosenOnrampPaymentAtom,
  isChooseOnrampLoadingAtom,
  isChooseOnrampModalOpenAtom,
  onrampersAtom,
} from '../../../../store/stateStore';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { ArrowIcon } from '../../../atoms/icons/payments/ArrowIcon';
import { LoadingFallback } from '../../../molecules/fallback/LoadingFallback';
import { TokenQuoteBox } from '../../selectSwap/token/quote/TokenQuoteBox';
import { SepartionBlock } from './TransactionInfo';

type Props = {
  selectedRoute: GetAllRoutesResponseItem | undefined;
  inTokenAmount: string | undefined;
};

export const OnrampTransaction = ({ selectedRoute, inTokenAmount }: Props) => {
  const setIsChooseOnrampModalOpen = useSetAtom(isChooseOnrampModalOpenAtom);
  const choosenOnrampPayment = useAtomValue(choosenOnrampPaymentAtom);
  const isChooseOnrampLoading = useAtomValue(isChooseOnrampLoadingAtom);
  const onrampers = useAtomValue(onrampersAtom);

  return (
    <>
      <TokenQuoteBox
        loading={false}
        headerText=""
        tokenName={selectedRoute?.fiatStep?.fiat.code || ''}
        tokenLogo={selectedRoute?.fiatStep?.fiat.logo || ''}
        chainName={selectedRoute?.fiatStep?.fiat.name}
        chainLogo={''}
        amount={inTokenAmount || ''}
        price={inTokenAmount || ''}
        w={'100%'}
        p={'0'}
        m={'0'}
      />
      <SepartionBlock />
      <TokenQuoteBox
        loading={false}
        headerText=""
        tokenName={selectedRoute?.fiatStep?.middleToken.name || ''}
        tokenLogo={selectedRoute?.fiatStep?.middleToken.logoUrl || ''}
        chainName={selectedRoute?.fiatStep?.middleToken.chainName || ''}
        chainLogo={selectedRoute?.fiatStep?.middleToken.chain?.logoUrl || ''}
        amount={truncateToDecimals(selectedRoute?.fiatStep?.payout || '', 4)}
        price={truncateToDecimals(selectedRoute?.outputAmount || '', 4)}
        w={'100%'}
        p={'0'}
        m={'0'}
      />
      <HStack
        cursor={'pointer'}
        w={'100%'}
        justifyContent={'space-between'}
        borderRadius={'8px'}
        bgColor={'brand.bg.cardBg'}
        p="8px"
        onClick={() => {
          if (onrampers?.length) {
            setIsChooseOnrampModalOpen(true);
          }
        }}
      >
        <Text color={'brand.text.secondary.2'} textStyle={'regular.3'}>
          1 ETH ~ 1000 USD
        </Text>
        <LoadingFallback loading={isChooseOnrampLoading} w={'80px'} h={'16px'}>
          {choosenOnrampPayment ? (
            <HStack gap="8px">
              <Text color={'brand.text.secondary.2'} textStyle={'regular.3'}>
                By
              </Text>
              <Image
                src={choosenOnrampPayment?.rampLogo}
                w={'16px'}
                h={'16px'}
                borderRadius={'50%'}
                fallback={<Skeleton width={'16px'} height={'16px'} />}
              />
              <Text color={'brand.text.secondary.2'} textStyle={'regular.3'}>
                {choosenOnrampPayment?.ramp}
              </Text>
              <ArrowIcon />
            </HStack>
          ) : (
            <Text color={'brand.text.secondary.2'} textStyle={'regular.3'}>
              Please select another payment method
            </Text>
          )}
        </LoadingFallback>
      </HStack>
    </>
  );
};
