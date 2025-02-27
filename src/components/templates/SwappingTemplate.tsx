import {
  Box,
  BoxProps,
  Flex,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ConfigIcon } from '../atoms/icons/selectToken/ConfigIcon';
import { SelectTokenIcon } from '../atoms/icons/selectToken/SelectTokenIcon';
import { CrossChainWarningCard } from '../molecules/card/CrossChainWarning';

type Props = {
  title?: string;
  subtitle?: string;
  secondTitle?: string;
  withDisclaimer?: boolean;
  secondSubtitle?: string;
  onConfigClick?: () => void;
  onBackClick?: () => void;
  children: React.ReactNode;
} & BoxProps;

export const SwappingTemplate = ({
  title,
  children,
  subtitle,
  secondTitle,
  secondSubtitle,
  onConfigClick,
  onBackClick,
  withDisclaimer = false,
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
              <HStack>
                {onBackClick && (
                  <Box
                    cursor="pointer"
                    color={'brand.tertiary.100'}
                    _hover={{
                      color: 'brand.tertiary.90',
                    }}
                    onClick={onBackClick}
                    transform={'rotate(180deg)'}
                  >
                    <Icon as={SelectTokenIcon} w={'24px'} h={'24px'} />
                  </Box>
                )}
                <Text color="brand.text.primary" textStyle={'bold.0'}>
                  {title}
                </Text>
              </HStack>
              {subtitle && (
                <HStack w={'100%'} justifyContent={'space-between'}>
                  <Text
                    fontSize={'14px'}
                    fontWeight={'normal'}
                    color="brand.secondary.2"
                    whiteSpace={'nowrap'}
                  >
                    {subtitle}
                  </Text>
                  {withDisclaimer && <CrossChainWarningCard />}
                </HStack>
              )}
            </VStack>
            {onConfigClick && (
              <Box
                cursor="pointer"
                color="brand.tertiary.100"
                onClick={onConfigClick}
              >
                <Icon as={ConfigIcon} />
              </Box>
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
                color="brand.secondary.2"
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
    </VStack>
  );
};
