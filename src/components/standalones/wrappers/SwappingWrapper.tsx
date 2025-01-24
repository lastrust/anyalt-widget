import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react';
import configIcon from '../../../assets/imgs/config-icon.svg';

type Props = {
  title?: string;
  secondTitle?: string;
  secondSubtitle?: string;
  onConfigClick: () => void;
  children: React.ReactNode;
  failedToFetchRoute: boolean;
};

export const SwappingWrapper = ({
  title,
  secondTitle,
  secondSubtitle,
  onConfigClick,
  children,
  failedToFetchRoute,
}: Props) => {
  return (
    <Box
      margin="24px 0px"
      border="1px solid"
      borderColor={failedToFetchRoute ? 'brand.quinary.100' : 'transparent'}
      borderRadius="12px"
    >
      <Grid gridTemplateColumns={secondTitle ? '1fr 1fr' : '1fr'} gap="16px">
        {title && (
          <Flex justifyContent="space-between" alignItems="center" mb="16px">
            <Text color="white" fontSize="24px" fontWeight="bold">
              {title}
            </Text>
            <Box cursor="pointer">
              <Image src={configIcon} alt="config" onClick={onConfigClick} />
            </Box>
          </Flex>
        )}
        {secondTitle && (
          <Flex
            justifyContent="space-between"
            flexDir={'column'}
            alignItems="left"
            mb="16px"
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
      {children}
      {failedToFetchRoute && (
        <Box
          mt="16px"
          padding="4px"
          bgColor="brand.quinary.10"
          borderRadius="8px"
          width="100%"
        >
          <Text color="brand.quinary.100" fontSize="14px" fontWeight="bold">
            No Available Route
          </Text>
        </Box>
      )}
    </Box>
  );
};
