import {
  Box,
  BoxProps,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ConfigIcon } from '../atoms/icons/selectToken/ConfigIcon';
import { BackButton } from '../molecules/buttons/BackButton';
import { CrossChainWarningCard } from '../molecules/card/CrossChainWarning';
import { PaymentMethodModal } from '../standalones/modals/PaymentMethodModal';
import { WidgetMode } from '../standalones/widgetMode/WidgetMode';

type Props = {
  title?: string;
  subtitle?: string;
  secondTitle?: string;
  secondSubtitle?: string;
  withDisclaimer?: boolean;
  enableWidgetMode?: boolean;
  onConfigClick?: () => void;
  onBackClick?: () => void;
  isPaymentModalActive?: boolean;
  children: React.ReactNode;
} & BoxProps;

export const SwappingTemplate = ({
  title,
  children,
  subtitle,
  secondTitle,
  secondSubtitle,
  enableWidgetMode,
  onConfigClick,
  onBackClick,
  withDisclaimer = false,
  isPaymentModalActive = false,
  ...props
}: Props) => {
  return (
    <VStack
      w="100%"
      p="24px"
      gap="16px"
      borderWidth="1px"
      borderRadius="12px"
      margin="24px 0px 16px"
      alignItems={'flex-start'}
      borderColor="brand.border.primary"
      pos={isPaymentModalActive ? 'relative' : 'unset'}
      {...props}
    >
      {title && (
        <Grid
          gridTemplateColumns={secondTitle ? '1fr 1fr' : '1fr'}
          gap="16px"
          w={'100%'}
        >
          <Flex justifyContent="space-between" alignItems="center" w={'100%'}>
            <VStack alignItems="left" w={'100%'}>
              {enableWidgetMode ? (
                <WidgetMode />
              ) : (
                <HStack>
                  <BackButton onBackClick={onBackClick} />
                  <Text color="brand.text.primary" textStyle={'bold.0'}>
                    {title}
                  </Text>
                </HStack>
              )}
              {subtitle && (
                <HStack w={'100%'} justifyContent={'space-between'}>
                  <Text
                    fontSize={'14px'}
                    fontWeight={'normal'}
                    color="brand.text.secondary.1"
                    whiteSpace={'nowrap'}
                  >
                    {subtitle}
                  </Text>
                  {withDisclaimer && <CrossChainWarningCard />}
                </HStack>
              )}
            </VStack>
            {onConfigClick && (
              <Button
                maxH={'24px'}
                cursor="pointer"
                color="brand.text.active"
                onClick={onConfigClick}
              >
                <Icon as={ConfigIcon} />
              </Button>
            )}
          </Flex>
          {secondTitle && (
            <Flex
              justifyContent="space-between"
              flexDir={'column'}
              alignItems="left"
            >
              <Text
                color="brand.text.primary"
                fontSize="24px"
                fontWeight="bold"
              >
                {secondTitle}
              </Text>
              <Text
                fontSize={'14px'}
                fontWeight={'normal'}
                color="brand.text.secondary.1"
              >
                {secondSubtitle}
              </Text>
            </Flex>
          )}
        </Grid>
      )}

      <Box w={'100%'} h={'100%'}>
        {children}
      </Box>
      {isPaymentModalActive && <PaymentMethodModal />}
    </VStack>
  );
};
