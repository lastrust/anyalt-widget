import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react';
import { ConfigIcon } from '../atoms/icons/selectToken/ConfigIcon';

type Props = {
  title?: string;
  secondTitle?: string;
  subtitle?: string;
  secondSubtitle?: string;
  onConfigClick?: () => void;
  children: React.ReactNode;
};

export const SwappingTemplate = ({
  title,
  subtitle,
  secondTitle,
  secondSubtitle,
  onConfigClick,
  children,
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
    >
      <Grid
        gridTemplateColumns={secondTitle ? '1fr 1fr' : '1fr'}
        gap="16px"
        w={'100%'}
      >
        {title && (
          <Flex justifyContent="space-between" alignItems="center">
            <VStack alignItems="left">
              <Text color="white" textStyle={'bold.0'}>
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
                <ConfigIcon />
              </Box>
            )}
          </Flex>
        )}
        {secondTitle && (
          <Flex
            justifyContent="space-between"
            flexDir={'column'}
            alignItems="left"
          >
            <Text color="white" fontSize="24px" fontWeight="bold">
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
      <Box w={'100%'}>{children}</Box>
    </VStack>
  );
};
