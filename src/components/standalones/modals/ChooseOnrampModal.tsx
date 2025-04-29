import { Box, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import {
  anyaltInstanceAtom,
  choosenFiatPaymentAtom,
  choosenOnrampPaymentAtom,
  isChooseOnrampLoadingAtom,
  isChooseOnrampModalOpenAtom,
  onrampersAtom,
  selectedRouteAtom,
  selectedTokenOrFiatAmountAtom,
} from '../../../store/stateStore';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { CloseIcon } from '../../atoms/icons/modals/CloseIcon';
import { InfoIcon } from '../../atoms/icons/modals/InfoIcon';

export const ChooseOnrampModal = () => {
  const [isOpen, setIsOpen] = useAtom(isChooseOnrampModalOpenAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);
  const setIsChooseOnrampLoading = useSetAtom(isChooseOnrampLoadingAtom);
  const [onrampers, setOnrampers] = useAtom(onrampersAtom);
  const choosenFiatPayment = useAtomValue(choosenFiatPaymentAtom);
  const selectedTokenOrFiatAmount = useAtomValue(selectedTokenOrFiatAmountAtom);

  const [choosenOnrampPayment, setChoosenOnrampPayment] = useAtom(
    choosenOnrampPaymentAtom,
  );

  useEffect(() => {
    const getOnrampers = async () => {
      try {
        setIsChooseOnrampLoading(true);
        if (!choosenFiatPayment?.paymentTypeId) {
          setIsChooseOnrampLoading(false);
          return;
        }

        const res = await anyaltInstance?.getFiatQuote({
          fiatId: selectedRoute?.fiatStep?.fiat.onramperId || '',
          tokenId: selectedRoute?.fiatStep?.middleToken.onramperId || '',
          paymentTypeId: choosenFiatPayment?.paymentTypeId || '',
          amount: Number(selectedTokenOrFiatAmount),
        });

        setOnrampers(res?.quotes);
        if (!choosenOnrampPayment) {
          setChoosenOnrampPayment(res?.quotes?.[0]);
        }

        if (res?.quotes?.length === 0) {
          setChoosenOnrampPayment(undefined);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsChooseOnrampLoading(false);
      }
    };

    getOnrampers();
  }, [anyaltInstance, isOpen, choosenFiatPayment]);

  if (!isOpen) return null;

  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      top="0"
      left="0"
      display="flex"
      flexDir="column"
      justifyContent="flex-end"
      bgColor="rgba(0, 0, 0, 0.5)"
      backdropFilter="blur(10px)"
      zIndex="2000"
    >
      <Box
        width="100%"
        minH="198px"
        padding="24px"
        borderRadius="16px 16px 12px 12px"
        bgColor="brand.bg.modal"
        color="brand.text.primary"
        overflow="hidden"
        position="relative"
        border="1px solid"
        borderColor="brand.border.secondary"
        borderBottom="none"
        zIndex="100"
      >
        <Box
          cursor="pointer"
          position="absolute"
          top="16px"
          right="16px"
          onClick={() => setIsOpen(false)}
        >
          <Icon as={CloseIcon} color="brand.buttons.close.primary" />
        </Box>
        <Box
          display="flex"
          flexDir="row"
          alignItems="center"
          gap="10px"
          mb="24px"
        >
          <Text fontSize="20px" fontWeight="bold">
            Payment Method
          </Text>
          <InfoIcon />
        </Box>
        <VStack alignItems="flex-start" gap="8px">
          {onrampers?.map((onramp) => {
            return (
              <HStack
                w="100%"
                gap="16px"
                cursor="pointer"
                border="1px solid"
                borderColor="brand.border.secondary"
                borderRadius="8px"
                p="12px 8px"
                justifyContent={'space-between'}
                onClick={() => {
                  console.log(onramp);
                  setChoosenOnrampPayment(onramp);
                  setIsOpen(false);
                }}
              >
                <HStack gap="8px">
                  <Image
                    src={onramp.rampLogo}
                    alt={onramp.rampLogo}
                    w={'32px'}
                    h={'32px'}
                  />
                  <VStack alignItems="flex-start">
                    <Text textStyle="extraBold.2">{onramp.ramp}</Text>
                    <Text textStyle="regular.3">Best Price</Text>
                  </VStack>
                </HStack>
                <VStack alignItems="flex-end">
                  <Text textStyle="regular.3">You get</Text>
                  <Text textStyle="regular.3">
                    {truncateToDecimals(onramp.payout.toString(), 5)}{' '}
                    {selectedRoute?.fiatStep?.middleToken.symbol}
                  </Text>
                </VStack>
              </HStack>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};
