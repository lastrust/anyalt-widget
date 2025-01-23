import { Box, Button, Flex, Grid, Image, Text } from '@chakra-ui/react';
import configIcon from '../../../assets/imgs/config-icon.svg';

type Props = {
  loading: boolean;
  title: string;
  secondTitle?: string;
  secondSubtitle?: string;
  buttonText: string;
  onConfigClick: () => void;
  onButtonClick: () => void;
  children: React.ReactNode;
  failedToFetchRoute: boolean;
};

export const SwappingWrapper = ({
  loading,
  title,
  secondTitle,
  secondSubtitle,
  buttonText,
  onButtonClick,
  onConfigClick,
  children,
  failedToFetchRoute,
}: Props) => {
  return (
    <Box
      margin="24px 0px"
      padding="24px"
      border="1px solid"
      borderColor={
        failedToFetchRoute ? 'brand.quinary.100' : 'brand.secondary.12'
      }
      borderRadius="12px"
    >
      <Grid gridTemplateColumns={secondTitle ? '1fr 1fr' : '1fr'} gap="16px">
        <Flex justifyContent="space-between" alignItems="center" mb="16px">
          <Text color="white" fontSize="24px" fontWeight="bold">
            {title}
          </Text>
          <Box cursor="pointer">
            <Image src={configIcon} alt="config" onClick={onConfigClick} />
          </Box>
        </Flex>
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
      <Button
        width={secondTitle ? '50%' : '100%'}
        bg="brand.tertiary.100"
        color="white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        h="64px"
        onClick={onButtonClick}
        isLoading={loading}
      >
        {buttonText}
      </Button>

      {failedToFetchRoute && (
        <Box
          mt="16px"
          padding="4px"
          bgColor="brand.quinary.10"
          borderRadius="8px"
          width="100%"
        >
          <Text color="brand.quinary.100" fontSize="14px" fontWeight="bold">
            Route failed, please try again
          </Text>
        </Box>
      )}
    </Box>
  );
};
