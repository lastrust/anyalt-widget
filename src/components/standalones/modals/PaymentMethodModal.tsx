import { SupportedPaymentType } from '@anyalt/sdk/dist/adapter/api/api';
import { Box, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  anyaltInstanceAtom,
  choosenFiatPaymentAtom,
  isPaymentMethodLoadingAtom,
  isPaymentMethodModalOpenAtom,
  selectedRouteAtom,
} from '../../../store/stateStore';
import { CloseIcon } from '../../atoms/icons/modals/CloseIcon';
import { InfoIcon } from '../../atoms/icons/modals/InfoIcon';

export const PaymentMethodModal = () => {
  const [isOpen, setIsOpen] = useAtom(isPaymentMethodModalOpenAtom);
  const anyaltInstance = useAtomValue(anyaltInstanceAtom);
  const selectedRoute = useAtomValue(selectedRouteAtom);
  const setIsPaymentMethodLoading = useSetAtom(isPaymentMethodLoadingAtom);
  const [paymentMethods, setPaymentMethods] = useState<
    SupportedPaymentType[] | undefined
  >(undefined);
  const [choosenFiatPayment, setChoosenFiatPayment] = useAtom(
    choosenFiatPaymentAtom,
  );

  useEffect(() => {
    const getPaymentMethods = async () => {
      try {
        setIsPaymentMethodLoading(true);
        const res = await anyaltInstance?.getPaymentTypes({
          fiatId: selectedRoute?.fiatStep?.fiat.onramperId || '',
          tokenId: selectedRoute?.fiatStep?.middleToken.onramperId || '',
        });
        setPaymentMethods(res?.paymentTypes);
        if (!choosenFiatPayment) {
          setChoosenFiatPayment(res?.paymentTypes[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsPaymentMethodLoading(false);
      }
    };
    getPaymentMethods();
  }, [anyaltInstance, selectedRoute, isOpen]);

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
          {paymentMethods?.map((paymentMethod) => {
            return (
              <HStack
                w="100%"
                alignItems="left"
                gap="16px"
                cursor="pointer"
                border="1px solid"
                borderColor="brand.border.secondary"
                borderRadius="8px"
                p="12px 8px"
                onClick={() => {
                  setChoosenFiatPayment(paymentMethod);
                  setIsOpen(false);
                }}
              >
                <Image src={paymentMethod.icon} alt={paymentMethod.name} />
                <Text textStyle="extraBold.2">{paymentMethod.name}</Text>
              </HStack>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};
