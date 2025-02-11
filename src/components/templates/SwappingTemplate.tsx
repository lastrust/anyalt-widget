import {
  Box,
  BoxProps,
  Flex,
  Grid,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ConfigIcon } from '../atoms/icons/selectToken/ConfigIcon';

type Props = {
  title?: string;
  secondTitle?: string;
  subtitle?: string;
  secondSubtitle?: string;
  onConfigClick?: () => void;
  children: React.ReactNode;
} & BoxProps;

export const SwappingTemplate = ({
  title,
  subtitle,
  secondTitle,
  secondSubtitle,
  onConfigClick,
  children,
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
          <Flex justifyContent="space-between" alignItems="center">
            <VStack alignItems="left">
              <Text color="brand.text.primary" textStyle={'bold.0'}>
                {title}
              </Text>
              {subtitle && (
                <Text
                  fontSize={'14px'}
                  fontWeight={'normal'}
                  color="brand.secondary.2"
                >
                  {subtitle}
                </Text>
              )}
            </VStack>
            {onConfigClick && (
              <Box cursor="pointer" onClick={onConfigClick}>
                <Icon as={ConfigIcon} color="brand.tertiary.100" />
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
