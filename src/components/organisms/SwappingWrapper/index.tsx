import { Box, Button, Flex, Grid, Image, Text } from '@chakra-ui/react';
import configIcon from '../../../assets/imgs/config-icon.svg';

type Props = {
  title: string;
  secondTitle?: string;
  secondSubtitle?: string;
  buttonText: string;
  onButtonClick: () => void;
  children: React.ReactNode;
};

export const SwappingWrapper = ({
  title,
  secondTitle,
  secondSubtitle,
  buttonText,
  onButtonClick,
  children,
}: Props) => {
  return (
    <Box
      margin="24px 0px"
      padding="24px"
      border="1px solid"
      borderColor="brand.secondary.12"
      borderRadius="12px"
    >
      <Grid gridTemplateColumns="1fr 1fr" gap="16px">
        <Flex justifyContent="space-between" alignItems="center" mb="16px">
          <Text color="white" fontSize="24px" fontWeight="bold">
            {title}
          </Text>
          <Box cursor="pointer">
            <Image src={configIcon} alt="config" />
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
      >
        {buttonText}
      </Button>
    </Box>
  );
};
